import db from '../models/index';
import { Op } from 'sequelize';
import { getReviewCriteriaById } from '../utils/reviewCriteria';
import { sendCourseRejectionEmail } from '../utils/emailHelper';

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
export const updateCourseStatus = async (courseId, newStatus, reasons = [], adminId = null) => {
    const validStatuses = ['draft', 'pending', 'published', 'rejected', 'suspended'];
    if (!validStatuses.includes(newStatus)) {
        return { status: 400, message: 'Trạng thái không hợp lệ.' };
    }

    const course = await Course.findByPk(courseId, {
        include: [{ model: db.User, as: 'instructorData' }]
    });
    
    if (!course) {
        return { status: 404, message: 'Không tìm thấy khóa học.' };
    }

    const oldStatus = course.status;
    course.status = newStatus;
    await course.save();

    let reasonText = null;
    if (reasons && reasons.length > 0) {
        // If reasons is an array, JSON stringify it. If it's a string, use it.
        reasonText = Array.isArray(reasons) ? JSON.stringify(reasons) : reasons;
    }

    // Lưu vào bảng CourseStatusHistory
    await db.CourseStatusHistory.create({
        courseId: course.id,
        adminId: adminId,
        oldStatus: oldStatus,
        newStatus: newStatus,
        reason: reasonText
    });

    // Send email to instructor if rejected
    if (newStatus === 'rejected') {
        const reasonArray = Array.isArray(reasons) ? reasons : [reasons];
        const criteriaDetails = reasonArray.map(r => getReviewCriteriaById(r));
        const isEmail = course.instructor && course.instructor.includes('@');
        const instructorEmail = course.instructorData?.email || (isEmail ? course.instructor : 'instructor@example.com');
        await sendCourseRejectionEmail(instructorEmail, course.name, criteriaDetails);
    } else if (newStatus === 'suspended') {
        console.log(`[EMAIL SIMULATION] Gửi email đình chỉ khóa học ${course.name}.`);
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
                attributes: ['id', 'firstName', 'lastName', 'email']
            }
        ]
    });

    return {
        status: 200,
        data: history
    };
};
