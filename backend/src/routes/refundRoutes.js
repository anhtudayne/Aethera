import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import * as refundController from '../controllers/refundController';

const router = express.Router();

// Get refund history
router.get('/my-requests', verifyToken, refundController.getMyRequests);

// Check if eligible for refund
router.get('/check/:courseId', verifyToken, refundController.checkEligibility);

// Submit refund request
router.post('/', verifyToken, refundController.createRefund);

export default router;
