import db from '../models/index';

export const getCoursePreview = async (courseId) => {
    const course = await db.Course.findByPk(courseId, {
        include: [
            {
                model: db.Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            },
            {
                model: db.User,
                as: 'instructorData',
                attributes: ['id', 'firstName', 'lastName', 'email', 'image', 'bio']
            },
            {
                model: db.Section,
                as: 'sections',
                attributes: ['id', 'title', 'order'],
                include: [{
                    model: db.Lesson,
                    as: 'lessons',
                    attributes: ['id', 'title', 'type', 'duration', 'order', 'isFreePreview', 'videoUrl', 'content'],
                }]
            }
        ],
        order: [
            [{ model: db.Section, as: 'sections' }, 'order', 'ASC'],
            [{ model: db.Section, as: 'sections' }, { model: db.Lesson, as: 'lessons' }, 'order', 'ASC']
        ]
    });

    if (!course) {
        return { status: 404, message: 'Course not found' };
    }

    const data = course.toJSON();

    try {
        data.requirements = data.requirements ? JSON.parse(data.requirements) : [];
    } catch (e) {
        data.requirements = typeof data.requirements === 'string' ? [data.requirements] : [];
    }
    try {
        data.whatYouWillLearn = data.whatYouWillLearn ? JSON.parse(data.whatYouWillLearn) : [];
    } catch (e) {
        data.whatYouWillLearn = typeof data.whatYouWillLearn === 'string' ? [data.whatYouWillLearn] : [];
    }
    try {
        data.targetAudience = data.targetAudience ? JSON.parse(data.targetAudience) : [];
    } catch (e) {
        data.targetAudience = typeof data.targetAudience === 'string' ? [data.targetAudience] : [];
    }

    return {
        status: 200,
        data: data
    };
};
