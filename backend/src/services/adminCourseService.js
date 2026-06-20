import db from '../models/index';
import { Op } from 'sequelize';

const Course = db.Course;
const Category = db.Category;
const User = db.User; // If instructor is mapped to user later, though currently it's a string

const includeOptions = [
    { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
];

/**
 * Lấy danh sách khóa học cho Admin quản lý
 * @param {Object} params - Tham số lọc, phân trang
 */
export const getAdminCourses = async (params) => {
    const { search, status, page = 1, limit = 10 } = params;
    const where = {};

    if (status && status !== 'all') {
        where.status = status;
    }

    if (search) {
        where.name = { [Op.like]: `%${search}%` };
    }

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const offset = (parsedPage - 1) * parsedLimit;

    const { count, rows } = await Course.findAndCountAll({
        where,
        include: includeOptions,
        order: [['createdAt', 'DESC']],
        limit: parsedLimit,
        offset,
        distinct: true,
    });

    return {
        status: 200,
        data: rows,
        pagination: {
            currentPage: parsedPage,
            totalPages: Math.ceil(count / parsedLimit),
            totalItems: count,
            limit: parsedLimit
        }
    };
};

/**
 * Cập nhật trạng thái khóa học (Duyệt / Từ chối / Đình chỉ)
 * @param {number} courseId - ID khóa học
 * @param {string} newStatus - 'pending', 'published', 'rejected', 'suspended'
 * @param {string} reason - Lý do đổi trạng thái
 * @param {number} adminId - ID admin thực hiện
 */
export const updateCourseStatus = async (courseId, newStatus, reason = null, adminId = null) => {
    const validStatuses = ['draft', 'pending', 'published', 'rejected', 'suspended'];
    if (!validStatuses.includes(newStatus)) {
        return { status: 400, message: 'Trạng thái không hợp lệ.' };
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
        return { status: 404, message: 'Không tìm thấy khóa học.' };
    }

    const oldStatus = course.status;
    course.status = newStatus;
    await course.save();

    // Lưu vào bảng CourseStatusHistory
    await db.CourseStatusHistory.create({
        courseId: course.id,
        adminId: adminId,
        oldStatus: oldStatus,
        newStatus: newStatus,
        reason: reason
    });

    // Giả lập gửi email cho giảng viên nếu bị từ chối hoặc đình chỉ
    if (newStatus === 'rejected' || newStatus === 'suspended') {
        console.log(`[EMAIL SIMULATION] Gửi email đến giảng viên của khóa học ${course.name} (ID: ${course.id}).\nTrạng thái mới: ${newStatus}.\nLý do: ${reason || 'Không có lý do cụ thể'}`);
    }

    return {
        status: 200,
        message: 'Cập nhật trạng thái khóa học thành công.',
        data: course
    };
};

/**
 * Lấy lịch sử thay đổi trạng thái khóa học
 * @param {number} courseId - ID khóa học
 */
export const getCourseStatusHistory = async (courseId) => {
    const history = await db.CourseStatusHistory.findAll({
        where: { courseId },
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: db.User,
                as: 'admin',
                attributes: ['id', 'username', 'email']
            }
        ]
    });

    return {
        status: 200,
        data: history
    };
};
