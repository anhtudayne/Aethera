import db from '../models/index';

const User = db.User;

export const updateUserProfile = async (userId, data) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return {
                status: 404,
                message: 'Không tìm thấy người dùng.',
            };
        }

        // Lọc ra các trường cho phép cập nhật để tránh lọt trường nhạy cảm như roleId, isActive, password
        const allowedUpdates = {};
        
        // Kiểm tra số điện thoại bị trùng
        if (data.phoneNumber !== undefined && data.phoneNumber !== user.phoneNumber) {
            const existingPhone = await User.findOne({ where: { phoneNumber: data.phoneNumber } });
            if (existingPhone) {
                return {
                    status: 409, // Conflict
                    message: 'Số điện thoại này đã được sử dụng bởi tài khoản khác.',
                };
            }
            allowedUpdates.phoneNumber = data.phoneNumber;
        }


        if (data.firstName !== undefined) allowedUpdates.firstName = data.firstName;
        if (data.lastName !== undefined) allowedUpdates.lastName = data.lastName;
        if (data.address !== undefined) allowedUpdates.address = data.address;
        if (data.gender !== undefined) allowedUpdates.gender = data.gender;
        if (data.image !== undefined) allowedUpdates.image = data.image;

        await user.update(allowedUpdates);

        // Lấy lại dữ liệu mới (ẩn password và otp)
        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password', 'otp', 'otpExpires'] },
        });

        return {
            status: 200,
            message: 'Cập nhật hồ sơ thành công.',
            data: updatedUser,
        };
    } catch (error) {
        console.error('Lỗi cập nhật hồ sơ:', error);
        throw error;
    }
};
