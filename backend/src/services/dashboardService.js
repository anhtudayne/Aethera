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

        // 5. Revenue Chart (Daily or Monthly depending on range)
        let chartOrders = [];
        const chartDataMap = {};
        const isDaily = range !== 'all';

        if (isDaily) {
            const days = parseInt(range) || 30;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            
            // Pre-fill all days with 0
            for (let i = 0; i < days; i++) {
                const d = new Date(startDate);
                d.setDate(d.getDate() + i + 1);
                const dayLabel = `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                chartDataMap[dayLabel] = 0;
            }

            chartOrders = await db.Order.findAll({
                where: {
                    status: 'paid',
                    createdAt: { [Op.gte]: startDate }
                },
                attributes: ['totalAmount', 'createdAt']
            });

            chartOrders.forEach(order => {
                const dayLabel = `${order.createdAt.getDate()} ${order.createdAt.toLocaleString('default', { month: 'short' })}`;
                if (chartDataMap[dayLabel] !== undefined) {
                    chartDataMap[dayLabel] += Number(order.totalAmount);
                } else {
                    chartDataMap[dayLabel] = Number(order.totalAmount);
                }
            });
        } else {
            // Group by month for the last 12 months
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
            twelveMonthsAgo.setDate(1);

            // Pre-fill months
            for (let i = 0; i < 12; i++) {
                const d = new Date(twelveMonthsAgo);
                d.setMonth(d.getMonth() + i);
                const monthLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
                chartDataMap[monthLabel] = 0;
            }

            chartOrders = await db.Order.findAll({
                where: {
                    status: 'paid',
                    createdAt: { [Op.gte]: twelveMonthsAgo }
                },
                attributes: ['totalAmount', 'createdAt']
            });

            chartOrders.forEach(order => {
                const monthLabel = order.createdAt.toLocaleString('default', { month: 'short', year: 'numeric' });
                if (chartDataMap[monthLabel] !== undefined) {
                    chartDataMap[monthLabel] += Number(order.totalAmount);
                } else {
                    chartDataMap[monthLabel] = Number(order.totalAmount);
                }
            });
        }
        
        const chartData = Object.keys(chartDataMap).map(key => ({
            name: key,
            revenue: chartDataMap[key]
        }));

        const topCourses = await db.Course.findAll({
            attributes: ['id', 'name', 'slug', 'price', 'salePrice', 'totalStudents', 'thumbnail'],
            order: [['totalStudents', 'DESC']],
            limit: 5
        });

        return {
            totalRevenue,
            newUsers,
            pendingCourses,
            pendingPayouts,
            chartData,
            topCourses
        };
    } catch (error) {
        console.error('Lỗi lấy admin dashboard:', error);
        throw error;
    }
};
