import db from '../models';
const { Order, OrderItem, User, Course } = db;
import { Op } from 'sequelize';

export const getDashboardStatsService = async (startDate, endDate) => {
    try {
        const dateFilter = {};
        if (startDate && endDate) {
            // Include full end day
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            dateFilter.createdAt = {
                [Op.between]: [new Date(startDate), end]
            };
        } else {
            // Default 30 days
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 29);
            start.setHours(0, 0, 0, 0);
            dateFilter.createdAt = {
                [Op.between]: [start, end]
            };
        }

        const orders = await Order.findAll({
            where: dateFilter,
            attributes: ['id', 'status', 'totalAmount', 'createdAt']
        });

        let totalRevenue = 0;
        let totalOrdersCount = orders.length;
        let revenueByStatus = { paid: 0, pending: 0, cancelled: 0 };
        const revenueChartMap = {};

        orders.forEach(order => {
            const amount = Number(order.totalAmount || 0);
            const status = order.status || 'pending';
            
            if (revenueByStatus[status] !== undefined) {
                revenueByStatus[status] += amount;
            } else {
                revenueByStatus[status] = amount;
            }
            
            if (status === 'paid') {
                totalRevenue += amount;
                
                const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
                if (!revenueChartMap[dateStr]) {
                    revenueChartMap[dateStr] = 0;
                }
                revenueChartMap[dateStr] += amount;
            }
        });

        const revenueChart = Object.keys(revenueChartMap).map(date => ({
            date,
            revenue: revenueChartMap[date]
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        const totalCustomers = await User.count({
            where: {
                roleId: 'user',
                ...dateFilter
            }
        });

        // Top 10 courses
        const topCoursesData = await OrderItem.findAll({
            attributes: [
                'courseId',
                [db.sequelize.fn('COUNT', db.sequelize.col('OrderItem.id')), 'salesCount'],
                [db.sequelize.fn('SUM', db.sequelize.col('OrderItem.price')), 'totalCourseRevenue']
            ],
            include: [
                {
                    model: Order,
                    as: 'order',
                    where: { status: 'paid', ...dateFilter },
                    attributes: []
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['id', 'name', 'thumbnail', 'price']
                }
            ],
            group: ['courseId', 'course.id', 'course.name', 'course.thumbnail', 'course.price'],
            order: [[db.sequelize.fn('COUNT', db.sequelize.col('OrderItem.id')), 'DESC']],
            limit: 10,
        });

        const formattedTopCourses = topCoursesData.map(item => ({
            courseId: item.courseId,
            salesCount: parseInt(item.getDataValue('salesCount'), 10),
            totalCourseRevenue: parseFloat(item.getDataValue('totalCourseRevenue')),
            course: item.course
        }));

        const recentOrders = await Order.findAll({
            where: dateFilter,
            include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'image'] }],
            order: [['createdAt', 'DESC']],
            limit: 20
        });

        return {
            status: 200,
            data: {
                totalRevenue,
                totalOrders: totalOrdersCount,
                totalCustomers,
                revenueByStatus,
                revenueChart,
                topCourses: formattedTopCourses,
                recentOrders
            }
        };

    } catch (error) {
        console.error("Error in getDashboardStatsService:", error);
        return {
            status: 500,
            message: "Lỗi khi lấy dữ liệu thống kê"
        };
    }
};
