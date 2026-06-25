import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import db from '../models/index';
import { generateOTP, getOTPExpireTime } from '../utils/otpHelper';
import { sendOTPEmail } from './emailService';
import { generateToken } from '../utils/jwtHelper';

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

        if (String(user.otp) !== String(otp)) {
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

// Login user
export const loginUser = async (email, password) => {
    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return { status: 404, message: 'Email hoặc mật khẩu không chính xác.' };
        }

        if (!user.isActive) {
            if (user.otp) {
                return { status: 403, message: 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để nhận mã OTP.' };
            } else {
                return {
                    status: 403,
                    message: 'Tài khoản của bạn đã bị vô hiệu hóa.\nViệc truy cập vào Aethera đã bị từ chối do hệ thống phát hiện tài khoản này vi phạm nghiêm trọng Chính sách & Tiêu chuẩn Cộng đồng. Nếu bạn cho rằng đây là sự nhầm lẫn, vui lòng liên hệ support@aethera.com để được hỗ trợ.',
                    isBanned: true
                };
            }
        }

        // Google-only user trying to login with password
        if (!user.password && user.provider === 'google') {
            return { status: 400, message: 'Tài khoản này sử dụng đăng nhập Google. Vui lòng đăng nhập bằng Google.' };
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return { status: 401, message: 'Email hoặc mật khẩu không chính xác.' };
        }

        const token = generateToken({ id: user.id, role: user.roleId, email: user.email });

        return {
            status: 200,
            message: 'Đăng nhập thành công',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    image: user.image,
                    role: user.roleId,
                    provider: user.provider,
                }
            }
        };
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        throw error;
    }
};

// Forgot Password
export const forgotPassword = async (email) => {
    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return { status: 404, message: 'Không tìm thấy tài khoản với email này.' };
        }

        if (!user.isActive) {
            return { status: 403, message: 'Tài khoản chưa được kích hoạt.' };
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
                ? 'Đã gửi mã OTP đặt lại mật khẩu. Vui lòng kiểm tra email của bạn.'
                : 'Đã tạo OTP. Tuy nhiên không thể gửi email.',
            emailSent: emailSent,
        };

        if (process.env.NODE_ENV === 'development') {
            response.devInfo = { otp: otpCode, otpExpires: otpExpires };
        }
        return response;
    } catch (error) {
        console.error('Lỗi quên mật khẩu:', error);
        throw error;
    }
};

// Reset Password
export const resetPassword = async (email, otp, newPassword) => {
    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return { status: 404, message: 'Không tìm thấy tài khoản với email này.' };
        }

        if (String(user.otp) !== String(otp)) {
            return { status: 400, message: 'Mã OTP không chính xác. Vui lòng kiểm tra lại.' };
        }

        if (new Date() > new Date(user.otpExpires)) {
            return { status: 400, message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại OTP mới.' };
        }

        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        await user.update({
            password: hashedPassword,
            otp: null,
            otpExpires: null,
        });

        return { status: 200, message: 'Đặt lại mật khẩu thành công!' };
    } catch (error) {
        console.error('Lỗi đặt lại mật khẩu:', error);
        throw error;
    }
};

// Google OAuth Login
export const googleLogin = async (idToken) => {
    try {
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, given_name, family_name, picture } = payload;

        // Find user by googleId or email
        let user = await User.findOne({
            where: {
                [Op.or]: [{ googleId }, { email }],
            },
        });

        if (!user) {
            // Create new user (no password, no OTP, auto-active)
            user = await User.create({
                email,
                password: null,
                firstName: given_name || '',
                lastName: family_name || '',
                image: picture,
                roleId: 'user',
                isActive: true,
                googleId,
                provider: 'google',
            });
        } else if (!user.googleId) {
            // Link Google account to existing local account
            await user.update({ googleId });
            // Keep provider as 'local' — user already has a password
        }

        // Check if account is suspended
        if (!user.isActive) {
            if (user.otp) {
                return { status: 403, message: 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để nhận mã OTP.' };
            } else {
                return {
                    status: 403,
                    message: '🚫 Tài khoản của bạn đã bị vô hiệu hóa.\nViệc truy cập vào Aethera đã bị từ chối do hệ thống phát hiện tài khoản này vi phạm nghiêm trọng Chính sách & Tiêu chuẩn Cộng đồng. Nếu bạn cho rằng đây là sự nhầm lẫn, vui lòng liên hệ support@aethera.com để được hỗ trợ.',
                    isBanned: true
                };
            }
        }

        const token = generateToken({ id: user.id, role: user.roleId, email: user.email });

        return {
            status: 200,
            message: 'Đăng nhập Google thành công',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    image: user.image,
                    role: user.roleId,
                    provider: user.provider,
                },
            },
        };
    } catch (error) {
        console.error('Lỗi đăng nhập Google:', error);
        if (error.message && error.message.includes('Token used too late')) {
            return { status: 401, message: 'Google token đã hết hạn. Vui lòng thử lại.' };
        }
        throw error;
    }
};

// Change Password
export const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return { status: 404, message: 'Không tìm thấy người dùng.' };
        }

        // Google-only users don't have a password
        if (!user.password && user.provider === 'google') {
            return {
                status: 400,
                message: 'Tài khoản Google chưa có mật khẩu. Vui lòng sử dụng "Quên mật khẩu" để tạo mật khẩu.',
            };
        }

        // Verify old password
        const isMatch = bcrypt.compareSync(oldPassword, user.password);
        if (!isMatch) {
            return { status: 400, message: 'Mật khẩu hiện tại không chính xác.' };
        }

        // New password must be different
        if (oldPassword === newPassword) {
            return { status: 400, message: 'Mật khẩu mới phải khác mật khẩu hiện tại.' };
        }

        const hashedPassword = bcrypt.hashSync(newPassword, salt);
        await user.update({ password: hashedPassword });

        return { status: 200, message: 'Đổi mật khẩu thành công.' };
    } catch (error) {
        console.error('Lỗi đổi mật khẩu:', error);
        throw error;
    }
};
