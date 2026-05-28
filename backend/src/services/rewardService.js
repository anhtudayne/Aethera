import db from '../models';

const POINT_TO_VND = 1000; // 1 điểm = 1.000đ

/**
 * Lấy tổng điểm tích lũy + lịch sử giao dịch
 */
export const getMyLoyaltyPoints = async (userId) => {
    const user = await db.User.findByPk(userId, {
        attributes: ['loyaltyPoints'],
    });

    const history = await db.LoyaltyPoint.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: 50,
    });

    return {
        totalPoints: user?.loyaltyPoints || 0,
        equivalentVND: (user?.loyaltyPoints || 0) * POINT_TO_VND,
        pointToVND: POINT_TO_VND,
        history,
    };
};

/**
 * Lấy tổng hợp thưởng
 */
export const getRewardSummary = async (userId) => {
    const user = await db.User.findByPk(userId, {
        attributes: ['loyaltyPoints'],
    });

    const totalReviews = await db.Review.count({ where: { userId } });

    return {
        totalPoints: user?.loyaltyPoints || 0,
        equivalentVND: (user?.loyaltyPoints || 0) * POINT_TO_VND,
        pointToVND: POINT_TO_VND,
        totalReviews,
    };
};
