require('dotenv').config();
const db = require('../models/index');
const bcrypt = require('bcryptjs');

async function updateTestUser() {
    try {
        const email = 'test@example.com';
        const rawPassword = 'password123';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        let user = await db.User.findOne({ where: { email: email } });
        if (user) {
            user.password = hashedPassword;
            user.loyaltyPoints = 500000;
            user.isActive = true; // Bật active để đăng nhập được ngay
            user.roleId = 'admin'; // Đảm bảo test user là Admin/Giảng viên để test Admin page
            await user.save();
            console.log(`✅ Đã cập nhật tài khoản test: ${email} | Mật khẩu: ${rawPassword}`);
        } else {
            await db.User.create({
                email: email,
                password: hashedPassword,
                firstName: 'Test',
                lastName: 'User',
                isActive: true,
                loyaltyPoints: 500000,
                roleId: 'admin'
            });
            console.log(`✅ Đã tạo mới tài khoản test: ${email} | Mật khẩu: ${rawPassword}`);
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ Lỗi:', err);
        process.exit(1);
    }
}
updateTestUser();
