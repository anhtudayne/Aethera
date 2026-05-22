import db from '../models';

export const processWebhook = async (webhookData) => {
    const {
        gateway,
        transactionDate,
        accountNumber,
        subAccount,
        content,
        transferType,
        transferAmount,
        accumulated,
        id: referenceCode
    } = webhookData;

    try {
        // 1. Lưu log giao dịch
        await db.WebhookLog.create({
            referenceCode: String(referenceCode),
            gateway,
            transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
            accountNumber,
            subAccount,
            content,
            transferType,
            transferAmount,
            accumulated,
            status: 'received',
            payload: webhookData
        });

        // 2. Bỏ qua nếu không phải tiền vào
        if (transferType !== 'in') {
            return { success: true, message: 'Ignored out transaction' };
        }

        // 3. Tìm mã đơn hàng bằng Regex (Ví dụ: DH17163812)
        const orderIdMatch = content.match(/DH\d+/i);
        if (!orderIdMatch) {
            return { success: true, message: 'No valid order_id found in content' };
        }

        const orderCode = orderIdMatch[0].toUpperCase();

        // 4. Tìm đơn hàng
        const order = await db.Order.findOne({
            where: { code: orderCode },
            include: [{ model: db.OrderItem, as: 'orderItems' }]
        });

        // Nếu không tìm thấy hoặc đã thanh toán / hủy
        if (!order) {
            return { success: false, message: 'Order not found' };
        }
        
        if (order.status === 'paid') {
            // Idempotency: Giao dịch đã được xử lý thành công trước đó
            return { success: true, message: 'Order already paid (Idempotency)' };
        }

        if (order.status === 'cancelled') {
            return { success: false, message: 'Order was cancelled' };
        }

        // 5. Kiểm tra số tiền
        if (Number(transferAmount) < Number(order.totalAmount)) {
            // Khách chuyển thiếu tiền
            // Có thể cập nhật trạng thái partial_paid nếu có
            return { success: false, message: 'Insufficient amount transferred' };
        }

        // Nếu khách chuyển bằng hoặc dư tiền: Cập nhật thành paid và cấp quyền khóa học
        // 6. Cập nhật Order & Cấp quyền
        const transaction = await db.sequelize.transaction();
        try {
            await order.update({ status: 'paid' }, { transaction });

            const courseAccessData = order.orderItems.map(item => ({
                userId: order.userId,
                courseId: item.courseId,
                status: 'active'
            }));

            await db.UserCourse.bulkCreate(courseAccessData, { transaction });

            await transaction.commit();
            return { success: true, message: 'Order paid and access granted successfully' };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }

    } catch (error) {
        console.error('Lỗi xử lý webhook SePay:', error);
        // Có thể update WebhookLog thành 'failed' nếu muốn
        throw error;
    }
};
