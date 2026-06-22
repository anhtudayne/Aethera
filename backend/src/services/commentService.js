import db from '../models/index';
import { checkEnrollmentService } from './courseService';

export const getCourseCommentsService = async (courseId) => {
    try {
        const comments = await db.Comment.findAll({
            where: { courseId },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'image']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Xây dựng cây bình luận đệ quy
        const commentMap = {};
        const roots = [];

        // Đưa tất cả vào map với mảng replies rỗng
        comments.forEach(c => {
            commentMap[c.id] = { ...c.toJSON(), replies: [] };
        });

        // Duyệt lại để móc các reply vào comment cha
        // Lưu ý: order by createdAt DESC sẽ làm các con cũng DESC
        comments.forEach(c => {
            const current = commentMap[c.id];
            if (c.parentId) {
                if (commentMap[c.parentId]) {
                    // Do ta muốn reply cũ nhất hiện trước (hoặc mới nhất hiện trước tuỳ UX)
                    // Ở đây, push thì reply mới nhất sẽ lên đầu vì mảng gốc sort DESC
                    // Ta unshift để các con sắp xếp từ cũ tới mới cho dễ đọc từ trên xuống
                    commentMap[c.parentId].replies.unshift(current);
                } else {
                    // Trưởng hợp cha bị xoá nhưng db còn sót con (nếu có, dù on cascade)
                    roots.push(current);
                }
            } else {
                roots.push(current);
            }
        });

        return roots;
    } catch (error) {
        console.error('Lỗi lấy comments:', error);
        throw error;
    }
};

export const createCourseCommentService = async (userId, courseId, content, parentId = null) => {
    try {
        if (!content || !content.trim()) {
            return { status: 400, message: 'Nội dung bình luận không được rỗng' };
        }

        // Kiểm tra quyền (Đã enroll)
        // Check bằng hàm ở courseService, slug hay id? checkEnrollmentService expects slug.
        // Wait, courseService expects (userId, slug). Ta cần hàm check theo id.
        const enrollment = await db.UserCourse.findOne({ where: { userId, courseId } });
        if (!enrollment) {
            return { status: 403, message: 'Bạn cần đăng ký khóa học để bình luận' };
        }

        // Nếu có parentId, check parentId tồn tại
        if (parentId) {
            const parent = await db.Comment.findByPk(parentId);
            if (!parent) {
                return { status: 404, message: 'Bình luận trả lời không tồn tại' };
            }
            // Đảm bảo reply thuộc cùng course
            if (parent.courseId !== parseInt(courseId)) {
                return { status: 400, message: 'Bình luận không hợp lệ' };
            }
        }

        const newComment = await db.Comment.create({
            content: content.trim(),
            userId,
            courseId,
            parentId
        });

        // Fetch lại kèm User để trả về FE render ngay
        const commentWithUser = await db.Comment.findByPk(newComment.id, {
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'image']
                }
            ]
        });

        return { status: 201, data: { ...commentWithUser.toJSON(), replies: [] } };
    } catch (error) {
        console.error('Lỗi tạo comment:', error);
        throw error;
    }
};
