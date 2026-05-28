import db from '../models';
import * as couponService from './couponService';

export const createOrderFromCart = async (userId, bankAccount, bankName, usePoints = 0, couponCode = null) => {
    const POINT_TO_VND = 1000;
    const transaction = await db.sequelize.transaction();
    try {
        // 1. Lấy giỏ hàng của user
        const cartItems = await db.Cart.findAll({
            where: { userId },
            include: [{ model: db.Course, as: 'course' }],
        });

        if (!cartItems || cartItems.length === 0) {
            const error = new Error('Giỏ hàng trống.');
            error.statusCode = 400;
            throw error;
        }

        // 2. Tính tổng tiền ban đầu (cartTotal)
        let cartTotal = 0;
        const orderItemsData = [];
        
        for (const item of cartItems) {
            const price = item.course.salePrice ? item.course.salePrice : item.course.price;
            cartTotal += Number(price);
            
            orderItemsData.push({
                courseId: item.courseId,
                price: price
            });
        }

        // 3. Áp dụng mã giảm giá (Coupon)
        let discountFromCoupon = 0;
        let subTotal = cartTotal;
        if (couponCode) {
            const validateResult = await couponService.validateCoupon(couponCode, cartTotal);
            discountFromCoupon = validateResult.discountAmount;
            subTotal = validateResult.finalTotal;
        }

        // 4. Áp dụng điểm tích lũy (Points)
        let pointsUsed = 0;
        let discountFromPoints = 0;
        let finalTotal = subTotal;
        
        if (usePoints && usePoints > 0) {
            const user = await db.User.findByPk(userId, { transaction });
            if (user.loyaltyPoints < usePoints) {
                const error = new Error(`Bạn không đủ điểm tích lũy. Hiện có: ${user.loyaltyPoints} điểm.`);
                error.statusCode = 400;
                throw error;
            }
            
            discountFromPoints = usePoints * POINT_TO_VND;
            // Không cho giảm quá số tiền còn lại (subTotal)
            if (discountFromPoints > subTotal) {
                discountFromPoints = subTotal;
                pointsUsed = Math.ceil(subTotal / POINT_TO_VND);
            } else {
                pointsUsed = usePoints;
            }
            finalTotal -= discountFromPoints;

            // Trừ điểm
            if (pointsUsed > 0) {
                await db.User.decrement('loyaltyPoints', {
                    by: pointsUsed,
                    where: { id: userId },
                    transaction,
                });
            }
        }

        // 5. Kiểm tra nếu thanh toán toàn bộ bằng mã/điểm
        const isFullyPaid = finalTotal <= 0;
        
        // 6. Tạo Order
        const orderCode = `DH${userId}${Date.now()}`;
        
        const order = await db.Order.create({
            code: orderCode,
            userId: userId,
            totalAmount: finalTotal,
            status: isFullyPaid ? 'paid' : 'pending',
            paymentMethod: isFullyPaid ? 'points_coupon' : 'bank_transfer',
            couponCode: couponCode || null,
            discountFromCoupon,
            discountFromPoints
        }, { transaction });

        // 7. Tạo Order Items
        const itemsToCreate = orderItemsData.map(item => ({
            ...item,
            orderId: order.id
        }));
        await db.OrderItem.bulkCreate(itemsToCreate, { transaction });

        // 8. Cấp quyền truy cập ngay nếu isFullyPaid
        if (isFullyPaid) {
            const courseAccessData = itemsToCreate.map(item => ({
                userId,
                courseId: item.courseId,
                status: 'active'
            }));
            await db.UserCourse.bulkCreate(courseAccessData, { transaction });
        }

        // 9. Ghi log nếu dùng điểm
        if (pointsUsed > 0) {
            await db.LoyaltyPoint.create({
                userId,
                points: -pointsUsed,
                type: 'spend',
                description: `Thanh toán đơn hàng ${orderCode} (-${discountFromPoints.toLocaleString('vi-VN')}đ)`,
                referenceId: order.id,
            }, { transaction });
        }

        // 10. Tăng số lượt dùng của coupon
        if (couponCode && discountFromCoupon > 0) {
            await couponService.incrementCouponUsage(couponCode, transaction);
        }

        // 11. Xóa giỏ hàng
        await db.Cart.destroy({ where: { userId }, transaction });

        await transaction.commit();

        // 12. Xử lý trả về
        if (isFullyPaid) {
            return {
                orderCode,
                totalAmount: finalTotal,
                pointsUsed,
                discountFromPoints,
                discountFromCoupon,
                qrUrl: null,
                isFullyPaid: true
            };
        }

        // Tạo link VietQR
        const finalBankAccount = bankAccount || process.env.BANK_ACCOUNT || '0000000000';
        const finalBankName = bankName || process.env.BANK_NAME || 'MBBank';
        const qrUrl = `https://qr.sepay.vn/img?acc=${finalBankAccount}&bank=${finalBankName}&amount=${finalTotal}&des=${orderCode}`;

        return {
            orderCode,
            totalAmount: finalTotal,
            pointsUsed,
            discountFromPoints,
            discountFromCoupon,
            qrUrl,
            isFullyPaid: false
        };

    } catch (error) {
        await transaction.rollback();
        console.error('Lỗi service createOrder:', error);
        throw error;
    }
};

export const checkOrderStatus = async (userId, orderCode) => {
    try {
        const order = await db.Order.findOne({
            where: { code: orderCode, userId: userId }
        });

        if (!order) {
            const error = new Error('Không tìm thấy đơn hàng');
            error.statusCode = 404;
            throw error;
        }

        return {
            status: order.status,
            isPaid: order.status === 'paid'
        };
    } catch (error) {
        console.error('Lỗi service checkOrderStatus:', error);
        throw error;
    }
};

export const getMyOrders = async (userId) => {
    try {
        const orders = await db.Order.findAll({
            where: { userId },
            include: [
                {
                    model: db.OrderItem,
                    as: 'orderItems',
                    include: [
                        {
                            model: db.Course,
                            as: 'course',
                            attributes: ['id', 'name', 'slug', 'thumbnail']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        return orders;
    } catch (error) {
        console.error('Lỗi service getMyOrders:', error);
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
            const error = new Error('Không tìm thấy đơn hàng');
            error.statusCode = 404;
            throw error;
        }

        return order;
    } catch (error) {
        console.error('Lỗi service getOrderDetails:', error);
        throw error;
    }
};

export const cancelOrder = async (userId, orderId) => {
    try {
        const order = await db.Order.findOne({
            where: { id: orderId, userId }
        });

        if (!order) {
            const error = new Error('Không tìm thấy đơn hàng');
            error.statusCode = 404;
            throw error;
        }

        if (order.status !== 'pending') {
            const error = new Error('Chỉ có thể hủy đơn hàng đang chờ thanh toán');
            error.statusCode = 400;
            throw error;
        }

        order.status = 'cancelled';
        await order.save();

        return order;
    } catch (error) {
        console.error('Lỗi service cancelOrder:', error);
        throw error;
    }
};
