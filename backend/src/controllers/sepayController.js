import * as sepayService from '../services/sepayService';
import { asyncHandler } from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';

export const sepayWebhook = asyncHandler(async (req, res) => {
    // 1. Xác thực bảo mật (API Key)
    // Header authorization có dạng: "Apikey YOUR_TOKEN"
    // Cloudflare Tunnel thường xuyên nuốt mất header Authorization
    // Nên ta hỗ trợ thêm việc lấy từ URL (req.query.apikey)
    const authHeader = req.headers['authorization'] || '';
    const sepayToken = (process.env.SEPAY_WEBHOOK_TOKEN || '').trim();

    if (!sepayToken) {
        console.error('Thiếu cấu hình SEPAY_WEBHOOK_TOKEN trong biến môi trường');
        return res.status(500).json(new ApiResponse(500, null, 'Server config error'));
    }

    let token = authHeader.replace(/^Apikey\s+/i, '').replace(/^Bearer\s+/i, '').trim();
    
    // Nếu Header bị trống, thử lấy từ URL: ?apikey=...
    if (!token && req.query.apikey) {
        token = String(req.query.apikey).trim();
    }

    if (!token || token !== sepayToken) {
        console.error('SePay Webhook 403 Forbidden.');
        console.error('- Header Authorization nhận được:', authHeader);
        console.error('- Query apikey nhận được:', req.query.apikey);
        console.error('- Token trích xuất cuối cùng:', token);
        console.error('- Token lưu trong .env:', sepayToken);
        return res.status(403).json(new ApiResponse(403, null, 'Forbidden: Invalid API Key'));
    }

    // 2. Giao dữ liệu cho Service xử lý
    const result = await sepayService.processWebhook(req.body);

    // SePay yêu cầu trả về status 200 để xác nhận đã nhận thành công, 
    // nếu không sẽ gọi lại nhiều lần.
    return res.status(200).json(new ApiResponse(200, result, result.message));
});
