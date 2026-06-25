import db from '../models';

export const handleCreateSection = async (req, res, next) => {
    try {
        const { courseId, title, order } = req.body;
        if (!courseId || !title) {
            return res.status(400).json({ status: 400, message: 'Thiếu thông tin courseId hoặc title' });
        }
        
        const section = await db.Section.create({ courseId, title, order: order || 0 });
        return res.status(201).json({ status: 201, message: 'Tạo chương thành công', data: section });
    } catch (error) {
        next(error);
    }
};

export const handleGetSections = async (req, res, next) => {
    try {
        const { courseId } = req.query;
        let where = {};
        if (courseId) where.courseId = courseId;

        const sections = await db.Section.findAll({
            where,
            include: [{
                model: db.Lesson,
                as: 'lessons',
            }]
        });
        
        // Sort in JavaScript memory to avoid MySQL Out of sort memory
        sections.sort((a, b) => a.order - b.order);
        sections.forEach(section => {
            if (section.lessons) {
                section.lessons.sort((a, b) => a.order - b.order);
            }
        });
        
        return res.status(200).json({ status: 200, data: sections });
    } catch (error) {
        next(error);
    }
};

export const handleUpdateSection = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, order } = req.body;
        const section = await db.Section.findByPk(id);
        
        if (!section) {
            return res.status(404).json({ status: 404, message: 'Không tìm thấy chương' });
        }
        
        await section.update({ title, order });
        return res.status(200).json({ status: 200, message: 'Cập nhật chương thành công', data: section });
    } catch (error) {
        next(error);
    }
};

export const handleDeleteSection = async (req, res, next) => {
    try {
        const { id } = req.params;
        const section = await db.Section.findByPk(id);
        
        if (!section) {
            return res.status(404).json({ status: 404, message: 'Không tìm thấy chương' });
        }
        
        // Also delete associated lessons
        await db.Lesson.destroy({ where: { sectionId: id } });
        await section.destroy();
        return res.status(200).json({ status: 200, message: 'Xóa chương thành công' });
    } catch (error) {
        next(error);
    }
};
