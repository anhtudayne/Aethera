const db = require('../models/index');
const { Op } = require('sequelize');
const Course = db.Course;
const Category = db.Category;
const CourseImage = db.CourseImage;

const includeOptions = [
    { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
    { model: CourseImage, as: 'images', attributes: ['id', 'imageUrl', 'isPrimary', 'sortOrder'] },
];

const slugify = require('slugify');

// Lấy danh sách khóa học (filter, search, sort, pagination)
const getCourses = async (params) => {
    const { search, categories, levels, min_price, max_price, sort = 'newest', page = 1, limit = 12 } = params;
    const where = {};

    if (search) where.name = { [Op.like]: `%${search}%` };
    
    if (categories) {
        const catArray = typeof categories === 'string' ? categories.split(',') : categories;
        where.categoryId = { [Op.in]: catArray };
    }
    
    if (levels) {
        const levelArray = typeof levels === 'string' ? levels.split(',') : levels;
        where.level = { [Op.in]: levelArray };
    }
    
    if (min_price || max_price) {
        where.price = {};
        if (min_price) where.price[Op.gte] = Number(min_price);
        if (max_price) where.price[Op.lte] = Number(max_price);
    }

    const order = {
        newest: [['isNewArrival', 'DESC'], ['createdAt', 'DESC']],
        price_asc: [['price', 'ASC']],
        price_desc: [['price', 'DESC']],
        rating_desc: [['rating', 'DESC']],
        best_seller: [['isBestSeller', 'DESC'], ['totalStudents', 'DESC']],
    }[sort] || [['createdAt', 'DESC']];

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const offset = (parsedPage - 1) * parsedLimit;
    
    const { count, rows } = await Course.findAndCountAll({
        where, include: includeOptions, order, limit: parsedLimit, offset, distinct: true,
    });
    
    return { 
        data: rows, 
        pagination: { 
            currentPage: parsedPage, 
            totalPages: Math.ceil(count / parsedLimit),
            totalItems: count
        } 
    };
};

const getFeaturedCourses = async () => {
    const data = await Course.findAll({ where: { isFeatured: true }, include: includeOptions, limit: 8 });
    return { data };
};

const getNewArrivals = async () => {
    const data = await Course.findAll({ include: includeOptions, order: [['createdAt', 'DESC']], limit: 8 });
    return { data };
};

const getBestSellers = async () => {
    const data = await Course.findAll({ where: { isBestSeller: true }, include: includeOptions, order: [['totalStudents', 'DESC']], limit: 8 });
    return { data };
};

const getCourseBySlug = async (slug) => {
    const course = await Course.findOne({ where: { slug }, include: includeOptions });
    if (!course) return { data: null };
    
    const data = course.toJSON();
    data.buyersCount = await db.UserCourse.count({ where: { courseId: course.id } });
    data.reviewsCount = await db.Review.count({ where: { courseId: course.id } });
    
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

const createCourse = async (courseData) => {
    try {
        if (!courseData.slug && courseData.name) {
            courseData.slug = slugify(courseData.name, { lower: true, strict: true }) + '-' + Date.now();
        }
        const newCourse = await Course.create(courseData);
        return { data: newCourse };
    } catch (error) {
        throw error;
    }
};

// Khóa học theo danh mục (phân trang cho Infinite Scroll)
const getCoursesByCategory = async (categorySlug, page = 1, limit = 6) => {
    const category = await Category.findOne({ where: { slug: categorySlug } });
    if (!category) return { status: 404, message: 'Không tìm thấy danh mục.' };

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await Course.findAndCountAll({
        where: { categoryId: category.id },
        include: includeOptions,
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset,
        distinct: true,
    });

    return {
        status: 200,
        category: { id: category.id, name: category.name, slug: category.slug },
        data: rows,
        pagination: { total: count, page: Number(page), limit: Number(limit), totalPages: Math.ceil(count / Number(limit)) },
    };
};

const getTopViewedCourses = async () => {
    const data = await Course.findAll({
        order: [['viewCount', 'DESC']],
        limit: 10,
        include: includeOptions
    });
    return { status: 200, data };
};

const incrementViewCount = async (id) => {
    // Atomic increment
    await Course.increment('viewCount', { by: 1, where: { id } });
    return { status: 200, message: 'View count updated successfully' };
};

module.exports = { getCourses, getFeaturedCourses, getNewArrivals, getBestSellers, getCourseBySlug, getRelatedCourses, getCategories, createCourse, getCoursesByCategory, getTopViewedCourses, incrementViewCount };
