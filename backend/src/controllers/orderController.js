import * as orderService from '../services/orderService';
import { asyncHandler } from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';

export const handleCreateOrder = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    // Lấy thông tin tài khoản ngân hàng từ body hoặc để service dùng default
    const { bankAccount, bankName } = req.body;

    const data = await orderService.createOrderFromCart(userId, bankAccount, bankName);
    return res.status(201).json(new ApiResponse(201, data, 'Tạo đơn hàng thành công'));
});

export const handleCheckOrderStatus = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { orderCode } = req.params;
    const data = await orderService.checkOrderStatus(userId, orderCode);
    return res.status(200).json(new ApiResponse(200, data));
});
