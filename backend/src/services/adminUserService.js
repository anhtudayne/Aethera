import db from '../models';
import { Op } from 'sequelize';
import { ROLES, PAGINATION } from '../utils/constants';
import { sendUserSuspensionEmail } from '../utils/emailHelper';

export const getAdminUsers = async (query) => {
    try {
        const page = parseInt(query.page) || PAGINATION.DEFAULT_PAGE;
        const limit = parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT;
        const offset = (page - 1) * limit;

        const whereCondition = {};
        
        // Filter by role: 'student', 'instructor', or 'all'
        if (query.role && query.role !== 'all') {
            if (query.role === 'student') {
                whereCondition.roleId = ROLES.USER; // 'user' is student in DB
            } else if (query.role === 'instructor') {
                whereCondition.roleId = ROLES.INSTRUCTOR;
            }
        } else {
            // Default to filtering out admins
            whereCondition.roleId = { [Op.ne]: ROLES.ADMIN };
        }

        if (query.search) {
            whereCondition[Op.or] = [
                { email: { [Op.like]: `%${query.search}%` } },
                { firstName: { [Op.like]: `%${query.search}%` } },
                { lastName: { [Op.like]: `%${query.search}%` } }
            ];
        }

        const { count, rows } = await db.User.findAndCountAll({
            where: whereCondition,
            attributes: ['id', 'email', 'firstName', 'lastName', 'roleId', 'isActive', 'image', 'createdAt'],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        return {
            status: 200,
            message: 'Lấy danh sách người dùng thành công',
            data: rows,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error) {
        console.error('Error in getAdminUsers:', error);
        return {
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.'
        };
    }
};

export const updateUserStatus = async (id, isActive, reason) => {
    try {
        const user = await db.User.findByPk(id);
        if (!user) {
            return {
                status: 404,
                message: 'Không tìm thấy người dùng'
            };
        }

        // Prevent modifying admin
        if (user.roleId === ROLES.ADMIN) {
            return {
                status: 403,
                message: 'Không thể thay đổi trạng thái của Admin'
            };
        }

        user.isActive = isActive;
        await user.save();

        if (isActive === false) {
            // Ban/Suspend: Send email
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            await sendUserSuspensionEmail(user.email, fullName || 'User', reason || 'Vi phạm chính sách nền tảng.');
        }

        return {
            status: 200,
            message: 'Cập nhật trạng thái người dùng thành công',
            data: user
        };
    } catch (error) {
        console.error('Error in updateUserStatus:', error);
        return {
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.'
        };
    }
};

export const getInstructorApplications = async (query) => {
    try {
        const page = parseInt(query.page) || PAGINATION.DEFAULT_PAGE;
        const limit = parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT;
        const offset = (page - 1) * limit;

        const whereCondition = {};
        if (query.status && query.status !== 'ALL') {
            whereCondition.status = query.status;
        }

        const { count, rows } = await db.InstructorApplication.findAndCountAll({
            where: whereCondition,
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['id', 'email', 'firstName', 'lastName', 'image']
            }],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        return {
            status: 200,
            message: 'Lấy danh sách đơn đăng ký thành công',
            data: rows,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit
            }
        };
    } catch (error) {
        console.error('Error in getInstructorApplications:', error);
        return {
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.'
        };
    }
};

export const updateInstructorApplication = async (id, data) => {
    try {
        const { status, reason } = data; // status: 'APPROVED' or 'REJECTED'
        const application = await db.InstructorApplication.findByPk(id, {
            include: [{ model: db.User, as: 'user' }]
        });

        if (!application) {
            return { status: 404, message: 'Không tìm thấy đơn đăng ký' };
        }

        if (application.status !== 'PENDING') {
            return { status: 400, message: 'Đơn đăng ký này đã được xử lý' };
        }

        if (status === 'APPROVED') {
            application.status = 'APPROVED';
            application.reason = null;
            await application.save();

            // Update user role
            const user = application.user;
            user.roleId = ROLES.INSTRUCTOR;
            await user.save();
        } else if (status === 'REJECTED') {
            application.status = 'REJECTED';
            application.reason = reason;
            await application.save();
        } else {
            return { status: 400, message: 'Trạng thái không hợp lệ' };
        }

        return {
            status: 200,
            message: 'Cập nhật trạng thái đơn thành công',
            data: application
        };
    } catch (error) {
        console.error('Error in updateInstructorApplication:', error);
        return {
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.'
        };
    }
};
