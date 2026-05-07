import bcrypt from 'bcryptjs';
import db from '../models/index';
import { generateOTP, getOTPExpireTime } from '../utils/otpHelper';
import { sendOTPEmail } from './emailService';

const User = db.User;
const salt = bcrypt.genSaltSync(10);

// Register user
export const registerUser = async (data) => {
    try {
        const existingUser = await User.findOne({ where: { email: data.email } });

        if (existingUser) {
            // Re-register if not active
            if (!existingUser.isActive) {
                const otpCode = generateOTP();
                const otpExpires = getOTPExpireTime();
                const hashedPassword = bcrypt.hashSync(data.password, salt);

                await existingUser.update({
                    password: hashedPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber || null,
                    address: data.address || null,
                    gender: data.gender !== undefined ? data.gender : true,
                    otp: otpCode,
                    otpExpires: otpExpires,
                });

                let emailSent = true;
                try {
                    await sendOTPEmail(data.email, otpCode, data.firstName);
                } catch (emailError) {
                    console.error('Không thể gửi email OTP:', emailError.message);
                    emailSent = false;
                }

                const response = {
                    status: 200,
                    message: emailSent
                        ? 'Đã gửi lại mã OTP kích hoạt. Vui lòng kiểm tra email.'
                        : 'Đã cập nhật OTP. Tuy nhiên không thể gửi email. Vui lòng thử lại.',
                    emailSent: emailSent,
                };

                if (process.env.NODE_ENV === 'development') {
                    response.devInfo = { otp: otpCode, otpExpires: otpExpires };
                }
                return response;
            }
            return {
                status: 409,
                message: 'Email đã được đăng ký và kích hoạt. Vui lòng sử dụng email khác.',
            };
        }

        const hashedPassword = bcrypt.hashSync(data.password, salt);
        const otpCode = generateOTP();
        const otpExpires = getOTPExpireTime();

        await User.create({
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber || null,
            address: data.address || null,
            gender: data.gender !== undefined ? data.gender : true,
            roleId: 'user',
            isActive: false,
            otp: otpCode,
            otpExpires: otpExpires,
        });

        let emailSent = true;
        try {
            await sendOTPEmail(data.email, otpCode, data.firstName);
        } catch (emailError) {
            console.error('Không thể gửi email OTP:', emailError.message);
            emailSent = false;
        }

        const response = {
            status: 201,
            message: emailSent
                ? 'Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP kích hoạt tài khoản.'
                : 'Đăng ký thành công! Tuy nhiên không thể gửi email OTP. Vui lòng dùng chức năng gửi lại OTP.',
            emailSent: emailSent,
        };

        if (process.env.NODE_ENV === 'development') {
            response.devInfo = {
                otp: otpCode,
                otpExpires: otpExpires,
                note: 'Thông tin OTP chỉ hiển thị trong môi trường development',
            };
        }
        return response;
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        throw error;
    }
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return { status: 404, message: 'Không tìm thấy tài khoản với email này.' };
        }

        if (user.isActive) {
            return { status: 400, message: 'Tài khoản đã được kích hoạt trước đó.' };
        }

        if (user.otp !== otp) {
            return { status: 400, message: 'Mã OTP không chính xác. Vui lòng kiểm tra lại.' };
        }

        if (new Date() > new Date(user.otpExpires)) {
            return { status: 400, message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại OTP mới.' };
        }

        await user.update({
            isActive: true,
            otp: null,
            otpExpires: null,
        });

        return { status: 200, message: 'Kích hoạt tài khoản thành công!' };
    } catch (error) {
        console.error('Lỗi xác nhận OTP:', error);
        throw error;
    }
};

// Resend OTP
export const resendOTP = async (email) => {
    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return { status: 404, message: 'Không tìm thấy tài khoản với email này.' };
        }

        if (user.isActive) {
            return { status: 400, message: 'Tài khoản đã được kích hoạt.' };
        }

        const otpCode = generateOTP();
        const otpExpires = getOTPExpireTime();

        await user.update({
            otp: otpCode,
            otpExpires: otpExpires,
        });

        let emailSent = true;
        try {
            await sendOTPEmail(email, otpCode, user.firstName);
        } catch (emailError) {
            console.error('Không thể gửi email OTP:', emailError.message);
            emailSent = false;
        }

        const response = {
            status: 200,
            message: emailSent
                ? 'Đã gửi lại mã OTP. Vui lòng kiểm tra email của bạn.'
                : 'Đã tạo OTP mới. Tuy nhiên không thể gửi email.',
            emailSent: emailSent,
        };

        if (process.env.NODE_ENV === 'development') {
            response.devInfo = { otp: otpCode, otpExpires: otpExpires };
        }
        return response;
    } catch (error) {
        console.error('Lỗi gửi lại OTP:', error);
        throw error;
    }
};
