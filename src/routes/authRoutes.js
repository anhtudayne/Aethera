import express from 'express';
import { handleRegister, handleVerifyOTP, handleResendOTP } from '../controllers/authController';
import { registerLimiter, resendOtpLimiter } from '../middlewares/rateLimiter';
import { registerValidation, handleValidationErrors } from '../middlewares/validators/authValidator';

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

export default router;
