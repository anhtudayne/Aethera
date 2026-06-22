import { getCourses, getFeaturedCourses, getNewArrivals, getBestSellers, getCourseBySlug, getCourseCurriculum, getRelatedCourses, getCategories, createCategory, createCourse, updateCourse, publishCourse, toggleFeaturedCourse, toggleBestSellerCourse, getCoursesByCategory, getTopViewedCourses, incrementViewCount, checkEnrollmentService, getInstructorInfo } from '../services/courseService';
import db from '../models/index';

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

export const handleCreateCategory = async (req, res, next) => {
    try {
        const result = await createCategory(req.body);
        return res.status(201).json({ status: 201, message: 'Tạo danh mục thành công', ...result });
    } catch (err) { next(err); }
};

export const handleGetInstructorCourses = async (req, res, next) => {
    try {
        const { instructorName } = req.query;
        if (!instructorName) return res.status(400).json({ status: 400, message: "Vui lòng truyền instructorName" });
        const result = await getCourses({ ...req.query, instructor: instructorName, status: 'all' });
        return res.status(200).json({ status: 200, ...result });
    } catch (err) { next(err); }
};

export const handleCreateCourse = async (req, res, next) => {
    try {
        let instructorName = 'Unknown';
        if (req.user && req.user.id) {
            const user = await db.User.findByPk(req.user.id);
            if (user) {
                instructorName = `${user.firstName} ${user.lastName}`.trim();
            }
        }
        const courseData = { ...req.body, instructor: instructorName };
        const result = await createCourse(courseData);
        return res.status(201).json({ status: 201, message: 'Tạo khóa học thành công', ...result });
    } catch (err) { next(err); }
};

export const handleUpdateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        let instructorName = '';
        if (req.user && req.user.id) {
            const user = await db.User.findByPk(req.user.id);
            if (user) {
                instructorName = `${user.firstName} ${user.lastName}`.trim();
            }
        }
        const result = await updateCourse(id, req.body, instructorName);
        if (result.status && result.status !== 200) {
            return res.status(result.status).json(result);
        }
        return res.status(200).json(result);
    } catch (err) { next(err); }
};

export const handlePublishCourse = async (req, res, next) => {
    try {
        const result = await publishCourse(req.params.id);
        return res.status(result.status || 200).json(result);
    } catch (err) { next(err); }
};

export const handleToggleFeatured = async (req, res, next) => {
    try {
        const result = await toggleFeaturedCourse(req.params.id);
        return res.status(result.status || 200).json(result);
    } catch (err) { next(err); }
};

export const handleToggleBestSeller = async (req, res, next) => {
    try {
        const result = await toggleBestSellerCourse(req.params.id);
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

export const handleGetInstructorInfo = async (req, res, next) => {
    try {
        const { name } = req.params;
        if (!name) return res.status(400).json({ status: 400, message: "Vui lòng truyền tên giảng viên" });
        const result = await getInstructorInfo(name);
        return res.status(200).json(result);
    } catch (err) { next(err); }
};

export const handleGetCourseComments = async (req, res, next) => {
    try {
        const { id } = req.params; // courseId
        const { getCourseCommentsService } = require('../services/commentService');
        const result = await getCourseCommentsService(id);
        return res.status(200).json({ status: 200, data: result });
    } catch (err) { next(err); }
};

export const handleCreateCourseComment = async (req, res, next) => {
    try {
        const { id } = req.params; // courseId
        const userId = req.user.id;
        const { content, parentId } = req.body;
        const { createCourseCommentService } = require('../services/commentService');
        const result = await createCourseCommentService(userId, id, content, parentId);
        if (result.status && result.status !== 200 && result.status !== 201) {
            return res.status(result.status).json(result);
        }
        return res.status(201).json({ status: 201, data: result.data });
    } catch (err) { next(err); }
};