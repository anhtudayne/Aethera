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
            }],
            order: [
                ['order', 'ASC'],
                [{ model: db.Lesson, as: 'lessons' }, 'order', 'ASC']
            ]
        });
        
        return res.status(200).json({ status: 200, data: sections });
    } catch (error) {
        next(error);
    }
};
