const db = require('../models/index');
const ViewedCourse = db.ViewedCourse;
const Course = db.Course;
const Category = db.Category;
const CourseImage = db.CourseImage;

const includeOptions = [
    { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
    { model: CourseImage, as: 'images', attributes: ['id', 'imageUrl', 'isPrimary', 'sortOrder'] },
];

const addViewedCourse = async (userId, courseId) => {
    const [viewed, created] = await ViewedCourse.findOrCreate({
        where: { userId, courseId },
        defaults: { userId, courseId }
    });

    if (!created) {
        // Update the updatedAt timestamp to push it to the top of recently viewed
        viewed.changed('updatedAt', true);
        await viewed.save();
    }

    return { success: true };
};

const getViewedCourses = async (userId) => {
    const viewedRecords = await ViewedCourse.findAll({
        where: { userId },
        include: [
            {
                model: Course,
                as: 'course',
                include: includeOptions
            }
        ],
        order: [['updatedAt', 'DESC']],
        limit: 8
    });

    // Extract courses and filter out nulls
    const data = viewedRecords.map(vr => vr.course).filter(course => course !== null);
    return { data };
};

module.exports = {
    addViewedCourse,
    getViewedCourses
};
