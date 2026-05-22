import express from 'express';
import * as orderController from '../controllers/orderController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create-from-cart', verifyToken, orderController.handleCreateOrder);
router.get('/check-status/:orderCode', verifyToken, orderController.handleCheckOrderStatus);

export default router;
