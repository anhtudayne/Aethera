import db from '../models/index';
import { Op } from 'sequelize';

export const getUserDashboard = async (userId) => {
    try {
        // 1. Thống kê enrollment
        const totalEnrolled = await db.UserCourse.count({ where: { userId } });
        const completedCourses = await db.UserCourse.count({
            where: { userId, status: 'completed' },
        });
        const inProgressCourses = await db.UserCourse.count({
            where: {
                userId,
                status: 'active',
                progressPercent: { [Op.gt]: 0 },
            },
        });

        // 2. Certificates
        const totalCertificates = await db.Certificate.count({ where: { userId } });

        // 3. Reviews
        const totalReviews = await db.Review.count({ where: { userId } });

        // 4. Courses đang học (gần nhất, top 4)
        const coursesInProgress = await db.UserCourse.findAll({
            where: { userId, status: 'active' },
            include: [
                {
                    model: db.Course,
                    as: 'course',
                    attributes: ['id', 'name', 'slug', 'thumbnail', 'instructor', 'totalLessons'],
                },
            ],
            order: [['lastAccessedAt', 'DESC']],
            limit: 4,
        });

        // 5. Certificates gần nhất (top 3)
        const recentCertificates = await db.Certificate.findAll({
            where: { userId },
            include: [
                {
                    model: db.Course,
                    as: 'course',
                    attributes: ['id', 'name', 'slug', 'thumbnail'],
                },
            ],
            order: [['issuedAt', 'DESC']],
            limit: 3,
        });

        return {
            stats: {
                totalEnrolled,
                completedCourses,
                inProgressCourses,
                totalCertificates,
                totalReviews,
            },
            coursesInProgress: coursesInProgress.map((uc) => ({
                courseId: uc.courseId,
                course: uc.course,
                progressPercent: uc.progressPercent,
                lastAccessedAt: uc.lastAccessedAt,
            })),
            recentCertificates,
        };
    } catch (error) {
        console.error('Lỗi lấy dashboard:', error);
        throw error;
    }
};
