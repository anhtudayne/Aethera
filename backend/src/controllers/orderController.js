import * as orderService from '../services/orderService';
import { asyncHandler } from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';

export const handleCreateOrder = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { courseIds, useCredit } = req.body;
    const data = await orderService.createOrderFromCart(userId, courseIds, useCredit);
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
    const { page = 1, limit = 10 } = req.query;
    const data = await orderService.getMyOrders(userId, parseInt(page), parseInt(limit));
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

export const handleFulfillOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await orderService.fulfillOrder(id);
    return res.status(200).json(new ApiResponse(200, data, 'Xử lý đơn hàng thành công'));
});
