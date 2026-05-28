import db from '../models';

export const createOrderFromCart = async (userId, bankAccount, bankName, usePoints = 0) => {
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

        // 2. Tính tổng tiền
        let totalAmount = 0;
        const orderItemsData = [];
        
        for (const item of cartItems) {
            const price = item.course.salePrice ? item.course.salePrice : item.course.price;
            totalAmount += Number(price);
            
            orderItemsData.push({
                courseId: item.courseId,
                price: price
            });
        }

        // 3. Áp dụng điểm tích lũy
        let pointsUsed = 0;
        let discountFromPoints = 0;
        if (usePoints && usePoints > 0) {
            const user = await db.User.findByPk(userId, { transaction });
            if (user.loyaltyPoints < usePoints) {
                const error = new Error(`Bạn không đủ điểm tích lũy. Hiện có: ${user.loyaltyPoints} điểm.`);
                error.statusCode = 400;
                throw error;
            }
            
            discountFromPoints = usePoints * POINT_TO_VND;
            // Không cho giảm quá tổng tiền
            if (discountFromPoints > totalAmount) {
                discountFromPoints = totalAmount;
                pointsUsed = Math.ceil(totalAmount / POINT_TO_VND);
            } else {
                pointsUsed = usePoints;
            }
            totalAmount -= discountFromPoints;

            // Trừ điểm
            await db.User.decrement('loyaltyPoints', {
                by: pointsUsed,
                where: { id: userId },
                transaction,
            });
        }

        // 4. Tạo Order
        const orderCode = `DH${userId}${Date.now()}`;
        
        const order = await db.Order.create({
            code: orderCode,
            userId: userId,
            totalAmount: totalAmount,
            status: 'pending',
            paymentMethod: 'bank_transfer'
        }, { transaction });

        // 5. Tạo Order Items
        const itemsToCreate = orderItemsData.map(item => ({
            ...item,
            orderId: order.id
        }));
        await db.OrderItem.bulkCreate(itemsToCreate, { transaction });

        // 6. Ghi log nếu dùng điểm
        if (pointsUsed > 0) {
            await db.LoyaltyPoint.create({
                userId,
                points: -pointsUsed,
                type: 'spend',
                description: `Thanh toán đơn hàng ${orderCode} (-${discountFromPoints.toLocaleString('vi-VN')}đ)`,
                referenceId: order.id,
            }, { transaction });
        }

        // 7. Xóa giỏ hàng
        await db.Cart.destroy({ where: { userId }, transaction });

        await transaction.commit();

        // 8. Tạo link VietQR
        const finalBankAccount = bankAccount || process.env.BANK_ACCOUNT || '0000000000';
        const finalBankName = bankName || process.env.BANK_NAME || 'MBBank';
        const qrUrl = `https://qr.sepay.vn/img?acc=${finalBankAccount}&bank=${finalBankName}&amount=${totalAmount}&des=${orderCode}`;

        return {
            orderCode,
            totalAmount,
            pointsUsed,
            discountFromPoints,
            qrUrl
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
