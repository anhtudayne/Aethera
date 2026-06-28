import crypto from 'crypto';
import axios from 'axios';

const partnerCode = process.env.MOMO_PARTNER_CODE;
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;
const apiEndpoint = process.env.MOMO_API_ENDPOINT || 'https://test-payment.momo.vn';

/**
 * Tạo yêu cầu thanh toán gửi sang MoMo
 * @param {object} params
 * @param {string} params.orderId - ID đơn hàng trong DB hoặc mã đơn hàng code
 * @param {number} params.amount - Tổng tiền thanh toán
 * @param {string} params.orderInfo - Thông tin mô tả đơn hàng
 * @param {string} params.redirectUrl - Trang redirect sau khi thanh toán xong trên MoMo
 * @param {string} params.ipnUrl - Link webhook để MoMo gọi trực tiếp cập nhật trạng thái đơn hàng
 * @param {string} [params.extraData] - Dữ liệu mở rộng truyền kèm (mặc định '')
 */
export const createPaymentRequest = async ({
    orderId,
    amount,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData = '',
    requestType = 'captureWallet',
}) => {
    try {
        const requestId = orderId;

        // Tạo chuỗi signature thô (phải đúng thứ tự alphabet của các key)
        const rawSignature = [
            `accessKey=${accessKey}`,
            `amount=${amount}`,
            `extraData=${extraData}`,
            `ipnUrl=${ipnUrl}`,
            `orderId=${orderId}`,
            `orderInfo=${orderInfo}`,
            `partnerCode=${partnerCode}`,
            `redirectUrl=${redirectUrl}`,
            `requestId=${requestId}`,
            `requestType=${requestType}`,
        ].join('&');

        // Tính signature HMAC-SHA256
        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        // Body gửi đi
        const requestBody = {
            partnerCode,
            partnerName: 'UTELearn',
            storeId: 'UTELearnStore',
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            lang: 'vi',
            requestType,
            autoCapture: true,
            extraData,
            signature,
        };

        console.log('Sending request to MoMo API...', `${apiEndpoint}/v2/gateway/api/create`);
        
        const response = await axios.post(`${apiEndpoint}/v2/gateway/api/create`, requestBody, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error creating MoMo payment request:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Xác thực signature nhận về từ MoMo (Redirect hoặc IPN)
 * @param {object} momoData - Toàn bộ dữ liệu MoMo gửi sang
 */
export const verifySignature = (momoData) => {
    try {
        const {
            partnerCode,
            orderId,
            requestId,
            amount,
            orderInfo,
            orderType,
            transId,
            resultCode,
            message,
            payType,
            responseTime,
            extraData,
            signature,
        } = momoData;

        // Xây dựng lại raw signature để xác thực chữ ký số từ MoMo
        const rawSignature = [
            `accessKey=${accessKey}`,
            `amount=${amount}`,
            `extraData=${extraData}`,
            `message=${message}`,
            `orderId=${orderId}`,
            `orderInfo=${orderInfo}`,
            `orderType=${orderType}`,
            `partnerCode=${partnerCode}`,
            `payType=${payType}`,
            `requestId=${requestId}`,
            `responseTime=${responseTime}`,
            `resultCode=${resultCode}`,
            `transId=${transId}`,
        ].join('&');

        const calculatedSignature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        return calculatedSignature === signature;
    } catch (error) {
        console.error('Error verifying MoMo signature:', error.message);
        return false;
    }
};
