import * as notificationService from '../services/notificationService';

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20 } = req.query;

        const result = await notificationService.getNotifications(userId, page, limit);
        return res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (error) {
        console.error('Lỗi getNotifications:', error);
        return res.status(error.statusCode || 500).json({
            status: error.statusCode || 500,
            message: error.message || 'Lỗi server',
        });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const count = await notificationService.getUnreadCount(userId);

        return res.status(200).json({
            status: 200,
            data: { unreadCount: count },
        });
    } catch (error) {
        console.error('Lỗi getUnreadCount:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server',
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        await notificationService.markAsRead(userId, id);
        return res.status(200).json({
            status: 200,
            message: 'Đã đánh dấu đã đọc.',
        });
    } catch (error) {
        console.error('Lỗi markAsRead:', error);
        return res.status(error.statusCode || 500).json({
            status: error.statusCode || 500,
            message: error.message || 'Lỗi server',
        });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await notificationService.markAllAsRead(userId);

        return res.status(200).json({
            status: 200,
            message: 'Đã đánh dấu tất cả đã đọc.',
        });
    } catch (error) {
        console.error('Lỗi markAllAsRead:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server',
        });
    }
};
