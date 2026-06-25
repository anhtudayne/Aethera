import express from 'express';
import qaController from '../controllers/qaController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();

// Course level Q&A
router.get('/courses/:courseId/questions', qaController.getQuestions);
router.post('/courses/:courseId/questions', verifyToken, qaController.createQuestion);
router.get('/courses/:courseId/upvotes', verifyToken, qaController.getUserUpvotes);

// Question level interactions
router.get('/questions/:questionId', qaController.getQuestionById);
router.post('/questions/:questionId/answers', verifyToken, qaController.createAnswer);
router.post('/questions/:questionId/upvote', verifyToken, qaController.toggleUpvote);

export default router;
