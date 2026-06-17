import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import {
    handleGetMyEnrolledCourses,
    handleGetCourseContent,
    handleMarkLessonComplete,
    handleUpdateWatchPosition,
    handleGetNextLesson,
} from '../controllers/learningController';

const router = express.Router();

router.get('/my-courses', verifyToken, handleGetMyEnrolledCourses);
router.get('/courses/:slug/content', verifyToken, handleGetCourseContent);
router.post('/lessons/:lessonId/complete', verifyToken, handleMarkLessonComplete);
router.put('/lessons/:lessonId/position', verifyToken, handleUpdateWatchPosition);
router.get('/courses/:courseId/next-lesson', verifyToken, handleGetNextLesson);

export default router;
