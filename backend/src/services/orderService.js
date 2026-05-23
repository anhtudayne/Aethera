import db from '../models';

export const createOrderFromCart = async (userId, bankAccount, bankName) => {
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

        // 3. Tạo Order
        // Tạo mã đơn hàng độc nhất, ví dụ: DH + userId + Date.now()
        const orderCode = `DH${userId}${Date.now()}`;
        
        const order = await db.Order.create({
            code: orderCode,
            userId: userId,
            totalAmount: totalAmount,
            status: 'pending',
            paymentMethod: 'bank_transfer'
        }, { transaction });

        // 4. Tạo Order Items
        const itemsToCreate = orderItemsData.map(item => ({
            ...item,
            orderId: order.id
        }));
        await db.OrderItem.bulkCreate(itemsToCreate, { transaction });

        // 5. Xóa giỏ hàng sau khi đặt (Tùy chọn, ở đây mình xóa luôn để tránh đặt trùng)
        await db.Cart.destroy({ where: { userId }, transaction });

        await transaction.commit();

        // 6. Tạo link VietQR
        // https://qr.sepay.vn/img?acc={STK_NGAN_HANG}&bank={TEN_NGAN_HANG}&amount={TONG_TIEN}&des={MA_DON_HANG}
        // Giả sử STK và bankName được cung cấp từ config hoặc body
        const finalBankAccount = bankAccount || process.env.BANK_ACCOUNT || '0000000000';
        const finalBankName = bankName || process.env.BANK_NAME || 'MBBank';
        const qrUrl = `https://qr.sepay.vn/img?acc=${finalBankAccount}&bank=${finalBankName}&amount=${totalAmount}&des=${orderCode}`;

        return {
            orderCode,
            totalAmount,
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
                            attributes: ['id', 'title', 'slug', 'thumbnail']
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
                            attributes: ['id', 'title', 'slug', 'thumbnail', 'price', 'salePrice']
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
