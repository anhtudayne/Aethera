import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../../api/authApi';
import AuthFormWrapper from '../../components/auth/AuthFormWrapper';
import FormError from '../../components/auth/FormError';
import Button from '../../components/common/Button/Button';
import { ROUTES } from '../../utils/constants';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await authApi.forgotPassword({ email: email.trim() });
      toast.success('Password reset link sent successfully');
      setSuccess(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      toast.error(err?.message || 'Failed to request reset. Email may not exist.');
      setError(err?.message || 'Email address not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="Forgot Password"
      subtitle={success ? '' : 'Enter your registered email address to receive a secure password reset link'}
    >
      {success ? (
        <div className="forgot-success-banner">
          <h4>📧 Verification email sent!</h4>
          <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>
            We've sent a password reset link to <strong>{email}</strong>. Please check your inbox (and spam folder) and follow the instructions to reset your password.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="auth-input-group">
            <label className="auth-input-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="john.doe@example.com"
              disabled={loading}
              className={`auth-input-field ${error ? 'input-error' : ''}`}
              required
            />
            {error && <FormError message={error} />}
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
            Send Reset Link
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

export default ForgotPasswordPage;
