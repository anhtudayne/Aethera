import express from 'express';
import { handleGetCourses, handleGetFeatured, handleGetNewArrivals, handleGetBestSellers, handleGetCourseBySlug, handleGetRelatedCourses, handleGetCategories, handleCreateCourse } from '../controllers/courseController';

let router = express.Router();

router.get('/categories', handleGetCategories);
router.get('/courses', handleGetCourses);
router.get('/courses/featured', handleGetFeatured);
router.get('/courses/new-arrivals', handleGetNewArrivals);
router.get('/courses/best-sellers', handleGetBestSellers);
router.get('/courses/:slug', handleGetCourseBySlug);
router.get('/courses/:id/related', handleGetRelatedCourses);
router.post('/courses', handleCreateCourse);

export default router;
