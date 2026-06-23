import express from 'express';
import * as paymentController from '../controllers/paymentController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();

// 1. Khởi tạo thanh toán MoMo (cần đăng nhập)
router.post('/momo/create', verifyToken, paymentController.createMoMoPayment);

// 2. Webhook IPN Callback từ MoMo (công khai, MoMo gọi sang)
router.post('/momo/webhook', paymentController.handleMoMoIPN);

// 3. Redirect Callback từ MoMo (công khai, chuyển hướng browser)
router.get('/momo/redirect', paymentController.handleMoMoRedirect);

export default router;
