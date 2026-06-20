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

export const getAdminDashboardStats = async (range = '30') => {
    try {
        let dateFilter = {};
        if (range !== 'all') {
            const days = parseInt(range) || 30;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            dateFilter = { createdAt: { [Op.gte]: startDate } };
        }

        // 1. Total Revenue
        const totalRevenue = await db.Order.sum('totalAmount', {
            where: { status: 'paid', ...dateFilter }
        }) || 0;

        // 2. New Users (within range)
        const newUsers = await db.User.count({
            where: { ...dateFilter }
        });

        // 3. Pending Courses
        const pendingCourses = await db.Course.count({
            where: { status: 'draft' }
        });

        // 4. Pending Payouts
        let pendingPayouts = 0;
        if (db.PayoutRequest) {
            pendingPayouts = await db.PayoutRequest.count({
                where: { status: 'PENDING' }
            });
        }

        // 5. Monthly Revenue Chart (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const orders = await db.Order.findAll({
            where: {
                status: 'paid',
                createdAt: { [Op.gte]: sixMonthsAgo }
            },
            attributes: ['totalAmount', 'createdAt']
        });

        const monthlyRevenue = {};
        orders.forEach(order => {
            const month = order.createdAt.toLocaleString('default', { month: 'short' });
            if (!monthlyRevenue[month]) monthlyRevenue[month] = 0;
            monthlyRevenue[month] += Number(order.totalAmount);
        });
        
        const chartData = Object.keys(monthlyRevenue).map(month => ({
            name: month,
            revenue: monthlyRevenue[month]
        }));

        // 6. Top Courses
        const topCourses = await db.Course.findAll({
            attributes: ['id', 'name', 'price', 'totalStudents', 'thumbnail'],
            order: [['totalStudents', 'DESC']],
            limit: 5
        });

        // 7. Recent Activities (Mocking by combining latest records)
        const latestUsers = await db.User.findAll({ limit: 2, order: [['createdAt', 'DESC']], attributes: ['id', 'firstName', 'lastName', 'createdAt'] });
        const latestCourses = await db.Course.findAll({ limit: 2, order: [['createdAt', 'DESC']], attributes: ['id', 'name', 'createdAt'] });
        
        let activities = [
            ...latestUsers.map(u => ({ id: `u-${u.id}`, title: 'User Onboarded', user: `${u.firstName} ${u.lastName}`, time: u.createdAt, status: 'Completed', type: 'user' })),
            ...latestCourses.map(c => ({ id: `c-${c.id}`, title: 'Course Created', user: 'System', time: c.createdAt, status: 'Completed', type: 'course' }))
        ];

        activities.sort((a, b) => b.time - a.time);
        activities = activities.slice(0, 5);

        return {
            totalRevenue,
            newUsers,
            pendingCourses,
            pendingPayouts,
            chartData,
            topCourses,
            recentActivities: activities
        };
    } catch (error) {
        console.error('Lỗi lấy admin dashboard:', error);
        throw error;
    }
};
