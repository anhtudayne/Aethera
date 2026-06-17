import express from 'express';
import { handleGetDashboard } from '../controllers/dashboardController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();

// GET /api/user/dashboard — User Dashboard
router.get('/dashboard', verifyToken, handleGetDashboard);

export default router;
