import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../../api/authApi';
import useAuth from '../../hooks/useAuth';
import AuthFormWrapper from '../../components/auth/AuthFormWrapper';
import PasswordInput from '../../components/auth/PasswordInput';
import FormError from '../../components/auth/FormError';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';
import Button from '../../components/common/Button/Button';
import { ROUTES } from '../../utils/constants';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [banMessage, setBanMessage] = useState('');

  const redirectPath = searchParams.get('redirect') || ROUTES.HOME;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user edits
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanMessage('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authApi.login({
        email: formData.email.trim(),
        password: formData.password
      });

      const token = res?.token || res?.data?.token;
      const user = res?.user || res?.data?.user;

      if (token && user) {
        login(token, user);
        toast.success('Logged in successfully', { duration: 750 });
        // Delay to allow toast to show and context to update before redirecting
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 250);
      } else {
        throw new Error('Invalid authentication response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Handle unverified or banned account
      if (err?.isBanned) {
        setBanMessage(err.message);
      } else if (err?.statusCode === 403 || err?.status === 403 || err?.message?.includes('verify')) {
        toast.warning('Account unverified. Redirecting to OTP Verification...');
        navigate(ROUTES.VERIFY_OTP, { state: { email: formData.email.trim() } });
      } else {
        toast.error(err?.message || 'Failed to login. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSuccess = () => {
    navigate(redirectPath);
  };

  return (
    <AuthFormWrapper
      title="Welcome back"
      subtitle="Please enter your premium credentials to login"
    >
      {banMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 shadow-sm">
          <span className="text-xl leading-none">🚫</span>
          <div className="text-sm text-red-800 font-medium whitespace-pre-line leading-relaxed">
            {banMessage}
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className="auth-input-group">
          <label className="auth-input-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="yourname@example.com"
            disabled={loading}
            className={`auth-input-field ${errors.email ? 'input-error' : ''}`}
            required
          />
          {errors.email && <FormError message={errors.email} />}
        </div>

        {/* Password */}
        <PasswordInput
          label="Password"
          value={formData.password}
          onChange={handleChange}
          name="password"
          error={errors.password}
          disabled={loading}
          required
        />

        {/* Forgot password row */}
        <div className="login-extra-row">
          <div></div>
          <Link to={ROUTES.FORGOT_PASSWORD} className="auth-link">
            Forgot Password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={loading}
          className="auth-submit-btn"
        >
          Sign In
        </Button>
      </form>

      <div className="auth-divider-row">or</div>

      {/* Google Sign-in */}
      <GoogleLoginButton onSuccess={handleOAuthSuccess} />

      {/* Footer links */}
      <div className="auth-footer-links">
        <span>
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER} className="auth-link">
            Register now
          </Link>
        </span>
      </div>
    </AuthFormWrapper>
  );
};

export default LoginPage;
