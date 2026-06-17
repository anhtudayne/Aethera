import * as reviewService from '../services/reviewService';
import { asyncHandler } from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';

export const handleCreateReview = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { courseId, rating, comment } = req.body;

    if (!courseId || !rating) {
        return res.status(400).json(new ApiResponse(400, null, 'courseId và rating là bắt buộc.'));
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json(new ApiResponse(400, null, 'Rating phải từ 1 đến 5.'));
    }

    const data = await reviewService.createReview(userId, courseId, parseInt(rating), comment);
    return res.status(201).json(new ApiResponse(201, data, 'Đánh giá thành công!'));
});

export const handleGetCourseReviews = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const data = await reviewService.getReviewsByCourse(courseId, page, limit);
    return res.status(200).json(new ApiResponse(200, data, 'Lấy danh sách đánh giá thành công'));
});

export const handleGetMyReviews = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const data = await reviewService.getMyReviews(userId);
    return res.status(200).json(new ApiResponse(200, data, 'Lấy danh sách đánh giá của tôi thành công'));
});

export const handleCheckCanReview = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { courseId } = req.params;
    const data = await reviewService.checkCanReview(userId, parseInt(courseId));
    return res.status(200).json(new ApiResponse(200, data));
});
