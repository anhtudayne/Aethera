import db from '../models/index.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Lấy danh sách các khóa học mà học viên đã mua
 */
export const getMyEnrolledCoursesForReport = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    const enrollments = await db.UserCourse.findAll({
        where: { userId },
        include: [{
            model: db.Course,
            as: 'course',
            attributes: ['id', 'name', 'instructor', 'thumbnail']
        }],
        order: [['enrolledAt', 'DESC']]
    });

    const courses = enrollments
        .map(e => e.course)
        .filter(Boolean);

    return res.status(200).json(new ApiResponse(200, courses));
});

/**
 * Tạo một ticket báo cáo mới
 */
export const createUserTicket = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { title, message, targetId, attachments } = req.body;

    if (!title || !message) {
        return res.status(400).json({ status: 400, message: 'Vui lòng điền đầy đủ tiêu đề và nội dung.' });
    }

    // Nếu báo cáo về khóa học cụ thể, kiểm tra xem học viên đã mua chưa
    if (targetId) {
        const hasEnrolled = await db.UserCourse.findOne({
            where: { userId, courseId: targetId }
        });
        if (!hasEnrolled) {
            return res.status(403).json({ status: 403, message: 'Bạn chỉ có thể báo cáo các khóa học đã mua.' });
        }
    }

    // Kiểm tra giới hạn hình ảnh minh chứng (tối đa 2)
    if (attachments && Array.isArray(attachments) && attachments.length > 2) {
        return res.status(400).json({ status: 400, message: 'Chỉ được tải lên tối đa 2 hình ảnh minh chứng.' });
    }

    const ticket = await db.SupportTicket.create({
        userId,
        ticketType: targetId ? 'REPORT' : 'OTHER',
        status: 'OPEN', // Trạng thái "Đang chờ xử lý"
        priority: 'MEDIUM', // Gán mặc định, người dùng không cần chọn
        title,
        message,
        targetId: targetId ? Number(targetId) : null,
        attachments: attachments || []
    });

    return res.status(201).json(new ApiResponse(201, ticket, 'Gửi báo cáo thành công!'));
});

/**
 * Lấy lịch sử báo cáo của học viên
 */
export const getMyTickets = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const tickets = await db.SupportTicket.findAll({
        where: { userId },
        include: [
            {
                model: db.User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email', 'image']
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    // Thêm tên khóa học liên quan nếu có targetId
    const formattedTickets = await Promise.all(tickets.map(async (ticket) => {
        let courseInfo = null;
        if (ticket.targetId && ticket.ticketType === 'REPORT') {
            const course = await db.Course.findByPk(ticket.targetId, {
                attributes: ['id', 'name', 'instructor']
            });
            if (course) {
                courseInfo = {
                    id: course.id,
                    name: course.name,
                    instructor: course.instructor
                };
            }
        }
        
        return {
            ...ticket.toJSON(),
            course: courseInfo
        };
    }));

    return res.status(200).json(new ApiResponse(200, formattedTickets));
});
