import { getCourses, getFeaturedCourses, getNewArrivals, getBestSellers, getCourseBySlug, getCourseCurriculum, getRelatedCourses, getCategories, createCourse, publishCourse, getCoursesByCategory, getTopViewedCourses, incrementViewCount, checkEnrollmentService } from '../services/courseService';

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

export const handleGetCourseCurriculum = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const result = await getCourseCurriculum(slug);
        if (!result) return res.status(404).json({ status: 404, message: 'Không tìm thấy chương trình học của khóa học này' });
        return res.status(200).json({ status: 200, data: result });
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

export const handleCreateCourse = async (req, res, next) => {
    try {
        const result = await createCourse(req.body);
        return res.status(201).json({ status: 201, message: 'Tạo khóa học thành công', ...result });
    } catch (err) { next(err); }
};

export const handlePublishCourse = async (req, res, next) => {
    try {
        const result = await publishCourse(req.params.id);
        return res.status(result.status || 200).json(result);
    } catch (err) { next(err); }
};

// BT05 — Võ Văn Tú: Khóa học theo danh mục (Infinite Scroll)
export const handleGetCoursesByCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const { page = 1, limit = 6 } = req.query;
        const result = await getCoursesByCategory(slug, page, limit);
        return res.status(result.status || 200).json(result);
    } catch (err) { next(err); }
};

export const handleGetTopViewed = async (req, res, next) => {
    try {
        const result = await getTopViewedCourses();
        return res.status(200).json(result);
    } catch (err) { next(err); }
};

export const handleIncrementView = async (req, res, next) => {
    try {
        const result = await incrementViewCount(req.params.id);
        return res.status(200).json(result);
    } catch (err) { next(err); }
};

export const handleCheckEnrollment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { slug } = req.params;
        const result = await checkEnrollmentService(userId, slug);
        return res.status(200).json({ status: 200, data: result });
    } catch (err) { next(err); }
};