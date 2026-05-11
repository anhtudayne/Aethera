import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp, clearError, clearMessage } from '../store/slices/authSlice';
import AuthLayout from '../components/AuthLayout';
import OtpInput from '../components/OtpInput';
import Button from '../components/Button';
import Alert from '../components/Alert';

export default function VerifyOtpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message, otpEmail } = useSelector((state) => state.auth);

  const [otpValue, setOtpValue] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [verified, setVerified] = useState(false);

  // Redirect if no email
  useEffect(() => {
    if (!otpEmail) {
      navigate('/register');
    }
  }, [otpEmail, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const handleOtpComplete = useCallback((otp) => {
    setOtpValue(otp);
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otpValue || otpValue.length < 6) return;

    dispatch(clearError());
    const result = await dispatch(verifyOtp({ email: otpEmail, otp: otpValue }));
    if (verifyOtp.fulfilled.match(result)) {
      setVerified(true);
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  const handleResend = async () => {
    dispatch(clearError());
    dispatch(clearMessage());
    const result = await dispatch(resendOtp({ email: otpEmail }));
    if (resendOtp.fulfilled.match(result)) {
      setCountdown(60);
    }
  };

  if (!otpEmail) return null;

  return (
    <AuthLayout
      title="Xác nhận OTP"
      subtitle={`Nhập mã OTP 6 số đã gửi đến ${otpEmail}`}
      footerText="Quay lại"
      footerLink="/register"
      footerLinkText="Đăng ký"
    >
      <form onSubmit={handleVerify}>
        {error && <Alert type="error" message={error} onClose={() => dispatch(clearError())} />}
        {message && <Alert type="success" message={message} />}
        {verified && <Alert type="success" message="Kích hoạt thành công! Đang chuyển đến trang đăng nhập..." />}

        <div className="my-8">
          <OtpInput length={6} onComplete={handleOtpComplete} />
        </div>

        <Button type="submit" loading={loading} disabled={otpValue.length < 6 || verified}>
          Xác nhận OTP
        </Button>

        <div className="text-center mt-6">
          {countdown > 0 ? (
            <p className="text-sm text-gray-400">
              Gửi lại OTP sau <span className="font-semibold text-primary">{countdown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-sm text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              Gửi lại mã OTP
            </button>
          )}
        </div>
      </form>
    </AuthLayout>
  );
}
