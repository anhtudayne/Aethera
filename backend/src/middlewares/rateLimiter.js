import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV === 'development';

// Rate Limiter for Register
export const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 1000 : 5,
    message: {
        status: 429,
        message: 'Quá nhiều yêu cầu đăng ký từ IP này. Vui lòng thử lại sau 15 phút.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate Limiter for Resend OTP
export const resendOtpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 1000 : 3,
    message: {
        status: 429,
        message: 'Quá nhiều yêu cầu gửi lại OTP. Vui lòng thử lại sau 15 phút.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate Limiter for Update Profile
export const updateProfileLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 1000 : 10,
    message: {
        status: 429,
        message: 'Quá nhiều yêu cầu cập nhật hồ sơ từ IP này. Vui lòng thử lại sau 15 phút.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate Limiter for Login
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 1000 : 5,
    message: {
        status: 429,
        message: 'Quá nhiều yêu cầu đăng nhập từ IP này. Vui lòng thử lại sau 15 phút.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate Limiter for Forgot Password
export const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 1000 : 3,
    message: {
        status: 429,
        message: 'Quá nhiều yêu cầu quên mật khẩu. Vui lòng thử lại sau 15 phút.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

