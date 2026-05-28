import db from '../models';
import { Op } from 'sequelize';

export const createCoupon = async (data) => {
    try {
        const coupon = await db.Coupon.create(data);
        return coupon;
    } catch (error) {
        throw error;
    }
};

export const getAllCoupons = async () => {
    try {
        const coupons = await db.Coupon.findAll({
            order: [['createdAt', 'DESC']]
        });
        return coupons;
    } catch (error) {
        throw error;
    }
};

export const updateCoupon = async (id, data) => {
    try {
        const coupon = await db.Coupon.findByPk(id);
        if (!coupon) {
            const error = new Error('Không tìm thấy mã giảm giá');
            error.statusCode = 404;
            throw error;
        }
        await coupon.update(data);
        return coupon;
    } catch (error) {
        throw error;
    }
};

export const deleteCoupon = async (id) => {
    try {
        const coupon = await db.Coupon.findByPk(id);
        if (!coupon) {
            const error = new Error('Không tìm thấy mã giảm giá');
            error.statusCode = 404;
            throw error;
        }
        await coupon.destroy();
        return true;
    } catch (error) {
        throw error;
    }
};

export const validateCoupon = async (code, cartTotal) => {
    try {
        const coupon = await db.Coupon.findOne({ where: { code } });

        if (!coupon) {
            const error = new Error('Mã giảm giá không tồn tại');
            error.statusCode = 404;
            throw error;
        }

        if (!coupon.isActive) {
            const error = new Error('Mã giảm giá đã bị khóa');
            error.statusCode = 400;
            throw error;
        }

        const now = new Date();
        if (now < coupon.startDate || now > coupon.endDate) {
            const error = new Error('Mã giảm giá đã hết hạn hoặc chưa đến thời gian áp dụng');
            error.statusCode = 400;
            throw error;
        }

        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            const error = new Error('Mã giảm giá đã hết lượt sử dụng');
            error.statusCode = 400;
            throw error;
        }

        if (Number(cartTotal) < Number(coupon.minOrderValue)) {
            const error = new Error(`Đơn hàng tối thiểu để áp dụng là ${Number(coupon.minOrderValue).toLocaleString('vi-VN')}đ`);
            error.statusCode = 400;
            throw error;
        }

        let discountAmount = 0;
        if (coupon.discountType === 'fixed') {
            discountAmount = Number(coupon.discountValue);
        } else if (coupon.discountType === 'percent') {
            discountAmount = (Number(cartTotal) * Number(coupon.discountValue)) / 100;
            if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
                discountAmount = Number(coupon.maxDiscount);
            }
        }

        // Không cho giảm quá tổng tiền
        if (discountAmount > cartTotal) {
            discountAmount = cartTotal;
        }

        return {
            coupon,
            discountAmount,
            finalTotal: cartTotal - discountAmount
        };

    } catch (error) {
        throw error;
    }
};

export const incrementCouponUsage = async (code, transaction) => {
    if (!code) return;
    await db.Coupon.increment('usedCount', {
        where: { code },
        transaction
    });
};
