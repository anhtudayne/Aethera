import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword, clearError, clearMessage } from '../store/slices/authSlice';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Alert from '../components/Alert';
import OtpInput from '../components/OtpInput';

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const validateStep1 = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email không hợp lệ';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!otp || otp.length < 6) newErrors.otp = 'Mã OTP không hợp lệ';
    if (!newPassword) newErrors.newPassword = 'Mật khẩu mới không được để trống';
    else if (newPassword.length < 6) newErrors.newPassword = 'Mật khẩu phải ít nhất 6 ký tự';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (!validateStep1()) return;

    const result = await dispatch(forgotPassword({ email }));
    if (forgotPassword.fulfilled.match(result)) {
      setStep(2);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (!validateStep2()) return;

    const result = await dispatch(resetPassword({ email, otp, newPassword }));
    if (resetPassword.fulfilled.match(result)) {
      setOtp(''); 
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  const handleChangeEmail = () => {
    setStep(1);
    setOtp('');
    dispatch(clearMessage());
    dispatch(clearError());
  };

  return (
    <AuthLayout
      title={step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
      subtitle={
        step === 1 
          ? "Nhập email của bạn để nhận mã OTP đặt lại mật khẩu." 
          : `Nhập mã OTP đã gửi đến ${email} và mật khẩu mới của bạn.`
      }
      footerText={step === 1 ? "Quay lại" : "Chưa nhận được mã?"}
      footerLink={step === 1 ? "/login" : "#"}
      footerLinkText={step === 1 ? "Đăng nhập" : "Gửi lại OTP"}
      onFooterLinkClick={step === 2 ? () => dispatch(forgotPassword({ email })) : undefined}
    >
      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-6">
          {error && <Alert type="error" message={error} onClose={() => dispatch(clearError())} />}
          {message && <Alert type="success" message={message} />}
          
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            error={errors.email}
            icon="📧"
            required
          />

          <Button type="submit" loading={loading}>
            Gửi mã xác nhận
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-6">
          {error && <Alert type="error" message={error} onClose={() => dispatch(clearError())} />}
          {message && <Alert type="success" message={message} />}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Mã OTP</label>
            <OtpInput length={6} onComplete={(value) => setOtp(value)} />
            {errors.otp && <p className="text-xs text-red-500 mt-1 ml-1">{errors.otp}</p>}
          </div>

          <InputField
            label="Mật khẩu mới"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            error={errors.newPassword}
            icon="🔒"
            required
          />

          <InputField
            label="Xác nhận mật khẩu"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            error={errors.confirmPassword}
            icon="🛡️"
            required
          />

          <Button type="submit" loading={loading}>
            Đặt lại mật khẩu
          </Button>
          
          <button 
            type="button" 
            onClick={handleChangeEmail}
            className="w-full text-center text-sm text-gray-500 hover:text-primary transition-colors mt-2"
          >
            Thay đổi email
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
