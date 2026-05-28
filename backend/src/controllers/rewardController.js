import * as rewardService from '../services/rewardService';
import { asyncHandler } from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';

export const handleGetMyLoyaltyPoints = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const data = await rewardService.getMyLoyaltyPoints(userId);
    return res.status(200).json(new ApiResponse(200, data, 'Lấy thông tin điểm tích lũy thành công'));
});

export const handleGetRewardSummary = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const data = await rewardService.getRewardSummary(userId);
    return res.status(200).json(new ApiResponse(200, data, 'Lấy tổng hợp thưởng thành công'));
});
