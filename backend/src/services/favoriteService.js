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

const getFavoriteCourses = async (userId, page = 1, limit = 12) => {
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    const { count, rows } = await FavoriteCourse.findAndCountAll({
        where: { userId },
        include: [
            {
                model: Course,
                as: 'course',
                include: includeOptions
            }
        ],
        order: [['createdAt', 'DESC']],
        limit: parsedLimit,
        offset,
    });

    // Extract courses and filter out nulls
    const data = rows.map(fav => fav.course).filter(course => course !== null);
    
    return {
        data,
        pagination: {
            currentPage: parsedPage,
            totalPages: Math.ceil(count / parsedLimit),
            totalItems: count,
        }
    };
};

const checkIsFavorite = async (userId, courseId) => {
    const fav = await FavoriteCourse.findOne({ where: { userId, courseId } });
    return { isFavorite: !!fav };
};

module.exports = {
    toggleFavoriteCourse,
    getFavoriteCourses,
    checkIsFavorite
};
