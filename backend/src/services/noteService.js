import db from '../models/index';
import { createError } from '../utils/helpers';

// 1. Create a note
export const createNote = async (userId, courseId, lessonId, content, timestamp = null) => {
    try {
        // Check if enrolled
        const enrollment = await db.UserCourse.findOne({ where: { userId, courseId } });
        if (!enrollment) throw createError(403, 'Bạn chưa đăng ký khóa học này.');

        // Check if lesson belongs to the course
        const lesson = await db.Lesson.findByPk(lessonId, {
            include: [{ model: db.Section, as: 'section', where: { courseId } }],
        });
        if (!lesson) throw createError(404, 'Bài học không thuộc khóa học này.');

        const note = await db.CourseNote.create({ userId, courseId, lessonId, content, timestamp });
        return note;
    } catch (error) {
        console.error('Lỗi tạo ghi chú:', error);
        throw error;
    }
};

// 2. Get notes for a lesson
export const getNotesForLesson = async (userId, lessonId) => {
    try {
        return await db.CourseNote.findAll({
            where: { userId, lessonId },
            order: [['timestamp', 'ASC'], ['createdAt', 'ASC']],
        });
    } catch (error) {
        console.error('Lỗi lấy ghi chú bài học:', error);
        throw error;
    }
};

// 3. Get notes for a course grouped/ordered by lesson
export const getNotesByCourse = async (userId, courseId) => {
    try {
        return await db.CourseNote.findAll({
            where: { userId, courseId },
            include: [{
                model: db.Lesson,
                as: 'lesson',
                attributes: ['id', 'title', 'type', 'order'],
                include: [{
                    model: db.Section,
                    as: 'section',
                    attributes: ['id', 'title', 'order'],
                }],
            }],
            order: [
                [{ model: db.Lesson, as: 'lesson' }, { model: db.Section, as: 'section' }, 'order', 'ASC'],
                [{ model: db.Lesson, as: 'lesson' }, 'order', 'ASC'],
                ['timestamp', 'ASC'],
            ],
        });
    } catch (error) {
        console.error('Lỗi lấy ghi chú khóa học:', error);
        throw error;
    }
};

// 4. Update a note (owner only)
export const updateNote = async (userId, noteId, content) => {
    try {
        const note = await db.CourseNote.findOne({ where: { id: noteId, userId } });
        if (!note) throw createError(404, 'Không tìm thấy ghi chú.');
        await note.update({ content });
        return note;
    } catch (error) {
        console.error('Lỗi sửa ghi chú:', error);
        throw error;
    }
};

// 5. Delete a note (owner only)
export const deleteNote = async (userId, noteId) => {
    try {
        const note = await db.CourseNote.findOne({ where: { id: noteId, userId } });
        if (!note) throw createError(404, 'Không tìm thấy ghi chú.');
        await note.destroy();
        return { success: true };
    } catch (error) {
        console.error('Lỗi xóa ghi chú:', error);
        throw error;
    }
};
