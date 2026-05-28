const db = require('../models/index');
const FavoriteCourse = db.FavoriteCourse;
const Course = db.Course;
const Category = db.Category;
const CourseImage = db.CourseImage;

const includeOptions = [
    { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
    { model: CourseImage, as: 'images', attributes: ['id', 'imageUrl', 'isPrimary', 'sortOrder'] },
];

const toggleFavoriteCourse = async (userId, courseId) => {
    const existing = await FavoriteCourse.findOne({
        where: { userId, courseId }
    });

    if (existing) {
        await existing.destroy();
        return { isFavorite: false, message: 'Đã xóa khỏi danh sách yêu thích.' };
    } else {
        await FavoriteCourse.create({ userId, courseId });
        return { isFavorite: true, message: 'Đã thêm vào danh sách yêu thích.' };
    }
};

const getFavoriteCourses = async (userId) => {
    const favorites = await FavoriteCourse.findAll({
        where: { userId },
        include: [
            {
                model: Course,
                as: 'course',
                include: includeOptions
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    // Extract courses and filter out nulls
    const data = favorites.map(fav => fav.course).filter(course => course !== null);
    return { data };
};

module.exports = {
    toggleFavoriteCourse,
    getFavoriteCourses
};
