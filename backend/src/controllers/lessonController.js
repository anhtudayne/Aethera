import db from '../models';

export const handleCreateLesson = async (req, res, next) => {
    try {
        const { sectionId, title, type, content, videoUrl, duration, order, isFreePreview } = req.body;
        if (!sectionId || !title) {
            return res.status(400).json({ status: 400, message: 'Thiếu thông tin sectionId hoặc title' });
        }
        
        const lesson = await db.Lesson.create({ 
            sectionId, 
            title, 
            type: type || 'video', 
            content, 
            videoUrl, 
            duration, 
            order: order || 0,
            isFreePreview: isFreePreview || false
        });
        return res.status(201).json({ status: 201, message: 'Tạo bài học thành công', data: lesson });
    } catch (error) {
        next(error);
    }
};

export const handleGetLessons = async (req, res, next) => {
    try {
        const { sectionId } = req.query;
        let where = {};
        if (sectionId) where.sectionId = sectionId;

        const lessons = await db.Lesson.findAll({
            where,
            order: [['order', 'ASC']]
        });
        
        return res.status(200).json({ status: 200, data: lessons });
    } catch (error) {
        next(error);
    }
};

export const handleUpdateLesson = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, type, content, videoUrl, duration, order, isFreePreview } = req.body;
        const lesson = await db.Lesson.findByPk(id);
        
        if (!lesson) {
            return res.status(404).json({ status: 404, message: 'Không tìm thấy bài học' });
        }
        
        await lesson.update({ 
            title, 
            type, 
            content, 
            videoUrl, 
            duration, 
            order,
            isFreePreview
        });
        return res.status(200).json({ status: 200, message: 'Cập nhật bài học thành công', data: lesson });
    } catch (error) {
        next(error);
    }
};

export const handleDeleteLesson = async (req, res, next) => {
    try {
        const { id } = req.params;
        const lesson = await db.Lesson.findByPk(id);
        
        if (!lesson) {
            return res.status(404).json({ status: 404, message: 'Không tìm thấy bài học' });
        }
        
        await lesson.destroy();
        return res.status(200).json({ status: 200, message: 'Xóa bài học thành công' });
    } catch (error) {
        next(error);
    }
};
