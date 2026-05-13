import { getCourses, getFeaturedCourses, getNewArrivals, getBestSellers, getCourseBySlug, getRelatedCourses, getCategories } from '../services/courseService';

export const handleGetCourses = async (req, res, next) => {
    try {
        const result = await getCourses(req.query);
        return res.status(200).json({ status: 200, ...result });
    } catch (err) { next(err); }
};

export const handleGetFeatured = async (req, res, next) => {
    try {
        const result = await getFeaturedCourses();
        return res.status(200).json({ status: 200, ...result });
    } catch (err) { next(err); }
};

export const handleGetNewArrivals = async (req, res, next) => {
    try {
        const result = await getNewArrivals();
        return res.status(200).json({ status: 200, ...result });
    } catch (err) { next(err); }
};

export const handleGetBestSellers = async (req, res, next) => {
    try {
        const result = await getBestSellers();
        return res.status(200).json({ status: 200, ...result });
    } catch (err) { next(err); }
};

export const handleGetCourseBySlug = async (req, res, next) => {
    try {
        const result = await getCourseBySlug(req.params.slug);
        if (!result.data) return res.status(404).json({ status: 404, message: 'Không tìm thấy khóa học' });
        return res.status(200).json({ status: 200, ...result });
    } catch (err) { next(err); }
};

export const handleGetRelatedCourses = async (req, res, next) => {
    try {
        const result = await getRelatedCourses(req.params.id);
        return res.status(200).json({ status: 200, ...result });
    } catch (err) { next(err); }
};

export const handleGetCategories = async (req, res, next) => {
    try {
        const result = await getCategories();
        return res.status(200).json({ status: 200, ...result });
    } catch (err) { next(err); }
};
