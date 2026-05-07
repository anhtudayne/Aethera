import { registerUser, verifyOTP, resendOTP } from '../services/authService';

// Register new account
export const handleRegister = async (req, res) => {
    try {
        const result = await registerUser(req.body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Controller - Lỗi đăng ký:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server. Vui lòng thử lại sau.',
        });
    }
};

// Verify OTP for activation
export const handleVerifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                status: 400,
                message: 'Vui lòng cung cấp email và mã OTP.',
            });
        }
        const result = await verifyOTP(email, otp);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Controller - Lỗi xác nhận OTP:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server. Vui lòng thử lại sau.',
        });
    }
};

// Resend OTP
export const handleResendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                status: 400,
                message: 'Vui lòng cung cấp email.',
            });
        }
        const result = await resendOTP(email);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Controller - Lỗi gửi lại OTP:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server. Vui lòng thử lại sau.',
        });
    }
};
