import * as cartService from '../services/cartService';

export const handleGetCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await cartService.getCart(userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi lấy giỏ hàng:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleAddToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.body;
        if (!courseId) return res.status(400).json({ status: 400, message: 'courseId là bắt buộc' });

        const result = await cartService.addToCart(userId, courseId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi thêm vào giỏ hàng:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleRemoveCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartId = req.params.id;
        const result = await cartService.removeCartItem(userId, cartId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi xóa khóa học khỏi giỏ hàng:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleClearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await cartService.clearCart(userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi xóa toàn bộ giỏ hàng:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};

export const handleGetCartCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await cartService.getCartCount(userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Lỗi đếm giỏ hàng:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server.' });
    }
};
