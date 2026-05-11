import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError, clearMessage } from '../store/slices/authSlice';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Alert from '../components/Alert';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email không hợp lệ';
    if (!form.password) newErrors.password = 'Mật khẩu không được để trống';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (!validate()) return;

    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      const redirectUrl = result.payload.data.redirectUrl;
      navigate(redirectUrl || '/');
    }
  };

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Chào mừng trở lại! Đăng nhập để tiếp tục học."
      footerText="Chưa có tài khoản?"
      footerLink="/register"
      footerLinkText="Đăng ký ngay"
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && <Alert type="error" message={error} onClose={() => dispatch(clearError())} />}

        <InputField
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="email@example.com"
          error={errors.email}
          icon="📧"
          required
        />

        <InputField
          label="Mật khẩu"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Nhập mật khẩu"
          error={errors.password}
          icon="🔒"
          required
        />

        <div className="flex justify-end mb-4">
          <a href="/forgot-password" className="text-sm text-primary hover:text-primary-dark transition-colors font-medium">
            Quên mật khẩu?
          </a>
        </div>

        <Button type="submit" loading={loading}>
          Đăng nhập
        </Button>
      </form>
    </AuthLayout>
  );
}
