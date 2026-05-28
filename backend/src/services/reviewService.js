import db from '../models';

const POINTS_PER_REVIEW = 10;

/**
 * Tạo đánh giá cho khóa học đã mua thành công.
 * Tự động cộng điểm tích lũy và cập nhật rating trung bình.
 */
export const createReview = async (userId, courseId, rating, comment) => {
    const transaction = await db.sequelize.transaction();
    try {
        // 1. Kiểm tra user đã mua khóa học chưa (Order status = 'paid' chứa courseId)
        const paidOrder = await db.Order.findOne({
            where: { userId, status: 'paid' },
            include: [{
                model: db.OrderItem,
                as: 'orderItems',
                where: { courseId },
                required: true,
            }],
        });

        if (!paidOrder) {
            const error = new Error('Bạn chưa mua khóa học này hoặc đơn hàng chưa thanh toán.');
            error.statusCode = 400;
            throw error;
        }

        // 2. Kiểm tra đã review chưa
        const existingReview = await db.Review.findOne({
            where: { userId, courseId },
        });

        if (existingReview) {
            const error = new Error('Bạn đã đánh giá khóa học này rồi.');
            error.statusCode = 400;
            throw error;
        }

        // 3. Tạo review
        const review = await db.Review.create({
            userId,
            courseId,
            orderId: paidOrder.id,
            rating,
            comment: comment || null,
        }, { transaction });

        // 4. Cập nhật rating trung bình của khóa học
        const avgResult = await db.Review.findOne({
            where: { courseId },
            attributes: [
                [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'avgRating'],
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalReviews'],
            ],
            transaction,
        });

        const avgRating = parseFloat(avgResult.getDataValue('avgRating')) || 0;
        await db.Course.update(
            { rating: Math.round(avgRating * 10) / 10 },
            { where: { id: courseId }, transaction }
        );

        // 5. Cộng điểm tích lũy cho user
        await db.User.increment('loyaltyPoints', {
            by: POINTS_PER_REVIEW,
            where: { id: userId },
            transaction,
        });

        // 6. Ghi log lịch sử điểm
        const courseName = await db.Course.findByPk(courseId, {
            attributes: ['name'],
            transaction,
        });

        await db.LoyaltyPoint.create({
            userId,
            points: POINTS_PER_REVIEW,
            type: 'earn',
            description: `Đánh giá khóa học "${courseName?.name || courseId}"`,
            referenceId: review.id,
        }, { transaction });

        await transaction.commit();

        return {
            review,
            pointsEarned: POINTS_PER_REVIEW,
            newAvgRating: Math.round(avgRating * 10) / 10,
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Lấy danh sách đánh giá theo khóa học (có phân trang)
 */
export const getReviewsByCourse = async (courseId, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Review.findAndCountAll({
        where: { courseId },
        include: [{
            model: db.User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'image'],
        }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset,
    });

    // Lấy thống kê rating
    const ratingStats = await db.Review.findAll({
        where: { courseId },
        attributes: [
            'rating',
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
        ],
        group: ['rating'],
        raw: true,
    });

    // Chuyển thành object { 1: count, 2: count, ... 5: count }
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingStats.forEach(stat => {
        distribution[stat.rating] = parseInt(stat.count);
    });

    return {
        reviews: rows,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
        },
        ratingDistribution: distribution,
    };
};

/**
 * Lấy tất cả review của user
 */
export const getMyReviews = async (userId) => {
    const reviews = await db.Review.findAll({
        where: { userId },
        include: [{
            model: db.Course,
            as: 'course',
            attributes: ['id', 'name', 'slug', 'thumbnail'],
        }],
        order: [['createdAt', 'DESC']],
    });

    return reviews;
};

/**
 * Kiểm tra user có quyền đánh giá khóa học không
 */
export const checkCanReview = async (userId, courseId) => {
    // Kiểm tra đã mua chưa
    const paidOrder = await db.Order.findOne({
        where: { userId, status: 'paid' },
        include: [{
            model: db.OrderItem,
            as: 'orderItems',
            where: { courseId },
            required: true,
        }],
    });

    if (!paidOrder) {
        return { canReview: false, reason: 'Bạn chưa mua khóa học này.' };
    }

    // Kiểm tra đã review chưa
    const existingReview = await db.Review.findOne({
        where: { userId, courseId },
    });

    if (existingReview) {
        return { canReview: false, reason: 'Bạn đã đánh giá khóa học này rồi.', existingReview };
    }

    return { canReview: true };
};
