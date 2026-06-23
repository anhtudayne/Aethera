import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import {
    handleGetMyEnrolledCourses,
    handleGetCourseContent,
    handleMarkLessonComplete,
    handleUpdateWatchPosition,
    handleGetNextLesson,
} from '../controllers/learningController';
import { handleLessonChat } from '../controllers/chatController.js';

const router = express.Router();

router.get('/my-courses', verifyToken, handleGetMyEnrolledCourses);
router.get('/courses/:slug/content', verifyToken, handleGetCourseContent);
router.post('/lessons/:lessonId/complete', verifyToken, handleMarkLessonComplete);
router.put('/lessons/:lessonId/position', verifyToken, handleUpdateWatchPosition);
router.get('/courses/:courseId/next-lesson', verifyToken, handleGetNextLesson);

// Chat với AI dựa trên video transcript
router.post('/chat', verifyToken, handleLessonChat);

export default router;
