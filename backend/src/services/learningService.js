import db from '../models/index';
import { Op } from 'sequelize';
import { createError, generateRandomCode, parseDuration } from '../utils/helpers';
import { createNotification } from './notificationService';

// 1. Get my enrolled courses (with pagination & sorting)
export const getMyEnrolledCourses = async (userId, params = {}) => {
    try {
        const { status = 'all', sort = 'recent', page = 1, limit = 12 } = params;
        
        const where = { userId };
        
        // Filter by status
        if (status === 'in-progress') {
            where.status = 'active';
            where.progressPercent = { [Op.gt]: 0, [Op.lt]: 100 };
        } else if (status === 'completed') {
            where.status = 'completed';
        } else if (status === 'not-started') {
            where.status = 'active';
            where.progressPercent = 0;
        }
        // 'all' -> no extra filter

        // Sort options
        const orderMap = {
            recent: [['lastAccessedAt', 'DESC']],
            enrolled: [['enrolledAt', 'DESC']],
            'a-z': [[{ model: db.Course, as: 'course' }, 'name', 'ASC']],
            progress: [['progressPercent', 'DESC']],
        };
        const order = orderMap[sort] || orderMap.recent;

        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const offset = (parsedPage - 1) * parsedLimit;

        const { count, rows } = await db.UserCourse.findAndCountAll({
            where,
            include: [{
                model: db.Course,
                as: 'course',
                attributes: ['id', 'name', 'slug', 'thumbnail', 'instructor', 'totalLessons', 'duration', 'level'],
                include: [{
                    model: db.Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug'],
                }],
            }],
            order,
            limit: parsedLimit,
            offset,
            distinct: true,
        });

        return {
            data: rows.map(uc => ({
                enrollmentId: uc.id,
                courseId: uc.courseId,
                course: uc.course,
                progressPercent: uc.progressPercent,
                status: uc.status,
                enrolledAt: uc.enrolledAt,
                completedAt: uc.completedAt,
                lastAccessedAt: uc.lastAccessedAt,
            })),
            pagination: {
                currentPage: parsedPage,
                totalPages: Math.ceil(count / parsedLimit),
                totalItems: count,
            },
        };
    } catch (error) {
        console.error('Lỗi lấy danh sách khóa học đăng ký:', error);
        throw error;
    }
};

// 2. Get full course content with lesson progresses
export const getCourseContent = async (userId, slug) => {
    try {
        // Find course
        const course = await db.Course.findOne({
            where: { slug },
            attributes: ['id', 'name', 'slug', 'thumbnail', 'instructor', 'totalLessons', 'duration'],
        });
        if (!course) throw createError(404, 'Không tìm thấy khóa học.');

        // Verify enrollment
        const enrollment = await db.UserCourse.findOne({
            where: { userId, courseId: course.id },
        });
        if (!enrollment) throw createError(403, 'Bạn chưa đăng ký khóa học này.');

        // Update last accessed time
        await enrollment.update({ lastAccessedAt: new Date() });

        // Retrieve sections & lessons without SQL ORDER BY to avoid "Out of sort memory"
        const sections = await db.Section.findAll({
            where: { courseId: course.id },
            include: [{
                model: db.Lesson,
                as: 'lessons',
                attributes: ['id', 'title', 'type', 'content', 'videoUrl', 'duration', 'order', 'isFreePreview'],
            }]
        });

        // Sort in JavaScript memory
        sections.sort((a, b) => a.order - b.order);
        sections.forEach(section => {
            if (section.lessons) {
                section.lessons.sort((a, b) => a.order - b.order);
            }
        });

        // Retrieve lesson progress map
        const lessonProgresses = await db.LessonProgress.findAll({
            where: { userId, courseId: course.id },
            attributes: ['lessonId', 'isCompleted', 'completedAt', 'lastWatchedPosition'],
        });
        
        const progressMap = {};
        lessonProgresses.forEach(lp => {
            progressMap[lp.lessonId] = {
                isCompleted: lp.isCompleted,
                completedAt: lp.completedAt,
                lastWatchedPosition: lp.lastWatchedPosition,
            };
        });

        // Calculate and merge progress details
        let totalLessons = 0;
        let completedLessons = 0;

        const sectionsWithProgress = sections.map(section => {
            const secJson = section.toJSON();
            secJson.lessons = section.lessons.map(lesson => {
                totalLessons++;
                const progress = progressMap[lesson.id] || { 
                    isCompleted: false, completedAt: null, lastWatchedPosition: 0 
                };
                if (progress.isCompleted) completedLessons++;
                return {
                    ...lesson.toJSON(),
                    ...progress,
                };
            });
            return secJson;
        });

        return {
            course: course.toJSON(),
            sections: sectionsWithProgress,
            overallProgress: enrollment.progressPercent,
            totalLessons,
            completedLessons,
            enrolledAt: enrollment.enrolledAt,
        };
    } catch (error) {
        console.error('Lỗi lấy nội dung khóa học:', error);
        throw error;
    }
};

// 3. Mark lesson as completed
export const markLessonComplete = async (userId, lessonId) => {
    const transaction = await db.sequelize.transaction();
    try {
        const lesson = await db.Lesson.findByPk(lessonId, {
            include: [{ model: db.Section, as: 'section', attributes: ['courseId'] }],
        });
        if (!lesson) throw createError(404, 'Không tìm thấy bài học.');

        const courseId = lesson.section.courseId;

        const enrollment = await db.UserCourse.findOne({
            where: { userId, courseId },
            transaction,
        });
        if (!enrollment) throw createError(403, 'Bạn chưa đăng ký khóa học này.');

        const [progress, created] = await db.LessonProgress.findOrCreate({
            where: { userId, lessonId },
            defaults: { userId, lessonId, courseId, isCompleted: true, completedAt: new Date() },
            transaction,
        });
        if (!created && !progress.isCompleted) {
            await progress.update({ isCompleted: true, completedAt: new Date() }, { transaction });
        }

        // Calculate updated course progress percentage
        const totalLessons = await db.Lesson.count({
            include: [{ model: db.Section, as: 'section', where: { courseId }, attributes: [] }],
            transaction,
        });
        const completedLessons = await db.LessonProgress.count({
            where: { userId, courseId, isCompleted: true },
            transaction,
        });
        const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        const updateData = { progressPercent, lastAccessedAt: new Date() };
        let isCourseDone = false;
        let certificate = null;

        if (progressPercent >= 100) {
            updateData.status = 'completed';
            updateData.completedAt = new Date();
            isCourseDone = true;
        }
        await enrollment.update(updateData, { transaction });

        // Auto issue certificate if 100% completed
        if (isCourseDone) {
            const existingCert = await db.Certificate.findOne({
                where: { userId, courseId },
                transaction,
            });
            if (!existingCert) {
                const certificateCode = `CERT-${new Date().getFullYear()}-${generateRandomCode(6)}`;
                certificate = await db.Certificate.create({
                    userId, courseId, certificateCode, issuedAt: new Date(),
                }, { transaction });

                // Create a notification for the certificate
                const course = await db.Course.findByPk(courseId, { attributes: ['name'], transaction });
                await createNotification(
                    userId,
                    'certificate_issued',
                    '🎓 Chúc mừng! Bạn đã nhận chứng chỉ!',
                    `Bạn đã hoàn thành khóa học "${course?.name}" và nhận được chứng chỉ ${certificateCode}.`,
                    { courseId, certificateCode }
                );
            }
        }

        await transaction.commit();

        return {
            lessonId: parseInt(lessonId),
            courseId,
            courseProgress: progressPercent,
            completedLessons,
            totalLessons,
            isCourseDone,
            certificate: certificate ? {
                id: certificate.id,
                code: certificate.certificateCode,
                issuedAt: certificate.issuedAt,
            } : null,
        };
    } catch (error) {
        await transaction.rollback();
        console.error('Lỗi hoàn thành bài học:', error);
        throw error;
    }
};

// 4. Update last watch position
export const updateWatchPosition = async (userId, lessonId, position) => {
    try {
        const lesson = await db.Lesson.findByPk(lessonId, {
            include: [{ model: db.Section, as: 'section', attributes: ['courseId'] }],
        });
        if (!lesson) throw createError(404, 'Không tìm thấy bài học.');

        const [progress] = await db.LessonProgress.findOrCreate({
            where: { userId, lessonId },
            defaults: { userId, lessonId, courseId: lesson.section.courseId, lastWatchedPosition: position },
        });
        if (progress) {
            await progress.update({ lastWatchedPosition: position });
        }

        // Update last accessed time of UserCourse
        await db.UserCourse.update(
            { lastAccessedAt: new Date() },
            { where: { userId, courseId: lesson.section.courseId } }
        );

        return { success: true, position };
    } catch (error) {
        console.error('Lỗi cập nhật vị trí video:', error);
        throw error;
    }
};

// 5. Get next lesson in order
export const getNextLesson = async (userId, courseId, currentLessonId) => {
    try {
        const allLessons = await db.Lesson.findAll({
            include: [{ 
                model: db.Section, as: 'section', 
                where: { courseId }, 
                attributes: ['id', 'title', 'order'] 
            }],
            order: [
                [{ model: db.Section, as: 'section' }, 'order', 'ASC'],
                ['order', 'ASC'],
            ],
            attributes: ['id', 'title', 'type', 'duration', 'order'],
        });

        const currentIndex = allLessons.findIndex(l => l.id === parseInt(currentLessonId));
        
        if (currentIndex === -1 || currentIndex >= allLessons.length - 1) {
            return { nextLesson: null, isLastLesson: true };
        }

        const next = allLessons[currentIndex + 1];
        return {
            nextLesson: {
                id: next.id,
                title: next.title,
                type: next.type,
                duration: next.duration,
                sectionTitle: next.section.title,
            },
            isLastLesson: false,
        };
    } catch (error) {
        console.error('Lỗi lấy bài tiếp theo:', error);
        throw error;
    }
};
