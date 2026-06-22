import { updateUserProfile, getUserProfile, getUserStreak, logUserActivity } from '../services/userService';

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await getUserProfile(userId);
        return res.status(result.status).json({
            status: result.status,
            message: result.message || 'Thông tin hồ sơ',
            user: result.data
        });
    } catch (error) {
        console.error('Controller - Lỗi lấy hồ sơ:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy ID từ middleware, chống IDOR
        const newData = req.body; // Dữ liệu đã được validate ở lớp trước

        const result = await updateUserProfile(userId, newData);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Controller - Lỗi cập nhật hồ sơ:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};

export const getStreak = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await getUserStreak(userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Controller - Lỗi lấy streak:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server nội bộ' });
    }
};

export const logActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { minutes } = req.body;
        const result = await logUserActivity(userId, minutes);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Controller - Lỗi log activity:', error);
        return res.status(500).json({ status: 500, message: 'Lỗi server nội bộ' });
    }
};
