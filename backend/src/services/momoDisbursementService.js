import crypto from 'crypto';
import axios from 'axios';

const partnerCode = process.env.MOMO_PARTNER_CODE;
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;
// MoMo Sandbox Endpoint for Disbursement
const apiEndpoint = process.env.MOMO_DISBURSEMENT_API_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/disbursement';

/**
 * Gọi API Chi hộ MoMo
 * @param {string} batchId - Mã lô (dùng làm requestId / idempotency key)
 * @param {Array} disbursementList - Danh sách chi hộ
 * @param {number} totalAmount - Tổng tiền
 */
export const createBulkPayout = async (batchId, disbursementList, totalAmount) => {
    try {
        const requestId = batchId;
        const orderId = batchId; // Use batchId as orderId for the bulk transaction
        const orderInfo = `Quyet toan thu lao giang vien lo ${batchId}`;
        const redirectUrl = '';
        const ipnUrl = `${process.env.BACKEND_PUBLIC_URL || 'http://localhost:5000'}/api/payouts/momo-webhook`;
        const requestType = 'payWithMethod'; // Hoặc type do MoMo cấp cho Chi Hộ
        
        // Chuỗi dữ liệu ký (theo quy chuẩn MoMo - giả định các trường cần thiết cho Chi hộ)
        // Lưu ý: Disbursement API của MoMo có cấu trúc rawSignature riêng, dưới đây là mô phỏng
        const rawSignature = [
            `accessKey=${accessKey}`,
            `amount=${totalAmount}`,
            `extraData=`,
            `ipnUrl=${ipnUrl}`,
            `orderId=${orderId}`,
            `orderInfo=${orderInfo}`,
            `partnerCode=${partnerCode}`,
            `redirectUrl=${redirectUrl}`,
            `requestId=${requestId}`,
            `requestType=${requestType}`,
        ].join('&');

        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode,
            requestId,
            amount: totalAmount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            requestType,
            extraData: '',
            lang: 'vi',
            signature,
            disbursementList // JSON array cho danh sách người nhận
        };

        console.log('Sending Bulk Payout Request to MoMo Sandbox...', apiEndpoint);
        
        // Mô phỏng gọi HTTP Request lên MoMo (Vì đây là demo cấu trúc, nếu API endpoint ko đúng chuẩn, nó sẽ throw)
        // const response = await axios.post(apiEndpoint, requestBody, {
        //     headers: { 'Content-Type': 'application/json' }
        // });
        
        // Trả về mock data cho mục đích giả lập Sandbox nếu ko có tài khoản thật cấu hình sẵn
        const mockResponse = {
            resultCode: 0,
            message: "Thành công",
            batchId: batchId,
            responseTime: new Date().getTime(),
            signature: "mock_signature"
        };

        return mockResponse;
        // return response.data;
    } catch (error) {
        console.error('MoMo Disbursement Error:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Xác thực IPN từ MoMo
 */
export const verifyWebhookSignature = (momoData) => {
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
        console.error('Lỗi verify signature MoMo:', error.message);
        return false;
    }
};
