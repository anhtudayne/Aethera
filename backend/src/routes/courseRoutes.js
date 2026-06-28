import express from 'express';
import {
    handleGetCourses, handleGetFeatured, handleGetNewArrivals, handleGetBestSellers,
    handleGetCourseBySlug, handleGetCourseCurriculum, handleGetRelatedCourses, handleGetCategories, handleCreateCategory, handleCreateCourse,
    handleUpdateCourse, handlePublishCourse, handleToggleFeatured, handleToggleBestSeller, handleGetCoursesByCategory, handleGetTopViewed, handleIncrementView,
    handleCheckEnrollment, handleGetInstructorCourses, handleGetInstructorInfo,
    handleGetCourseComments, handleCreateCourseComment, handleSubmitReview
} from '../controllers/courseController';
import { verifyToken } from '../middlewares/authMiddleware';
import { validateCoursePublish } from '../middlewares/validators/courseValidator';

let router = express.Router();

router.get('/instructor/my-courses', verifyToken, handleGetInstructorCourses);
router.get('/instructor/:name', handleGetInstructorInfo);
router.get('/categories', handleGetCategories);
router.post('/categories', verifyToken, handleCreateCategory);
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
router.get('/courses/:id/comments', handleGetCourseComments);
router.post('/courses/:id/comments', verifyToken, handleCreateCourseComment);
router.post('/courses', verifyToken, handleCreateCourse);
router.put('/courses/:id', verifyToken, handleUpdateCourse);
router.put('/courses/:id/submit-review', verifyToken, validateCoursePublish, handleSubmitReview);
router.put('/courses/:id/publish', handlePublishCourse);
router.put('/courses/:id/featured', handleToggleFeatured);
router.put('/courses/:id/best-seller', handleToggleBestSeller);

export default router;
