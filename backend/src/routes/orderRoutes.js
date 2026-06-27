import express from 'express';
import * as orderController from '../controllers/orderController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create-from-cart', verifyToken, orderController.handleCreateOrder);
router.post('/validate-voucher', verifyToken, orderController.handleValidateVoucher);
router.get('/check-status/:orderCode', verifyToken, orderController.handleCheckOrderStatus);
router.get('/', verifyToken, orderController.handleGetMyOrders);
router.get('/:id', verifyToken, orderController.handleGetOrderDetails);
router.put('/:id/cancel', verifyToken, orderController.handleCancelOrder);
router.put('/:id/fulfill', verifyToken, orderController.handleFulfillOrder);

export default router;
