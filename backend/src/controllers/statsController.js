import { getDashboardStatsService } from '../services/statsService';

export const getDashboardStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const result = await getDashboardStatsService(startDate, endDate);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error("Error in getDashboardStats controller:", error);
        return res.status(500).json({ status: 500, message: "Lỗi server nội bộ" });
    }
};
