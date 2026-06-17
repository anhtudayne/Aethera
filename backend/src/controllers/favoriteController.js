import { toggleFavoriteCourse, getFavoriteCourses, checkIsFavorite } from '../services/favoriteService';

export const handleToggleFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id; // Extracted from verifyToken middleware
        const { courseId } = req.body;
        
        if (!courseId) {
            return res.status(400).json({ status: 400, message: 'Thiếu courseId' });
        }

        const result = await toggleFavoriteCourse(userId, courseId);
        return res.status(200).json({ status: 200, ...result });
    } catch (err) { next(err); }
};

export const handleGetFavorites = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 12 } = req.query;
        const result = await getFavoriteCourses(userId, page, limit);
        return res.status(200).json({ status: 200, ...result });
    } catch (err) { next(err); }
};

export const handleCheckIsFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({ status: 400, message: 'Thiếu courseId' });
        }
        const result = await checkIsFavorite(userId, courseId);
        return res.status(200).json({ status: 200, ...result });
    } catch (err) { next(err); }
};
