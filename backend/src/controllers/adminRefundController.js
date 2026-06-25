import db from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import { createError } from '../utils/helpers';
import * as notificationService from '../services/notificationService';

/**
 * Get all refund requests (Admin)
 * GET /api/admin/refunds
 */
export const getRefundRequests = asyncHandler(async (req, res) => {
    const { status, method } = req.query;
    const whereClause = {};
    if (status) whereClause.status = status;
    if (method) whereClause.method = method;

    const requests = await db.RefundRequest.findAll({
        where: whereClause,
        include: [
            {
                model: db.User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email', 'image']
            },
            {
                model: db.Course,
                as: 'course',
                attributes: ['id', 'name', 'thumbnail', 'slug']
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(new ApiResponse(200, requests, 'Refund requests retrieved successfully'));
});

/**
 * Complete a manual external refund (Admin)
 * PATCH /api/admin/refunds/:id/complete
 */
export const completeRefundTransfer = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { adminNote } = req.body;

    const request = await db.RefundRequest.findByPk(id, {
        include: [
            { model: db.User, as: 'user' },
            { model: db.Course, as: 'course' }
        ]
    });

    if (!request) {
        throw createError(404, 'Refund request not found');
    }

    if (request.status !== 'PROCESSING') {
        throw createError(400, 'This refund request is already completed');
    }

    request.status = 'COMPLETED';
    request.completedAt = new Date();
    if (adminNote) {
        request.adminNote = adminNote;
    }
    await request.save();

    // Send notification
    try {
        const courseName = request.course ? request.course.name : 'Course';
        await notificationService.createNotification(
            request.userId,
            'refund_completed',
            '💰 Refund Completed',
            `Your refund request of ${Number(request.refundAmount).toLocaleString('vi-VN')}₫ for "${courseName}" has been sent to your account.` + (adminNote ? ` Note: ${adminNote}` : ''),
            { refundRequestId: request.id, refundAmount: Number(request.refundAmount) }
        );
    } catch (e) {
        console.error('Notification error:', e);
    }

    return res.status(200).json(new ApiResponse(200, request, 'Refund completed successfully'));
});
