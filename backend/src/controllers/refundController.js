import db from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import { createError } from '../utils/helpers';
import * as notificationService from '../services/notificationService';
import { Op } from 'sequelize';

/**
 * Check if a course is eligible for refund
 */
export const checkEligibility = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { courseId } = req.params;

    // 1. Check if user owns the course
    const userCourse = await db.UserCourse.findOne({
        where: { userId, courseId, status: 'active' }
    });

    if (!userCourse) {
        return res.status(200).json(new ApiResponse(200, {
            canRefund: false,
            reason: 'You do not currently have active access to this course.'
        }));
    }

    // 2. Check if user has already refunded this course in the past
    const pastRefund = await db.RefundRequest.findOne({
        where: {
            userId,
            courseId,
            status: { [Op.in]: ['PROCESSING', 'COMPLETED'] }
        }
    });

    if (pastRefund) {
        return res.status(200).json(new ApiResponse(200, {
            canRefund: false,
            reason: 'Cannot refund because you can only refund each course once. This course has been refunded in the past.'
        }));
    }

    // 3. Find the most recent paid OrderItem for this course
    const orderItem = await db.OrderItem.findOne({
        include: [
            {
                model: db.Order,
                as: 'order',
                where: { userId, status: 'paid' }
            },
            {
                model: db.Course,
                as: 'course',
                attributes: ['id', 'name', 'thumbnail', 'slug']
            }
        ],
        where: { courseId },
        order: [['createdAt', 'DESC']]
    });

    if (!orderItem || !orderItem.order) {
        return res.status(200).json(new ApiResponse(200, {
            canRefund: false,
            reason: 'No matching paid purchase order was found for this course.'
        }));
    }

    // 4. Check if within 30 days
    const purchaseDate = new Date(orderItem.order.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - purchaseDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
        return res.status(200).json(new ApiResponse(200, {
            canRefund: false,
            reason: 'The 30-day refund window has expired for this purchase.',
            purchaseDate: orderItem.order.createdAt,
            daysRemaining: 0,
            course: orderItem.course
        }));
    }

    return res.status(200).json(new ApiResponse(200, {
        canRefund: true,
        refundAmount: Number(orderItem.price),
        purchaseDate: orderItem.order.createdAt,
        daysRemaining: 30 - diffDays,
        course: orderItem.course
    }));
});

/**
 * Request a refund
 */
export const createRefund = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { courseId, method, reason } = req.body;

    if (!['credit', 'momo', 'bank_transfer'].includes(method)) {
        throw createError(400, 'Invalid refund method.');
    }

    const transaction = await db.sequelize.transaction();
    try {
        // 1. Check if user owns the course
        const userCourse = await db.UserCourse.findOne({
            where: { userId, courseId, status: 'active' },
            transaction
        });

        if (!userCourse) {
            throw createError(400, 'You do not have active access to this course.');
        }

        // 2. Check if user has already refunded this course in the past
        const pastRefund = await db.RefundRequest.findOne({
            where: {
                userId,
                courseId,
                status: { [Op.in]: ['PROCESSING', 'COMPLETED'] }
            },
            transaction
        });

        if (pastRefund) {
            throw createError(400, 'This course has already been refunded once. Each course can only be refunded once.');
        }

        // 3. Find the most recent paid OrderItem
        const orderItem = await db.OrderItem.findOne({
            include: [{
                model: db.Order,
                as: 'order',
                where: { userId, status: 'paid' }
            }],
            where: { courseId },
            order: [['createdAt', 'DESC']],
            transaction
        });

        if (!orderItem || !orderItem.order) {
            throw createError(404, 'No purchase record found for this course.');
        }

        // 4. Check if within 30 days
        const purchaseDate = new Date(orderItem.order.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - purchaseDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 30) {
            throw createError(400, 'The 30-day refund window has expired.');
        }

        const refundAmount = Number(orderItem.price);

        // 5. Revoke access immediately
        await db.UserCourse.destroy({
            where: { userId, courseId },
            transaction
        });

        // 6. Delete LessonProgress records
        await db.LessonProgress.destroy({
            where: { userId, courseId },
            transaction
        });

        // 7. Decrement Course total students count
        await db.Course.increment('totalStudents', {
            by: -1,
            where: { id: courseId },
            transaction
        });

        // 8. Create RefundRequest record
        const refundRequest = await db.RefundRequest.create({
            userId,
            courseId,
            orderItemId: orderItem.id,
            refundAmount,
            method,
            status: method === 'credit' ? 'COMPLETED' : 'PROCESSING',
            reason,
            completedAt: method === 'credit' ? new Date() : null
        }, { transaction });

        // 9. If method is credit, add balance to User
        if (method === 'credit') {
            const user = await db.User.findByPk(userId, { transaction });
            user.creditBalance = Number(user.creditBalance) + refundAmount;
            await user.save({ transaction });
        }

        await transaction.commit();

        // 10. Send notification (async)
        try {
            const course = await db.Course.findByPk(courseId);
            const courseName = course ? course.name : 'Course';
            if (method === 'credit') {
                await notificationService.createNotification(
                    userId,
                    'order_paid',
                    '💰 Refund Completed (Credit)',
                    `Refund of ${refundAmount.toLocaleString('vi-VN')}₫ for "${courseName}" has been added to your Credit Balance immediately.`,
                    { refundRequestId: refundRequest.id, refundAmount }
                );
            } else {
                await notificationService.createNotification(
                    userId,
                    'order_created',
                    '⏳ Refund Request Submitted',
                    `Your refund request of ${refundAmount.toLocaleString('vi-VN')}₫ for "${courseName}" via ${method === 'momo' ? 'MoMo' : 'Bank Transfer'} is processing. Please wait 2-3 days.`,
                    { refundRequestId: refundRequest.id, refundAmount }
                );
            }
        } catch (e) {
            console.error('Notification error:', e);
        }

        return res.status(201).json(new ApiResponse(201, refundRequest, 'Refund requested successfully'));
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
});

/**
 * Get user refund requests
 */
export const getMyRequests = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const requests = await db.RefundRequest.findAll({
        where: { userId },
        include: [{
            model: db.Course,
            as: 'course',
            attributes: ['id', 'name', 'thumbnail', 'slug']
        }],
        order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(new ApiResponse(200, requests, 'Refund history retrieved successfully'));
});
