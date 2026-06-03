import express from 'express';
import { getDashboardStats } from '../controllers/statsController';
import { verifyToken } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/authorizeMiddleware';

const router = express.Router();

// Admin only route
router.get(
    '/dashboard',
    verifyToken,
    authorizeRole('admin'),
    getDashboardStats
);

export default router;
