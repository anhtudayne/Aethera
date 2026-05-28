import * as couponService from '../services/couponService';
import { asyncHandler } from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';

export const handleCreateCoupon = asyncHandler(async (req, res) => {
    const data = await couponService.createCoupon(req.body);
    return res.status(201).json(new ApiResponse(201, data, 'Tạo mã giảm giá thành công'));
});

export const handleGetAllCoupons = asyncHandler(async (req, res) => {
    const data = await couponService.getAllCoupons();
    return res.status(200).json(new ApiResponse(200, data, 'Lấy danh sách mã giảm giá thành công'));
});

export const handleUpdateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await couponService.updateCoupon(id, req.body);
    return res.status(200).json(new ApiResponse(200, data, 'Cập nhật mã giảm giá thành công'));
});

export const handleDeleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await couponService.deleteCoupon(id);
    return res.status(200).json(new ApiResponse(200, null, 'Xóa mã giảm giá thành công'));
});

export const handleValidateCoupon = asyncHandler(async (req, res) => {
    const { code, cartTotal } = req.body;
    
    if (!code || cartTotal === undefined) {
        return res.status(400).json(new ApiResponse(400, null, 'Thiếu thông tin code hoặc cartTotal'));
    }

    const data = await couponService.validateCoupon(code, cartTotal);
    return res.status(200).json(new ApiResponse(200, data, 'Mã giảm giá hợp lệ'));
});
