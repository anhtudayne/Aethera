import db from '../models';
import * as notificationService from './notificationService';
import { createError } from '../utils/helpers';

/**
 * Tạo đánh giá cho khóa học đã đăng ký thành công.
 * Cập nhật rating trung bình và số lượng đánh giá của khóa học.
 */
export const createReview = async (userId, courseId, rating, comment) => {
    const transaction = await db.sequelize.transaction();
    try {
        // 1. Kiểm tra user đã enrolled (đăng ký) khóa học chưa
        const enrollment = await db.UserCourse.findOne({
            where: { userId, courseId },
        });

        if (!enrollment) {
            throw createError(400, 'Bạn chưa đăng ký khóa học này.');
        }

        // 2. Kiểm tra đã review chưa
        const existingReview = await db.Review.findOne({
            where: { userId, courseId },
        });

        if (existingReview) {
            throw createError(400, 'Bạn đã đánh giá khóa học này rồi.');
        }

        // 3. Tạo review
        const review = await db.Review.create({
            userId,
            courseId,
            rating,
            comment: comment || null,
        }, { transaction });

        // 4. Cập nhật rating trung bình và số lượng đánh giá
        const avgResult = await db.Review.findOne({
            where: { courseId },
            attributes: [
                [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'avgRating'],
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalReviews'],
            ],
            transaction,
        });

        const avgRating = parseFloat(avgResult.getDataValue('avgRating')) || 0;
        const totalReviews = parseInt(avgResult.getDataValue('totalReviews')) || 0;

        await db.Course.update(
            { rating: Math.round(avgRating * 10) / 10, ratingCount: totalReviews },
            { where: { id: courseId }, transaction }
        );

        await transaction.commit();

        // 5. Tạo notification
        try {
            const courseName = await db.Course.findByPk(courseId, {
                attributes: ['name'],
            });
            await notificationService.createNotification(
                userId,
                'new_review',
                '⭐ Đánh giá thành công!',
                `Bạn đã đánh giá khóa học "${courseName?.name || 'Khóa học'}".`,
                { courseId, courseName: courseName?.name, reviewId: review.id }
            );
        } catch (notifErr) {
            console.error('Lỗi gửi notification review (không ảnh hưởng review):', notifErr);
        }

        return {
            review,
            newAvgRating: Math.round(avgRating * 10) / 10,
            newRatingCount: totalReviews,
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Cập nhật đánh giá đã có.
 * Cập nhật rating trung bình của khóa học.
 */
export const updateReview = async (userId, reviewId, rating, comment) => {
    const transaction = await db.sequelize.transaction();
    try {
        const review = await db.Review.findOne({
            where: { id: reviewId, userId },
        });

        if (!review) {
            throw createError(404, 'Không tìm thấy đánh giá hoặc bạn không có quyền sửa.');
        }

        const courseId = review.courseId;

        // Cập nhật review
        await db.Review.update(
            { rating, comment: comment || null },
            { where: { id: reviewId }, transaction }
        );

        // Cập nhật rating trung bình
        const avgResult = await db.Review.findOne({
            where: { courseId },
            attributes: [
                [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'avgRating'],
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalReviews'],
            ],
            transaction,
        });

        const avgRating = parseFloat(avgResult.getDataValue('avgRating')) || 0;
        const totalReviews = parseInt(avgResult.getDataValue('totalReviews')) || 0;

        await db.Course.update(
            { rating: Math.round(avgRating * 10) / 10, ratingCount: totalReviews },
            { where: { id: courseId }, transaction }
        );

        await transaction.commit();

        return {
            message: 'Cập nhật đánh giá thành công',
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
    // Kiểm tra đã đăng ký chưa
    const enrollment = await db.UserCourse.findOne({
        where: { userId, courseId }
    });

    if (!enrollment) {
        return { canReview: false, reason: 'Bạn chưa đăng ký khóa học này.' };
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
