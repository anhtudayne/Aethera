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
            message: 'Lấy danh sách vouchers thành công',
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
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.'
        };
    }
};

export const createVoucher = async (data) => {
    try {
        const { code, discountPercent, startDate, expiryDate, maxUsage } = data;

        if (!code || !discountPercent || !expiryDate) {
            return {
                status: 400,
                message: 'Vui lòng cung cấp đủ code, discountPercent và expiryDate'
            };
        }

        const existingVoucher = await db.Voucher.findOne({ where: { code } });
        if (existingVoucher) {
            return {
                status: 400,
                message: 'Mã voucher này đã tồn tại'
            };
        }

        const now = new Date();
        const parsedExpiry = new Date(expiryDate);
        // Voucher chỉ ACTIVE nếu chưa hết hạn. startDate không ảnh hưởng đến trạng thái lưu.
        const status = parsedExpiry < now ? 'EXPIRED' : 'ACTIVE';

        const voucher = await db.Voucher.create({
            code: code.toUpperCase(),
            discountPercent,
            startDate: startDate ? new Date(startDate) : now,
            expiryDate: parsedExpiry,
            status,
            usageCount: 0,
            maxUsage: maxUsage ? parseInt(maxUsage, 10) : null
        });

        return {
            status: 201,
            message: 'Tạo voucher thành công',
            data: voucher
        };
    } catch (error) {
        console.error('Error in createVoucher:', error);
        return {
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.'
        };
    }
};

export const updateVoucherStatus = async (id, status) => {
    try {
        const voucher = await db.Voucher.findByPk(id);
        if (!voucher) {
            return {
                status: 404,
                message: 'Không tìm thấy voucher'
            };
        }

        voucher.status = status;
        await voucher.save();

        return {
            status: 200,
            message: 'Cập nhật trạng thái voucher thành công',
            data: voucher
        };
    } catch (error) {
        console.error('Error in updateVoucherStatus:', error);
        return {
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.'
        };
    }
};

export const updateVoucher = async (id, data) => {
    try {
        const voucher = await db.Voucher.findByPk(id);
        if (!voucher) {
            return {
                status: 404,
                message: 'Không tìm thấy voucher'
            };
        }

        const { discountPercent, startDate, expiryDate, maxUsage } = data;

        if (!discountPercent || !expiryDate) {
            return {
                status: 400,
                message: 'Vui lòng cung cấp discountPercent và expiryDate'
            };
        }

        const parsedExpiry = new Date(expiryDate);
        const now = new Date();

        // Tự động tính lại status dựa trên ngày hết hạn mới
        // – Chỉ reset về ACTIVE nếu ngày còn hạn và voucher đang EXPIRED
        const updatedStatus =
            voucher.status === 'DISABLED'
                ? 'DISABLED' // Giữ DISABLED nếu Admin đã tắt thủ công
                : parsedExpiry < now
                ? 'EXPIRED'
                : 'ACTIVE';

        await voucher.update({
            discountPercent,
            startDate: startDate ? new Date(startDate) : voucher.startDate,
            expiryDate: parsedExpiry,
            maxUsage: maxUsage !== undefined ? (maxUsage ? parseInt(maxUsage, 10) : null) : voucher.maxUsage,
            status: updatedStatus,
        });

        return {
            status: 200,
            message: 'Cập nhật voucher thành công',
            data: voucher
        };
    } catch (error) {
        console.error('Error in updateVoucher:', error);
        return {
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.'
        };
    }
};

