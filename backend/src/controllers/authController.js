import { registerUser, verifyOTP, resendOTP, loginUser, forgotPassword, resetPassword, googleLogin, changePassword } from '../services/authService';

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

// Login user
export const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: 400,
                message: 'Vui lòng cung cấp email và mật khẩu.',
            });
        }
        const result = await loginUser(email, password);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Controller - Lỗi đăng nhập:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server. Vui lòng thử lại sau.',
        });
    }
};

// Forgot Password
export const handleForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                status: 400,
                message: 'Vui lòng cung cấp email.',
            });
        }
        const result = await forgotPassword(email);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Controller - Lỗi quên mật khẩu:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server. Vui lòng thử lại sau.',
        });
    }
};

// Reset Password
export const handleResetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                status: 400,
                message: 'Vui lòng cung cấp đầy đủ email, mã OTP và mật khẩu mới.',
            });
        }
        const result = await resetPassword(email, otp, newPassword);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Controller - Lỗi đặt lại mật khẩu:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server. Vui lòng thử lại sau.',
        });
    }
};

// Google OAuth Login
export const handleGoogleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ status: 400, message: 'idToken is required' });
        }
        const result = await googleLogin(idToken);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Controller - Lỗi đăng nhập Google:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server. Vui lòng thử lại sau.',
        });
    }
};

// Change Password
export const handleChangePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                status: 400,
                message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới.',
            });
        }
        const result = await changePassword(userId, oldPassword, newPassword);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error('Controller - Lỗi đổi mật khẩu:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server. Vui lòng thử lại sau.',
        });
    }
};

