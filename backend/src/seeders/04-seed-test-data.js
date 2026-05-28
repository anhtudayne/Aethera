require('dotenv').config();
const db = require('./models/index');

async function seedData() {
    try {
        console.log('🔄 Đang đồng bộ cơ sở dữ liệu...');
        await db.sequelize.sync({ alter: true });
        
        console.log('🌱 Đang tạo dữ liệu mẫu (Coupons & Loyalty Points)...');

        // 1. Tạo Coupon Giảm giá cố định (100k)
        await db.Coupon.findOrCreate({
            where: { code: 'GIAM100K' },
            defaults: {
                discountType: 'fixed',
                discountValue: 100000, // 100,000 VNĐ
                minOrderValue: 200000,
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Hết hạn sau 1 năm
                usageLimit: 100,
                isActive: true
            }
        });

        // 2. Tạo Coupon Giảm giá phần trăm (50% tối đa 500k)
        await db.Coupon.findOrCreate({
            where: { code: 'GIAM50' },
            defaults: {
                discountType: 'percent',
                discountValue: 50, // 50%
                maxDiscount: 500000, // Tối đa 500,000 VNĐ
                minOrderValue: 0,
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                usageLimit: null, // Không giới hạn
                isActive: true
            }
        });

        // 3. Tặng 500,000 điểm tích lũy cho User đầu tiên trong DB
        const firstUser = await db.User.findOne({ order: [['id', 'ASC']] });
        if (firstUser) {
            firstUser.loyaltyPoints = (firstUser.loyaltyPoints || 0) + 500000;
            await firstUser.save();
            console.log(`✅ Đã cộng 500,000 điểm cho user: ${firstUser.email}`);
        } else {
            console.log('⚠️ Không tìm thấy User nào trong database để cộng điểm.');
        }

        console.log('✅ Tạo dữ liệu mẫu thành công!');
        console.log('Mã coupon test: GIAM100K, GIAM50');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi tạo dữ liệu mẫu:', error);
        process.exit(1);
    }
}

seedData();
