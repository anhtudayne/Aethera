const db = require('../models/index');
const { Op } = require('sequelize');
const Course = db.Course;
const Category = db.Category;
const CourseImage = db.CourseImage;

const includeOptions = [
    { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
    { model: CourseImage, as: 'images', attributes: ['id', 'imageUrl', 'isPrimary', 'sortOrder'] },
];

// Lấy danh sách khóa học (filter, search, sort, pagination)
const getCourses = async (params) => {
    const { search, category, level, minPrice, maxPrice, sort = 'newest', page = 1, limit = 12 } = params;
    const where = {};

    if (search) where.name = { [Op.like]: `%${search}%` };
    if (category) {
        const cat = await Category.findOne({ where: { slug: category } });
        if (cat) where.categoryId = cat.id;
    }
    if (level) where.level = level;
    if (minPrice) where.price = { ...where.price, [Op.gte]: minPrice };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };

    const order = {
        newest: [['createdAt', 'DESC']],
        price_asc: [['price', 'ASC']],
        price_desc: [['price', 'DESC']],
        best_seller: [['totalStudents', 'DESC']],
        rating: [['rating', 'DESC']],
    }[sort] || [['createdAt', 'DESC']];

    const offset = (page - 1) * limit;
    const { count, rows } = await Course.findAndCountAll({
        where, include: includeOptions, order, limit: parseInt(limit), offset, distinct: true,
    });
    return { data: rows, pagination: { page: parseInt(page), limit: parseInt(limit), total: count, totalPages: Math.ceil(count / limit) } };
};

const getFeaturedCourses = async () => {
    const data = await Course.findAll({ where: { isFeatured: true }, include: includeOptions, limit: 8 });
    return { data };
};

const getNewArrivals = async () => {
    const data = await Course.findAll({ where: { isNewArrival: true }, include: includeOptions, order: [['createdAt', 'DESC']], limit: 8 });
    return { data };
};

const getBestSellers = async () => {
    const data = await Course.findAll({ where: { isBestSeller: true }, include: includeOptions, order: [['totalStudents', 'DESC']], limit: 8 });
    return { data };
};

const getCourseBySlug = async (slug) => {
    const data = await Course.findOne({ where: { slug }, include: includeOptions });
    return { data };
};

const getRelatedCourses = async (id) => {
    const course = await Course.findByPk(id);
    if (!course) return { data: [] };
    const data = await Course.findAll({
        where: { categoryId: course.categoryId, id: { [Op.ne]: id } },
        include: includeOptions, limit: 4,
    });
    return { data };
};

const getCategories = async () => {
    const data = await Category.findAll({ order: [['name', 'ASC']] });
    return { data };
};

module.exports = { getCourses, getFeaturedCourses, getNewArrivals, getBestSellers, getCourseBySlug, getRelatedCourses, getCategories };
