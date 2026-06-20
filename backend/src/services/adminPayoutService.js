import db from '../models';
import { PAGINATION } from '../utils/constants';

export const getPayouts = async (query) => {
    try {
        const page = parseInt(query.page) || PAGINATION.DEFAULT_PAGE;
        const limit = parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT;
        const offset = (page - 1) * limit;
        
        const whereClause = query.status ? { status: query.status } : {};

        const { count, rows } = await db.PayoutRequest.findAndCountAll({
            where: whereClause,
            include: [{
                model: db.User,
                as: 'instructor',
                attributes: ['id', 'firstName', 'lastName', 'email', 'image']
            }],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        return {
            status: 200,
            message: 'Lấy danh sách yêu cầu thanh toán thành công',
            data: rows,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error) {
        console.error('Error in getPendingPayouts:', error);
        return {
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.'
        };
    }
};

export const markPayoutAsPaid = async (payoutId, adminId) => {
    try {
        const payout = await db.PayoutRequest.findByPk(payoutId);
        if (!payout) {
            return {
                status: 404,
                message: 'Không tìm thấy yêu cầu thanh toán'
            };
        }

        if (payout.status !== 'PENDING') {
            return {
                status: 400,
                message: 'Chỉ có thể thanh toán các yêu cầu đang chờ xử lý'
            };
        }

        payout.status = 'COMPLETED';
        payout.adminId = adminId;
        await payout.save();

        // In a real application, we might also record a transaction history here

        return {
            status: 200,
            message: 'Đã đánh dấu thanh toán thành công',
            data: payout
        };
    } catch (error) {
        console.error('Error in markPayoutAsPaid:', error);
        return {
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.'
        };
    }
};

export const rejectPayout = async (payoutId, adminId, note) => {
    try {
        const payout = await db.PayoutRequest.findByPk(payoutId);
        if (!payout) {
            return {
                status: 404,
                message: 'Không tìm thấy yêu cầu thanh toán'
            };
        }

        if (payout.status !== 'PENDING') {
            return {
                status: 400,
                message: 'Chỉ có thể từ chối các yêu cầu đang chờ xử lý'
            };
        }

        payout.status = 'REJECTED';
        payout.adminId = adminId;
        payout.adminNote = note;
        await payout.save();

        return {
            status: 200,
            message: 'Đã từ chối yêu cầu thanh toán',
            data: payout
        };
    } catch (error) {
        console.error('Error in rejectPayout:', error);
        return {
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.'
        };
    }
};
