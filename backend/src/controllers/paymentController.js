import * as momoService from '../services/momoService';
import * as orderService from '../services/orderService';
import db from '../models';

/**
 * Tạo liên kết thanh toán MoMo cho đơn hàng
 */
export const createMoMoPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseIds, useCredit, requestType, voucherCode } = req.body;

        if (courseIds && (!Array.isArray(courseIds) || courseIds.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Danh sách khóa học không hợp lệ.'
            });
        }

        // 1. Tạo đơn hàng nháp hoặc thanh toán bằng credit
        const orderResult = await orderService.createOrderFromCart(userId, courseIds, useCredit, voucherCode);
        const { orderCode, totalAmount, orderId, isPaid } = orderResult;

        if (isPaid) {
            return res.status(200).json({
                success: true,
                message: 'Thanh toán bằng Credit thành công.',
                isPaid: true,
                orderId
            });
        }

        // 2. Xác định các URL redirect & IPN
        // redirectUrl phải qua backend (ngrok) để xử lý kết quả trước khi chuyển về frontend
        const backendPublicUrl = process.env.BACKEND_PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
        const redirectUrl = `${backendPublicUrl}/api/payment/momo/redirect`;

        // ipnUrl là webhook để MoMo gọi trực tiếp sang backend (server-to-server)
        const ipnUrl = `${backendPublicUrl}/api/payment/momo/webhook`;

        console.log('--- MoMo Payment Request ---');
        console.log('Order Code:', orderCode);
        console.log('Amount:', totalAmount);
        console.log('Redirect URL:', redirectUrl);
        console.log('IPN URL (Webhook):', ipnUrl);
        console.log('Request Type:', requestType);

        // 3. Gọi dịch vụ MoMo để lấy link thanh toán
        const momoResponse = await momoService.createPaymentRequest({
            orderId: orderCode, // Dùng orderCode làm orderId cho MoMo
            amount: Number(totalAmount),
            orderInfo: `Thanh toan don hang ${orderCode} tren UTELearn`,
            redirectUrl,
            ipnUrl,
            requestType: requestType || 'captureWallet',
        });

        if (momoResponse && momoResponse.resultCode === 0) {
            return res.status(200).json({
                success: true,
                message: 'Tạo liên kết thanh toán thành công.',
                payUrl: momoResponse.payUrl,
                deeplink: momoResponse.deeplink,
                qrCodeUrl: momoResponse.qrCodeUrl,
                orderId
            });
        } else {
            console.error('MoMo API Error response:', momoResponse);
            return res.status(500).json({
                success: false,
                message: momoResponse?.message || 'Không thể tạo liên kết thanh toán MoMo.'
            });
        }
    } catch (error) {
        console.error('Error in createMoMoPayment controller:', error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Lỗi hệ thống khi xử lý thanh toán MoMo.'
        });
    }
};

/**
 * Xử lý IPN Webhook callback từ MoMo (Server-to-Server)
 * MoMo gọi API này trực tiếp qua ngrok để thông báo kết quả thanh toán.
 */
export const handleMoMoIPN = async (req, res) => {
    console.log('=== Received MoMo IPN Webhook Callback ===');
    console.log('IPN Body:', JSON.stringify(req.body, null, 2));

    try {
        const momoData = req.body;

        const { orderId: orderCode, resultCode, transId } = momoData;

        // 1. Tìm đơn hàng tương ứng trong cơ sở dữ liệu
        const order = await db.Order.findOne({ where: { code: orderCode } });
        if (!order) {
            console.error(`❌ Order not found for code: ${orderCode}`);
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log(`Found Order ID: ${order.id}, current status: ${order.status}`);

        // 2. Luôn coi mọi kết quả MoMo là thành công (cho mục đích test/demo)
        console.log(`Payment IPN for Order ${orderCode}: resultCode=${resultCode}. Auto-treating as SUCCESS.`);

        if (order.status !== 'paid') {
            // Cập nhật momoTransId và phương thức thanh toán
            await order.update({
                momoTransId: String(transId || 'MOMO_IPN_' + Date.now()),
                paymentMethod: 'momo'
            });

            // Thực hiện hoàn thành đơn hàng (kích hoạt khóa học cho học viên)
            await orderService.fulfillOrder(order.id);
            console.log(`✅ Order ${orderCode} fulfilled via IPN successfully.`);
        } else {
            console.log(`ℹ️ Order ${orderCode} already paid, skipping fulfillment.`);
        }

        // MoMo yêu cầu phản hồi lại 204 No Content
        return res.status(204).send();
    } catch (error) {
        console.error('Error in handleMoMoIPN controller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Xử lý GET redirect callback từ MoMo (sau khi user thanh toán xong hoặc huỷ bỏ trên web MoMo).
 * Đây là route browser của user gọi. MoMo sẽ redirect user trở lại URL này.
 * Backend sẽ xử lý fulfill order rồi redirect user về trang thành công trên frontend.
 */
export const handleMoMoRedirect = async (req, res) => {
    console.log('=== Received MoMo GET Redirect ===');
    console.log('Query Params:', JSON.stringify(req.query, null, 2));

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    try {
        const momoData = req.query;
        const { orderId: orderCode, resultCode, transId } = momoData;

        if (!orderCode) {
            console.error('❌ No orderCode in MoMo redirect query!');
            return res.redirect(`${frontendUrl}/order-success?error=missing_order`);
        }

        // 1. Tìm đơn hàng
        const order = await db.Order.findOne({ where: { code: orderCode } });
        if (!order) {
            console.error(`❌ Order not found for code: ${orderCode}`);
            return res.redirect(`${frontendUrl}/order-success?error=order_not_found`);
        }

        // 2. Luôn fulfill đơn hàng (test/demo mode: cả huỷ bỏ cũng coi là thành công)
        console.log(`Redirect for Order ${orderCode}: resultCode=${resultCode}. Auto-treating as SUCCESS.`);

        if (order.status !== 'paid') {
            await order.update({
                momoTransId: String(transId || 'MOMO_REDIRECT_' + Date.now()),
                paymentMethod: 'momo'
            });

            await orderService.fulfillOrder(order.id);
            console.log(`✅ Order ${orderCode} fulfilled via Redirect successfully.`);
        } else {
            console.log(`ℹ️ Order ${orderCode} already paid, skipping fulfillment.`);
        }

        // 3. Redirect user về trang thành công trên frontend (luôn gửi resultCode=0)
        return res.redirect(`${frontendUrl}/order-success?orderId=${order.id}&resultCode=0`);
    } catch (error) {
        console.error('Error in handleMoMoRedirect:', error);
        return res.redirect(`${frontendUrl}/order-success?error=server_error`);
    }
};
