const db = require('../models/index');
const { Op } = require('sequelize');
const Course = db.Course;
const Category = db.Category;
const CourseImage = db.CourseImage;
const Section = db.Section;
const Lesson = db.Lesson;

const includeOptions = [
    { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
    { model: CourseImage, as: 'images', attributes: ['id', 'imageUrl', 'isPrimary', 'sortOrder'] },
];

const slugify = require('slugify');

// Helper function to sum lesson durations in "HH:MM:SS" or "MM:SS" formats, or numbers
const parseDuration = (durationStr) => {
    if (!durationStr) return 0;
    if (typeof durationStr === 'number') return durationStr;
    const parts = durationStr.split(':').map(Number);
    if (parts.some(isNaN)) return 0;
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
        return parts[0];
    }
    return 0;
};

const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
};

const calculateTotalDuration = (sections) => {
    let totalSeconds = 0;
    if (sections && Array.isArray(sections)) {
        for (const section of sections) {
            if (section.lessons && Array.isArray(section.lessons)) {
                for (const lesson of section.lessons) {
                    totalSeconds += parseDuration(lesson.duration);
                }
            }
        }
    }
    return formatDuration(totalSeconds);
};

// Lấy danh sách khóa học (filter, search, sort, pagination)
const getCourses = async (params) => {
    const { search, categories, levels, min_price, max_price, sort = 'newest', page = 1, limit = 12, status = 'published', instructor } = params;
    const where = {};

    if (status !== 'all') {
        where.status = status;
    }

    if (instructor) {
        where.instructor = instructor;
    }

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
        newest: [['createdAt', 'DESC']],
        price_asc: [['price', 'ASC']],
        price_desc: [['price', 'DESC']],
        rating_desc: [['rating', 'DESC']],
        best_seller: [['totalStudents', 'DESC']],
        popular: [['viewCount', 'DESC']],
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
    const data = await Course.findAll({ where: { isFeatured: true, status: 'published' }, include: includeOptions, limit: 8 });
    return { data };
};

const getNewArrivals = async () => {
    const data = await Course.findAll({ where: { status: 'published' }, include: includeOptions, order: [['createdAt', 'DESC']], limit: 8 });
    return { data };
};

const getBestSellers = async () => {
    const data = await Course.findAll({ where: { isBestSeller: true, status: 'published' }, include: includeOptions, order: [['totalStudents', 'DESC']], limit: 8 });
    return { data };
};

const getCourseBySlug = async (slug) => {
    const course = await Course.findOne({ 
        where: { slug }, 
        include: [
            ...includeOptions,
            {
                model: Section,
                as: 'sections',
                attributes: ['id', 'title', 'order'],
                include: [{
                    model: Lesson,
                    as: 'lessons',
                    // PUBLIC: trả metadata, CHỈ trả videoUrl nếu isFreePreview = true (xử lý ở dưới)
                    attributes: ['id', 'title', 'type', 'duration', 'order', 'isFreePreview', 'videoUrl'],
                }]
            }
        ],
        order: [
            [{ model: Section, as: 'sections' }, 'order', 'ASC'],
            [{ model: Section, as: 'sections' }, { model: Lesson, as: 'lessons' }, 'order', 'ASC']
        ]
    });
    if (!course) return { data: null };
    
    const data = course.toJSON();

    // Sanitize videoUrl cho public view
    if (data.sections) {
        data.sections = data.sections.map(section => {
            if (section.lessons) {
                section.lessons = section.lessons.map(l => {
                    if (!l.isFreePreview) {
                        delete l.videoUrl;
                    }
                    return l;
                });
            }
            return section;
        });
    }

    // Parse các trường dạng JSON string array lưu ở DB
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

    data.buyersCount = await db.UserCourse.count({ where: { courseId: course.id } });
    
    const reviewsResult = await db.Review.findAll({
        attributes: [
            [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalReviews'],
            [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'avgRating']
        ],
        where: { courseId: course.id },
        raw: true
    });

    if (reviewsResult && reviewsResult[0] && parseInt(reviewsResult[0].totalReviews) > 0) {
        data.reviewsCount = parseInt(reviewsResult[0].totalReviews);
        data.averageRating = parseFloat(reviewsResult[0].avgRating);
    } else {
        data.reviewsCount = 0;
        data.averageRating = 0;
    }

    data.totalSections = data.sections ? data.sections.length : 0;
    data.totalDuration = calculateTotalDuration(data.sections);
    
    return { data };
};

const getCourseCurriculum = async (slug) => {
    const course = await Course.findOne({
        where: { slug, status: 'published' },
        attributes: ['id', 'name', 'totalLessons'],
        include: [{
            model: Section,
            as: 'sections',
            attributes: ['id', 'title', 'order'],
            include: [{
                model: Lesson,
                as: 'lessons',
                attributes: ['id', 'title', 'type', 'duration', 'order', 'isFreePreview', 'videoUrl'],
            }]
        }],
        order: [
            [{ model: Section, as: 'sections' }, 'order', 'ASC'],
            [{ model: Section, as: 'sections' }, { model: Lesson, as: 'lessons' }, 'order', 'ASC'],
        ],
    });

    if (!course) return null;

    const sections = course.sections.map(section => {
        const sJson = section.toJSON();
        const totalSecs = sJson.lessons.reduce((sum, l) => sum + parseDuration(l.duration), 0);
        
        sJson.lessons = sJson.lessons.map(l => {
            if (!l.isFreePreview) {
                delete l.videoUrl;
            }
            return l;
        });

        sJson.lessonsCount = sJson.lessons.length;
        sJson.totalDuration = formatDuration(totalSecs);
        return sJson;
    });

    return {
        courseId: course.id,
        courseName: course.name,
        totalSections: sections.length,
        totalLessons: course.totalLessons,
        sections,
    };
};

const getRelatedCourses = async (id) => {
    const course = await Course.findByPk(id);
    if (!course) return { data: [] };
    const data = await Course.findAll({
        where: { categoryId: course.categoryId, id: { [Op.ne]: id }, status: 'published' },
        include: includeOptions, limit: 4,
    });
    return { data };
};

const getCategories = async () => {
    const data = await Category.findAll({ 
        where: { isActive: true },
        order: [['name', 'ASC']] 
    });
    return { data };
};

const createCategory = async (categoryData) => {
    try {
        if (!categoryData.slug && categoryData.name) {
            categoryData.slug = slugify(categoryData.name, { lower: true, strict: true }) + '-' + Date.now();
        }
        const newCategory = await Category.create(categoryData);
        return { data: newCategory };
    } catch (error) {
        throw error;
    }
};

const createCourse = async (courseData) => {
    try {
        if (!courseData.slug && courseData.name) {
            courseData.slug = slugify(courseData.name, { lower: true, strict: true }) + '-' + Date.now();
        }
        courseData.status = 'draft';
        const newCourse = await Course.create(courseData);
        return { data: newCourse };
    } catch (error) {
        throw error;
    }
};

const updateCourse = async (id, courseData, instructorName) => {
    try {
        const course = await Course.findByPk(id);
        if (!course) return { status: 404, message: 'Không tìm thấy khóa học.' };

        // Kiểm tra quyền sở hữu dựa trên string matching
        if (course.instructor !== instructorName) {
            return { status: 403, message: 'Bạn không có quyền chỉnh sửa khóa học này.' };
        }

        if (courseData.name && courseData.name !== course.name && !courseData.slug) {
            courseData.slug = slugify(courseData.name, { lower: true, strict: true }) + '-' + Date.now();
        }

        const dataToUpdate = { ...courseData };
        if (Array.isArray(dataToUpdate.requirements)) {
            dataToUpdate.requirements = JSON.stringify(dataToUpdate.requirements);
        }
        if (Array.isArray(dataToUpdate.whatYouWillLearn)) {
            dataToUpdate.whatYouWillLearn = JSON.stringify(dataToUpdate.whatYouWillLearn);
        }
        if (Array.isArray(dataToUpdate.targetAudience)) {
            dataToUpdate.targetAudience = JSON.stringify(dataToUpdate.targetAudience);
        }

        await course.update(dataToUpdate);
        return { status: 200, message: 'Cập nhật khóa học thành công', data: course };
    } catch (error) {
        throw error;
    }
};

const publishCourse = async (id) => {
    const course = await Course.findByPk(id);
    if (!course) return { status: 404, message: 'Không tìm thấy khóa học.' };
    course.status = 'published';
    await course.save();
    return { status: 200, message: 'Đã xuất bản khóa học!', data: course };
};

const submitReviewCourse = async (id, userId) => {
    const course = await Course.findByPk(id, { include: [{ model: db.User, as: 'instructorData' }] });
    if (!course) return { status: 404, message: 'Không tìm thấy khóa học.' };
    
    course.status = 'pending';
    await course.save();
    
    await db.CourseStatusHistory.create({
        courseId: course.id,
        adminId: null, // System action triggered by user
        oldStatus: 'draft',
        newStatus: 'pending',
        reason: 'Instructor submitted for review'
    });
    
    return { status: 200, message: 'Course submitted for review successfully', data: course };
};

const toggleFeaturedCourse = async (id) => {
    const course = await Course.findByPk(id);
    if (!course) return { status: 404, message: 'Không tìm thấy khóa học.' };
    course.isFeatured = !course.isFeatured;
    await course.save();
    return { status: 200, message: course.isFeatured ? 'Đã thêm vào danh sách Nổi bật' : 'Đã xóa khỏi danh sách Nổi bật', data: course };
};

const toggleBestSellerCourse = async (id) => {
    const course = await Course.findByPk(id);
    if (!course) return { status: 404, message: 'Không tìm thấy khóa học.' };
    course.isBestSeller = !course.isBestSeller;
    await course.save();
    return { status: 200, message: course.isBestSeller ? 'Đã đánh dấu là Bán chạy' : 'Đã bỏ đánh dấu Bán chạy', data: course };
};

// Khóa học theo danh mục (phân trang cho Infinite Scroll)
const getCoursesByCategory = async (categorySlug, page = 1, limit = 6) => {
    const category = await Category.findOne({ where: { slug: categorySlug } });
    if (!category) return { status: 404, message: 'Không tìm thấy danh mục.' };

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await Course.findAndCountAll({
        where: { categoryId: category.id, status: 'published' },
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
        where: { status: 'published' },
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

const checkEnrollmentService = async (userId, slug) => {
    const course = await db.Course.findOne({ where: { slug } });
    if (!course) return { enrolled: false };
    const enrollment = await db.UserCourse.findOne({ where: { userId, courseId: course.id } });
    return { enrolled: !!enrollment, courseId: course.id };
};

const getInstructorInfo = async (name) => {
    try {
        // Find instructor in User table based on name (firstName + lastName)
        // Since names are stored as strings in Course, we might not have a perfect match in Users table
        // But we try to find one. If not found, we fallback to default bio/avatar.
        const users = await db.User.findAll({
            where: {
                [Op.or]: [
                    db.sequelize.where(
                        db.sequelize.fn('concat', db.sequelize.col('firstName'), ' ', db.sequelize.col('lastName')),
                        { [Op.like]: `%${name}%` }
                    ),
                    { firstName: { [Op.like]: `%${name}%` } },
                    { lastName: { [Op.like]: `%${name}%` } }
                ]
            }
        });

        const user = users.length > 0 ? users[0] : null;

        // Find all courses taught by this instructor
        const courses = await Course.findAll({
            where: { instructor: name, status: 'published' }
        });

        const coursesCount = courses.length;
        let totalStudents = 0;
        let reviewsCount = 0;
        let averageRating = 0;

        if (coursesCount > 0) {
            totalStudents = courses.reduce((acc, curr) => acc + (curr.totalStudents || 0), 0);
            
            const courseIds = courses.map(c => c.id);
            const reviewsResult = await db.Review.findAll({
                attributes: [
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalReviews'],
                    [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'avgRating']
                ],
                where: { courseId: { [Op.in]: courseIds } },
                raw: true
            });

            if (reviewsResult && reviewsResult[0]) {
                reviewsCount = parseInt(reviewsResult[0].totalReviews) || 0;
                averageRating = parseFloat(reviewsResult[0].avgRating) || 0;
            } else {
                // fallback if Review table query fails or is empty, use Course table cached ratings
                reviewsCount = courses.reduce((acc, curr) => acc + (curr.ratingCount || 0), 0);
                averageRating = courses.reduce((acc, curr) => acc + parseFloat(curr.rating || 0), 0) / coursesCount;
            }
        }

        return {
            status: 200,
            data: {
                name: name,
                bio: user?.bio || "Bundling the courses and know how of successful instructors, we strive to deliver high quality online education. Real-Life Success - that's what we stand for. Learn topics like web development, data analyses and more in a fun and engaging way.",
                image: user?.image || "https://i.pravatar.cc/150?img=11",
                instructorRating: averageRating.toFixed(1),
                reviewsCount: reviewsCount,
                studentsCount: totalStudents,
                coursesCount: coursesCount
            }
        };
    } catch (error) {
        throw error;
    }
};

module.exports = { getCourses, getFeaturedCourses, getNewArrivals, getBestSellers, getCourseBySlug, getCourseCurriculum, getRelatedCourses, getCategories, createCategory, createCourse, updateCourse, publishCourse, toggleFeaturedCourse, toggleBestSellerCourse, getCoursesByCategory, getTopViewedCourses, incrementViewCount, checkEnrollmentService, getInstructorInfo, submitReviewCourse };