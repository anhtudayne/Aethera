import express from 'express';
import * as rewardController from '../controllers/rewardController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/loyalty-points', verifyToken, rewardController.handleGetMyLoyaltyPoints);
router.get('/summary', verifyToken, rewardController.handleGetRewardSummary);

export default router;
