import db from '../models/index';

const { Cart, Course, CourseImage, Category } = db;

const includeCourse = {
    model: Course,
    as: 'course',
    attributes: ['id', 'name', 'slug', 'price', 'salePrice', 'instructor', 'thumbnail', 'rating', 'level', 'duration', 'totalLessons'],
    include: [
        {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
        },
    ],
};

export const getCart = async (userId) => {
    try {
        const cartItems = await Cart.findAll({
            where: { userId },
            include: [includeCourse],
            order: [['createdAt', 'DESC']],
        });
        return { status: 200, data: cartItems };
    } catch (error) {
        throw error;
    }
};

export const addToCart = async (userId, courseId) => {
    try {
        // Kiểm tra khóa học tồn tại
        const course = await Course.findByPk(courseId);
        if (!course) return { status: 404, message: 'Khóa học không tồn tại' };

        // Kiểm tra đã có trong giỏ chưa
        const existing = await Cart.findOne({ where: { userId, courseId } });
        if (existing) return { status: 400, message: 'Khóa học đã có trong giỏ hàng' };

        const newItem = await Cart.create({ userId, courseId });
        return { status: 201, message: 'Thêm vào giỏ hàng thành công', data: newItem };
    } catch (error) {
        throw error;
    }
};

export const removeCartItem = async (userId, cartId) => {
    try {
        const cartItem = await Cart.findOne({ where: { id: cartId, userId } });
        if (!cartItem) return { status: 404, message: 'Không tìm thấy khóa học trong giỏ hàng' };

        await cartItem.destroy();
        return { status: 200, message: 'Xóa khóa học khỏi giỏ hàng thành công' };
    } catch (error) {
        throw error;
    }
};

export const clearCart = async (userId) => {
    try {
        await Cart.destroy({ where: { userId } });
        return { status: 200, message: 'Xóa toàn bộ giỏ hàng thành công' };
    } catch (error) {
        throw error;
    }
};

export const getCartCount = async (userId) => {
    try {
        const count = await Cart.count({ where: { userId } });
        return { status: 200, data: { count } };
    } catch (error) {
        throw error;
    }
};
