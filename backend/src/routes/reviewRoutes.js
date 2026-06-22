import express from 'express';
import * as reviewController from '../controllers/reviewController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', verifyToken, reviewController.handleCreateReview);
router.put('/:id', verifyToken, reviewController.handleUpdateReview);
router.get('/my-reviews', verifyToken, reviewController.handleGetMyReviews);
router.get('/can-review/:courseId', verifyToken, reviewController.handleCheckCanReview);
router.get('/course/:courseId', reviewController.handleGetCourseReviews);

export default router;
