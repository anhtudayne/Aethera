import db from '../models';
import { emitToUser } from '../socketManager';

/**
 * Create a notification, save to DB, and push via WebSocket.
 * Optionally sends email (handled by caller for specific types).
 */
export const createNotification = async (userId, type, title, message, data = null) => {
    try {
        const notification = await db.Notification.create({
            userId,
            type,
            title,
            message,
            data,
            isRead: false,
            isEmailSent: false,
        });

        // Push real-time via Socket.IO
        emitToUser(userId, 'new_notification', {
            id: notification.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            data: notification.data,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
        });

        // Also push updated unread count
        const unreadCount = await getUnreadCount(userId);
        emitToUser(userId, 'unread_count', { count: unreadCount });

        return notification;
    } catch (error) {
        console.error('Lỗi tạo notification:', error);
        // Don't throw — notification failure should not break main flow
        return null;
    }
};

/**
 * Get notifications for a user with pagination.
 */
export const getNotifications = async (userId, page = 1, limit = 20) => {
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Notification.findAndCountAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset,
    });

    return {
        notifications: rows,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
        },
    };
};

/**
 * Mark a single notification as read.
 */
export const markAsRead = async (userId, notificationId) => {
    const notification = await db.Notification.findOne({
        where: { id: notificationId, userId },
    });

    if (!notification) {
        const error = new Error('Không tìm thấy thông báo.');
        error.statusCode = 404;
        throw error;
    }

    notification.isRead = true;
    await notification.save();

    return notification;
};

/**
 * Mark all notifications as read for a user.
 */
export const markAllAsRead = async (userId) => {
    await db.Notification.update(
        { isRead: true },
        { where: { userId, isRead: false } }
    );

    // Push updated count (0)
    emitToUser(userId, 'unread_count', { count: 0 });
};

/**
 * Get unread notification count.
 */
export const getUnreadCount = async (userId) => {
    const count = await db.Notification.count({
        where: { userId, isRead: false },
    });
    return count;
};
