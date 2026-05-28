import express from 'express';
import * as couponController from '../controllers/couponController';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

// Client routes
router.post('/validate', verifyToken, couponController.handleValidateCoupon);

// Admin routes
router.post('/', verifyToken, verifyAdmin, couponController.handleCreateCoupon);
router.get('/', verifyToken, verifyAdmin, couponController.handleGetAllCoupons);
router.put('/:id', verifyToken, verifyAdmin, couponController.handleUpdateCoupon);
router.delete('/:id', verifyToken, verifyAdmin, couponController.handleDeleteCoupon);

export default router;
