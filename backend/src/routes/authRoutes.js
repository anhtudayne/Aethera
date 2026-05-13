import express from 'express';
import { handleRegister, handleVerifyOTP, handleResendOTP, handleLogin, handleForgotPassword, handleResetPassword } from '../controllers/authController';
import { registerLimiter, resendOtpLimiter, loginLimiter, forgotPasswordLimiter } from '../middlewares/rateLimiter';
import { registerValidation, handleValidationErrors, loginValidation, forgotPasswordValidation, resetPasswordValidation } from '../middlewares/validators/authValidator';

let router = express.Router();

// Register route with rate limit and validation
router.post(
    '/register',
    registerLimiter,
    registerValidation,
    handleValidationErrors,
    handleRegister
);

// Verify OTP route
router.post('/verify-otp', handleVerifyOTP);

// Resend OTP route with rate limit
router.post(
    '/resend-otp',
    resendOtpLimiter,
    handleResendOTP
);

// Login route with rate limit and validation
router.post(
    '/login',
    loginLimiter,
    loginValidation,
    handleValidationErrors,
    handleLogin
);

// Forgot Password route with rate limit and validation
router.post(
    '/forgot-password',
    forgotPasswordLimiter,
    forgotPasswordValidation,
    handleValidationErrors,
    handleForgotPassword
);

// Reset Password route with validation
router.post(
    '/reset-password',
    resetPasswordValidation,
    handleValidationErrors,
    handleResetPassword
);

export default router;
