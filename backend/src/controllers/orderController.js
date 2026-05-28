import * as orderService from '../services/orderService';
import { asyncHandler } from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';

export const handleCreateOrder = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    // Lấy thông tin tài khoản ngân hàng và điểm tích lũy từ body
    const { bankAccount, bankName, usePoints } = req.body;

    const data = await orderService.createOrderFromCart(userId, bankAccount, bankName, usePoints || 0);
    return res.status(201).json(new ApiResponse(201, data, 'Tạo đơn hàng thành công'));
});

export const handleCheckOrderStatus = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { orderCode } = req.params;
    const data = await orderService.checkOrderStatus(userId, orderCode);
    return res.status(200).json(new ApiResponse(200, data));
});

export const handleGetMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const data = await orderService.getMyOrders(userId);
    return res.status(200).json(new ApiResponse(200, data, 'Lấy danh sách đơn hàng thành công'));
});

export const handleGetOrderDetails = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const data = await orderService.getOrderDetails(userId, id);
    return res.status(200).json(new ApiResponse(200, data, 'Lấy chi tiết đơn hàng thành công'));
});

export const handleCancelOrder = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const data = await orderService.cancelOrder(userId, id);
    return res.status(200).json(new ApiResponse(200, data, 'Hủy đơn hàng thành công'));
});
