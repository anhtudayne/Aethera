import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { handleAddViewed, handleGetViewed } from '../controllers/viewedController';

let router = express.Router();

router.post('/add', verifyToken, handleAddViewed);
router.get('/', verifyToken, handleGetViewed);

export default router;
