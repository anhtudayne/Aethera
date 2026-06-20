import { getPayouts, markPayoutAsPaid, rejectPayout } from '../services/adminPayoutService';

export const handleGetPayouts = async (req, res) => {
    try {
        const result = await getPayouts(req.query);
        return res.status(result.status || 200).json(result);
    } catch (error) {
        console.error('Controller - Lỗi lấy danh sách thanh toán:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};

export const handleMarkAsPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id; // From verifyToken middleware
        
        const result = await markPayoutAsPaid(id, adminId);
        return res.status(result.status || 200).json(result);
    } catch (error) {
        console.error('Controller - Lỗi đánh dấu thanh toán:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};

export const handleRejectPayout = async (req, res) => {
    try {
        const { id } = req.params;
        const { note } = req.body;
        const adminId = req.user.id; // From verifyToken middleware
        
        const result = await rejectPayout(id, adminId, note);
        return res.status(result.status || 200).json(result);
    } catch (error) {
        console.error('Controller - Lỗi từ chối thanh toán:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};
