import { getUserDashboard, getAdminDashboardStats } from '../services/dashboardService';
import { asyncHandler } from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';

export const handleGetDashboard = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const data = await getUserDashboard(userId);
    return res.status(200).json(new ApiResponse(200, data, 'Lấy dashboard thành công'));
});

export const handleGetAdminDashboard = asyncHandler(async (req, res) => {
    const { range } = req.query;
    const data = await getAdminDashboardStats(range);
    return res.status(200).json(new ApiResponse(200, data, 'Lấy admin dashboard thành công'));
});
