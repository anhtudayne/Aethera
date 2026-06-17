import * as learningService from '../services/learningService';
import { asyncHandler } from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';

export const handleGetMyEnrolledCourses = asyncHandler(async (req, res) => {
    const data = await learningService.getMyEnrolledCourses(req.user.id, req.query);
    return res.status(200).json(new ApiResponse(200, data));
});

export const handleGetCourseContent = asyncHandler(async (req, res) => {
    const data = await learningService.getCourseContent(req.user.id, req.params.slug);
    return res.status(200).json(new ApiResponse(200, data));
});

export const handleMarkLessonComplete = asyncHandler(async (req, res) => {
    const data = await learningService.markLessonComplete(req.user.id, req.params.lessonId);
    return res.status(200).json(new ApiResponse(200, data));
});

export const handleUpdateWatchPosition = asyncHandler(async (req, res) => {
    const { position } = req.body;
    if (position === undefined) {
        return res.status(400).json({ status: 400, message: 'Thiếu tham số position.' });
    }
    const data = await learningService.updateWatchPosition(req.user.id, req.params.lessonId, position);
    return res.status(200).json(new ApiResponse(200, data));
});

export const handleGetNextLesson = asyncHandler(async (req, res) => {
    const { currentLessonId } = req.query;
    if (!currentLessonId) {
        return res.status(400).json({ status: 400, message: 'Thiếu tham số currentLessonId.' });
    }
    const data = await learningService.getNextLesson(req.user.id, req.params.courseId, currentLessonId);
    return res.status(200).json(new ApiResponse(200, data));
});
