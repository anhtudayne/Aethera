import * as certificateService from '../services/certificateService';
import { asyncHandler } from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';

export const handleGetMyCertificates = asyncHandler(async (req, res) => {
    const data = await certificateService.getMyCertificates(req.user.id);
    return res.status(200).json(new ApiResponse(200, data));
});

export const handleVerifyCertificate = asyncHandler(async (req, res) => {
    const { code } = req.params;
    if (!code) {
        return res.status(400).json({ status: 400, message: 'Thiếu mã chứng chỉ để xác thực.' });
    }
    const data = await certificateService.verifyCertificate(code);
    const statusCode = data.valid ? 200 : 404;
    return res.status(statusCode).json(new ApiResponse(statusCode, data));
});
