import * as noteService from '../services/noteService';
import { asyncHandler } from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';

export const handleCreateNote = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { courseId, lessonId, content, timestamp } = req.body;
    
    if (!courseId || !lessonId || !content) {
        return res.status(400).json({ status: 400, message: 'Vui lòng điền đầy đủ courseId, lessonId, và content.' });
    }

    const data = await noteService.createNote(userId, courseId, lessonId, content, timestamp);
    return res.status(201).json(new ApiResponse(201, data, 'Tạo ghi chú thành công.'));
});

export const handleGetNotesForLesson = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { lessonId } = req.params;
    
    if (!lessonId) {
        return res.status(400).json({ status: 400, message: 'Thiếu lessonId.' });
    }

    const data = await noteService.getNotesForLesson(userId, lessonId);
    return res.status(200).json(new ApiResponse(200, data));
});

export const handleGetNotesByCourse = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { courseId } = req.params;

    if (!courseId) {
        return res.status(400).json({ status: 400, message: 'Thiếu courseId.' });
    }

    const data = await noteService.getNotesByCourse(userId, courseId);
    return res.status(200).json(new ApiResponse(200, data));
});

export const handleUpdateNote = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { content } = req.body;

    if (!id || !content) {
        return res.status(400).json({ status: 400, message: 'Vui lòng cung cấp nội dung ghi chú.' });
    }

    const data = await noteService.updateNote(userId, id, content);
    return res.status(200).json(new ApiResponse(200, data, 'Cập nhật ghi chú thành công.'));
});

export const handleDeleteNote = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ status: 400, message: 'Thiếu note id.' });
    }

    const data = await noteService.deleteNote(userId, id);
    return res.status(200).json(new ApiResponse(200, data, 'Xóa ghi chú thành công.'));
});
