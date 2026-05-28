import { addViewedCourse, getViewedCourses } from '../services/viewedService';

export const handleAddViewed = async (req, res, next) => {
    try {
        const userId = req.user.id; // Extracted from verifyToken middleware
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ status: 400, message: 'Thiếu courseId' });
        }

        const result = await addViewedCourse(userId, courseId);
        return res.status(200).json({ status: 200, ...result });
    } catch (err) { next(err); }
};

export const handleGetViewed = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await getViewedCourses(userId);
        return res.status(200).json({ status: 200, ...result });
    } catch (err) { next(err); }
};
