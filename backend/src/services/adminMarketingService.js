import db from '../models';
import { PAGINATION } from '../utils/constants';

export const getVouchers = async (query) => {
    try {
        const page = parseInt(query.page) || PAGINATION.DEFAULT_PAGE;
        const limit = parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT;
        const offset = (page - 1) * limit;

        const { count, rows } = await db.Voucher.findAndCountAll({
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        // Automatically update expired vouchers
        const now = new Date();
        for (const voucher of rows) {
            if (voucher.status === 'ACTIVE' && new Date(voucher.expiryDate) < now) {
                voucher.status = 'EXPIRED';
                await voucher.save();
            }
        }

        return {
            status: 200,
            message: 'Vouchers retrieved successfully',
            data: rows,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error) {
        console.error('Error in getVouchers:', error);
        return {
            status: 500,
            message: 'Internal server error. Please try again later.'
        };
    }
};

export const createVoucher = async (data) => {
    try {
        const { code, discountType, discountValue, maxDiscountValue, startDate, expiryDate, maxUsage } = data;

        if (!code || !discountValue || !expiryDate) {
            return {
                status: 400,
                message: 'Please provide all required fields: code, discountValue, and expiryDate'
            };
        }

        const existingVoucher = await db.Voucher.findOne({ where: { code } });
        if (existingVoucher) {
            return {
                status: 400,
                message: 'This voucher code already exists'
            };
        }

        const now = new Date();
        const parsedExpiry = new Date(expiryDate);
        // Voucher is ACTIVE only if not expired. startDate does not affect the saved status.
        const status = parsedExpiry < now ? 'EXPIRED' : 'ACTIVE';

        const voucher = await db.Voucher.create({
            code: code.toUpperCase(),
            discountType: discountType || 'PERCENTAGE',
            discountValue: Number(discountValue),
            maxDiscountValue: maxDiscountValue ? Number(maxDiscountValue) : null,
            startDate: startDate ? new Date(startDate) : now,
            expiryDate: parsedExpiry,
            status,
            usageCount: 0,
            maxUsage: maxUsage ? parseInt(maxUsage, 10) : null
        });

        return {
            status: 201,
            message: 'Voucher created successfully',
            data: voucher
        };
    } catch (error) {
        console.error('Error in createVoucher:', error);
        return {
            status: 500,
            message: 'Internal server error. Please try again later.'
        };
    }
};

export const updateVoucherStatus = async (id, status) => {
    try {
        const voucher = await db.Voucher.findByPk(id);
        if (!voucher) {
            return {
                status: 404,
                message: 'Voucher not found'
            };
        }

        voucher.status = status;
        await voucher.save();

        return {
            status: 200,
            message: 'Voucher status updated successfully',
            data: voucher
        };
    } catch (error) {
        console.error('Error in updateVoucherStatus:', error);
        return {
            status: 500,
            message: 'Internal server error. Please try again later.'
        };
    }
};

export const updateVoucher = async (id, data) => {
    try {
        const voucher = await db.Voucher.findByPk(id);
        if (!voucher) {
            return {
                status: 404,
                message: 'Voucher not found'
            };
        }

        const { discountType, discountValue, maxDiscountValue, startDate, expiryDate, maxUsage } = data;

        if (!discountValue || !expiryDate) {
            return {
                status: 400,
                message: 'Please provide discountValue and expiryDate'
            };
        }

        const parsedExpiry = new Date(expiryDate);
        const now = new Date();

        // Automatically recalculate status based on the new expiry date
        // - Only reset to ACTIVE if the date is valid and the voucher was EXPIRED
        const updatedStatus =
            voucher.status === 'DISABLED'
                ? 'DISABLED' // Keep DISABLED if manually disabled by Admin
                : parsedExpiry < now
                    ? 'EXPIRED'
                    : 'ACTIVE';

        await voucher.update({
            discountType: discountType || voucher.discountType,
            discountValue: Number(discountValue),
            maxDiscountValue: maxDiscountValue !== undefined ? (maxDiscountValue ? Number(maxDiscountValue) : null) : voucher.maxDiscountValue,
            startDate: startDate ? new Date(startDate) : voucher.startDate,
            expiryDate: parsedExpiry,
            maxUsage: maxUsage !== undefined ? (maxUsage ? parseInt(maxUsage, 10) : null) : voucher.maxUsage,
            status: updatedStatus,
        });

        return {
            status: 200,
            message: 'Voucher updated successfully',
            data: voucher
        };
    } catch (error) {
        console.error('Error in updateVoucher:', error);
        return {
            status: 500,
            message: 'Internal server error. Please try again later.'
        };
    }
};