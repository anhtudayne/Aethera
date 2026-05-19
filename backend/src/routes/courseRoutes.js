import express from 'express';
import {
    handleGetCourses, handleGetFeatured, handleGetNewArrivals, handleGetBestSellers,
    handleGetCourseBySlug, handleGetRelatedCourses, handleGetCategories, handleCreateCourse,
    handleGetCoursesByCategory, handleGetTopViewed, handleIncrementView
} from '../controllers/courseController';

let router = express.Router();

router.get('/categories', handleGetCategories);
router.get('/courses', handleGetCourses);
router.get('/courses/featured', handleGetFeatured);
router.get('/courses/new-arrivals', handleGetNewArrivals);
router.get('/courses/best-sellers', handleGetBestSellers);
router.get('/courses/top-viewed', handleGetTopViewed);
router.get('/courses/category/:slug', handleGetCoursesByCategory);
router.get('/courses/:slug', handleGetCourseBySlug);
router.patch('/courses/:id/view', handleIncrementView);
router.get('/courses/:id/related', handleGetRelatedCourses);
router.post('/courses', handleCreateCourse);

export default router;
