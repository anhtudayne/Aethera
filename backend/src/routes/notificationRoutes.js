import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import * as notificationController from '../controllers/notificationController';

const router = express.Router();

// All routes require authentication
router.get('/', verifyToken, notificationController.getNotifications);
router.get('/unread-count', verifyToken, notificationController.getUnreadCount);
router.put('/read-all', verifyToken, notificationController.markAllAsRead);
router.put('/:id/read', verifyToken, notificationController.markAsRead);

export default router;
