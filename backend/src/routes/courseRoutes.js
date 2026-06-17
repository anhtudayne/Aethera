import express from 'express';
import {
    handleGetCourses, handleGetFeatured, handleGetNewArrivals, handleGetBestSellers,
    handleGetCourseBySlug, handleGetCourseCurriculum, handleGetRelatedCourses, handleGetCategories, handleCreateCourse,
    handlePublishCourse, handleGetCoursesByCategory, handleGetTopViewed, handleIncrementView,
    handleCheckEnrollment
} from '../controllers/courseController';
import { verifyToken } from '../middlewares/authMiddleware';

let router = express.Router();

router.get('/categories', handleGetCategories);
router.get('/courses', handleGetCourses);
router.get('/courses/featured', handleGetFeatured);
router.get('/courses/new-arrivals', handleGetNewArrivals);
router.get('/courses/best-sellers', handleGetBestSellers);
router.get('/courses/top-viewed', handleGetTopViewed);
router.get('/courses/category/:slug', handleGetCoursesByCategory);
router.get('/courses/:slug/curriculum', handleGetCourseCurriculum);
router.get('/courses/:slug', handleGetCourseBySlug);
router.get('/courses/:slug/check-enrollment', verifyToken, handleCheckEnrollment);
router.patch('/courses/:id/view', handleIncrementView);
router.get('/courses/:id/related', handleGetRelatedCourses);
router.post('/courses', handleCreateCourse);
router.put('/courses/:id/publish', handlePublishCourse);

export default router;
