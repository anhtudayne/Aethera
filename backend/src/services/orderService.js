import db from '../models';
import * as notificationService from './notificationService';
import * as emailService from './emailService';
import { createError } from '../utils/helpers';

export const createOrderFromCart = async (userId) => {
    const transaction = await db.sequelize.transaction();
    try {
        // 1. Lấy giỏ hàng
        const cartItems = await db.Cart.findAll({
            where: { userId },
            include: [{ model: db.Course, as: 'course' }],
        });
        if (!cartItems || cartItems.length === 0) {
            throw createError(400, 'Giỏ hàng trống.');
        }

        // 2. Kiểm tra các khóa đã sở hữu → loại ra
        const ownedCourses = await db.UserCourse.findAll({
            where: { userId, courseId: cartItems.map(i => i.courseId) },
            attributes: ['courseId'],
        });
        const ownedIds = new Set(ownedCourses.map(uc => uc.courseId));
        const validItems = cartItems.filter(item => !ownedIds.has(item.courseId));

        if (validItems.length === 0) {
            throw createError(400, 'Tất cả khóa học trong giỏ bạn đã sở hữu.');
        }

        // 3. Tính tổng tiền
        let totalAmount = 0;
        const orderItemsData = [];
        for (const item of validItems) {
            const price = item.course.salePrice ? Number(item.course.salePrice) : Number(item.course.price);
            totalAmount += price;
            orderItemsData.push({ courseId: item.courseId, price });
        }

        // 4. Tạo Order
        const orderCode = `DH${userId}${Date.now()}`;
        const order = await db.Order.create({
            code: orderCode,
            userId,
            totalAmount,
            status: 'pending',  // Luôn pending, thanh toán do bên khác hoặc tay xử lý
        }, { transaction });

        // 5. Tạo OrderItems
        const items = orderItemsData.map(item => ({ ...item, orderId: order.id }));
        await db.OrderItem.bulkCreate(items, { transaction });

        // 6. Xóa giỏ hàng (chỉ xóa các items hợp lệ)
        await db.Cart.destroy({
            where: { userId, courseId: validItems.map(i => i.courseId) },
            transaction,
        });

        await transaction.commit();

        // 7. Notification
        try {
            const courseNames = validItems.map(item => item.course?.name || 'Khóa học');
            await notificationService.createNotification(
                userId,
                'order_created',
                '📦 Đơn hàng mới đã tạo',
                `Đơn hàng ${orderCode} đang chờ thanh toán. Tổng: ${totalAmount.toLocaleString('vi-VN')}đ`,
                { orderId: order.id, orderCode, totalAmount, courseNames }
            );
        } catch (e) {
            console.error('Notification error:', e);
        }

        return {
            orderCode,
            orderId: order.id,
            totalAmount,
            itemCount: items.length,
            items: items.map(i => ({
                courseId: i.courseId,
                price: i.price,
            })),
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const checkOrderStatus = async (userId, orderCode) => {
    try {
        const order = await db.Order.findOne({
            where: { code: orderCode, userId: userId }
        });

        if (!order) {
            throw createError(404, 'Không tìm thấy đơn hàng');
        }

        return {
            status: order.status,
            isPaid: order.status === 'paid'
        };
    } catch (error) {
        throw error;
    }
};

export const getMyOrders = async (userId, page = 1, limit = 10) => {
    try {
        const offset = (page - 1) * limit;
        const { count, rows } = await db.Order.findAndCountAll({
            where: { userId },
            include: [{
                model: db.OrderItem, as: 'orderItems',
                include: [{ model: db.Course, as: 'course', attributes: ['id', 'name', 'slug', 'thumbnail'] }],
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset,
        });
        return {
            orders: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalItems: count,
            },
        };
    } catch (error) {
        throw error;
    }
};

export const getOrderDetails = async (userId, orderId) => {
    try {
        const order = await db.Order.findOne({
            where: { id: orderId, userId },
            include: [
                {
                    model: db.OrderItem,
                    as: 'orderItems',
                    include: [
                        {
                            model: db.Course,
                            as: 'course',
                            attributes: ['id', 'name', 'slug', 'thumbnail', 'price', 'salePrice']
                        }
                    ]
                }
            ]
        });

        if (!order) {
            throw createError(404, 'Không tìm thấy đơn hàng');
        }

        return order;
    } catch (error) {
        throw error;
    }
};

export const cancelOrder = async (userId, orderId) => {
    try {
        const order = await db.Order.findOne({
            where: { id: orderId, userId }
        });

        if (!order) {
            throw createError(404, 'Không tìm thấy đơn hàng');
        }

        if (order.status !== 'pending') {
            throw createError(400, 'Chỉ có thể hủy đơn hàng đang chờ thanh toán');
        }

        order.status = 'cancelled';
        await order.save();

        return order;
    } catch (error) {
        throw error;
    }
};

/**
 * Called when an order is paid. Grants access, creates enrollment progress records.
 */
export const fulfillOrder = async (orderId) => {
    const transaction = await db.sequelize.transaction();
    try {
        const order = await db.Order.findByPk(orderId, {
            include: [{ model: db.OrderItem, as: 'orderItems' }],
            transaction,
        });
        if (!order) throw createError(404, 'Không tìm thấy đơn hàng');
        if (order.status === 'paid') return { message: 'Đơn hàng đã được thanh toán trước đó.' };

        // 1. Cập nhật trạng thái
        await order.update({ status: 'paid' }, { transaction });

        // 2. Đăng ký các khóa học trong đơn hàng
        for (const item of order.orderItems) {
            const [enrollment, created] = await db.UserCourse.findOrCreate({
                where: { userId: order.userId, courseId: item.courseId },
                defaults: {
                    userId: order.userId,
                    courseId: item.courseId,
                    status: 'active',
                    progressPercent: 0,
                    enrolledAt: new Date(),
                },
                transaction,
            });

            if (created) {
                // 3. Khởi tạo LessonProgress cho tất cả lessons trong khóa học này
                const lessons = await db.Lesson.findAll({
                    include: [{
                        model: db.Section,
                        as: 'section',
                        where: { courseId: item.courseId },
                        attributes: []
                    }],
                    attributes: ['id'],
                    transaction,
                });

                if (lessons.length > 0) {
                    const progressData = lessons.map(l => ({
                        userId: order.userId,
                        lessonId: l.id,
                        courseId: item.courseId,
                        isCompleted: false,
                    }));
                    await db.LessonProgress.bulkCreate(progressData, { transaction, ignoreDuplicates: true });
                }

                // 4. Tăng student count cho khóa học
                await db.Course.increment('totalStudents', { by: 1, where: { id: item.courseId }, transaction });
            }
        }

        await transaction.commit();

        // 5. Gửi thông báo thành công
        const courseNames = [];
        for (const item of order.orderItems) {
            const course = await db.Course.findByPk(item.courseId, { attributes: ['name'] });
            if (course) courseNames.push(course.name);
        }
        await notificationService.createNotification(
            order.userId,
            'order_paid',
            '✅ Thanh toán thành công!',
            `Đơn hàng ${order.code} đã thanh toán thành công. Bạn có thể học ngay!`,
            { orderId: order.id, orderCode: order.code, courseNames }
        );

        // 6. Gửi email cảm ơn
        try {
            const user = await db.User.findByPk(order.userId, { attributes: ['email', 'firstName'] });
            if (user && user.email) {
                // Not awaiting to prevent blocking the response
                emailService.sendOrderPaidEmail(
                    user.email,
                    user.firstName,
                    order.code,
                    order.totalAmount,
                    courseNames
                ).catch(err => console.error('Lỗi khi gửi email async:', err));
            }
        } catch (e) {
            console.error('Lỗi khi chuẩn bị gửi email:', e);
        }

        return { message: 'Thanh toán đơn hàng thành công, đã kích hoạt khóa học.' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
