import rateLimit from 'express-rate-limit';

// Rate Limiter for Register
export const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
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
    max: 3, 
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
    max: 10, 
    message: {
        status: 429,
        message: 'Quá nhiều yêu cầu cập nhật hồ sơ từ IP này. Vui lòng thử lại sau 15 phút.',
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});
