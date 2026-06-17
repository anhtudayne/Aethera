import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../../api/authApi';
import AuthFormWrapper from '../../components/auth/AuthFormWrapper';
import PasswordInput from '../../components/auth/PasswordInput';
import Button from '../../components/common/Button/Button';
import { ROUTES } from '../../utils/constants';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Reset token is missing or invalid.');
      return;
    }
    if (!validate()) return;

    setLoading(true);
    try {
      await authApi.resetPassword({
        token: token,
        newPassword: formData.password
      });

      toast.success('Password reset successfully! Redirecting to login...');
      setSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error(err?.message || 'Failed to reset password. Link may have expired.');
      setErrors((prev) => ({ ...prev, password: err?.message || 'Token expired or invalid link' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="Reset Password"
      subtitle={success ? '' : 'Please enter your new premium password below'}
    >
      {!token ? (
        <div className="reset-error-banner">
          <h4>⚠️ Invalid Reset Token</h4>
          <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>
            We couldn't detect a valid reset link token. Please check your email and click the exact link provided, or request a new reset link.
          </p>
          <Link to={ROUTES.FORGOT_PASSWORD} className="auth-link" style={{ display: 'inline-block', marginTop: '12px' }}>
            Request new link
          </Link>
        </div>
      ) : success ? (
        <div className="forgot-success-banner">
          <h4>✓ Password reset completed!</h4>
          <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>
            Your password has been changed successfully. You will be redirected to the sign-in screen in 2 seconds.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {/* Password */}
          <PasswordInput
            label="New Password"
            value={formData.password}
            onChange={handleChange}
            name="password"
            error={errors.password}
            disabled={loading}
            required
          />

          {/* Confirm Password */}
          <PasswordInput
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            placeholder="Re-enter password"
            error={errors.confirmPassword}
            disabled={loading}
            required
          />

          {/* Submit */}
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            loading={loading}
            disabled={loading}
            className="auth-submit-btn"
          >
            Reset Password
          </Button>
        </form>
      )}

      {/* Footer link */}
      <div className="auth-footer-links" style={{ marginTop: '32px' }}>
        <span>
          Back to{' '}
          <Link to={ROUTES.LOGIN} className="auth-link">
            Sign In
          </Link>
        </span>
      </div>
    </AuthFormWrapper>
  );
};

export default ResetPasswordPage;
