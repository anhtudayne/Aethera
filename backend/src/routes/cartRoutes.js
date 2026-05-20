import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import {
    handleGetCart,
    handleAddToCart,
    handleRemoveCartItem,
    handleClearCart,
    handleGetCartCount,
} from '../controllers/cartController';

const router = express.Router();

// Tất cả route giỏ hàng đều yêu cầu đăng nhập
router.use(verifyToken);

router.get('/', handleGetCart);
router.get('/count', handleGetCartCount);
router.post('/', handleAddToCart);
router.delete('/:id', handleRemoveCartItem);
router.delete('/', handleClearCart);

export default router;
