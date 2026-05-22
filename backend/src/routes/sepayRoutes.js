import express from 'express';
import * as sepayController from '../controllers/sepayController';

const router = express.Router();

// Lưu ý: Endpoint này public để SePay có thể gọi, 
// việc bảo mật sẽ được thực hiện qua Header Authorization trong Controller
router.post('/webhook', sepayController.sepayWebhook);

export default router;
