import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../../api/authApi';
import AuthFormWrapper from '../../components/auth/AuthFormWrapper';
import OTPInput from '../../components/auth/OTPInput';
import FormError from '../../components/auth/FormError';
import Button from '../../components/common/Button/Button';
import { ROUTES } from '../../utils/constants';
import './OTPVerificationPage.css';

const OTPVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve email passed from Registration, fallback to local state if accessed directly
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Countdown timer for Resend code: start at 60s
  const [countdown, setCountdown] = useState(60);
  const timerRef = useRef(null);

  const startTimer = () => {
    setCountdown(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    // Start countdown timer interval directly on mount without synchronous state setting
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleResend = async () => {
    if (!email) {
      setError('Please provide an email address first');
      return;
    }
    
    setResendLoading(true);
    setError('');
    try {
      await authApi.resendOTP({ email: email.trim() });
      toast.success('New OTP sent successfully');
      startTimer(); // Restart countdown
      setOtp(''); // Reset input
    } catch (err) {
      toast.error(err?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    if (!email) {
      setError('Email address is required');
      return;
    }
    if (otp.length < 6) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authApi.verifyOTP({
        email: email.trim(),
        otp: otp
      });

      toast.success('Account verified successfully! You can login now.');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      console.error('OTP Verification error:', err);
      toast.error(err?.message || 'Verification failed. Wrong or expired OTP.');
      setError(err?.message || 'Wrong or expired OTP.');
    } finally {
      setLoading(false);
    }
  }, [email, otp, navigate]);

  // Auto-submit when 6 digits are fully typed (run asynchronously via timeout to prevent cascading render warnings)
  useEffect(() => {
    if (otp.length === 6) {
      const timer = setTimeout(() => {
        handleSubmit();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [otp, handleSubmit]);

  return (
    <AuthFormWrapper
      title="Verify your email"
      subtitle="We sent a 6-digit verification code to your email address"
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Email input field - editable if not passed from register */}
        <div className="auth-input-group">
          <label className="auth-input-label">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="yourname@example.com"
            disabled={!!location.state?.email || loading}
            className="auth-input-field"
            required
          />
        </div>

        {/* OTP Input grid */}
        <div className="auth-input-group" style={{ marginBottom: '8px' }}>
          <label className="auth-input-label" style={{ textAlign: 'center', display: 'block' }}>
            Verification Code
          </label>
          <OTPInput value={otp} onChange={setOtp} length={6} />
          {error && <div style={{ display: 'flex', justifyContent: 'center' }}><FormError message={error} /></div>}
        </div>

        {/* Submit */}
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          loading={loading}
          disabled={loading || otp.length < 6}
          className="auth-submit-btn"
        >
          Verify Account
        </Button>
      </form>

      {/* Countdown and Resend */}
      <div className="otp-timer-wrapper">
        {countdown > 0 ? (
          <span>
            Didn't receive code? Resend in{' '}
            <strong className="otp-email-highlight">{countdown}s</strong>
          </span>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span>Didn't receive code?</span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleResend}
              disabled={resendLoading}
              loading={resendLoading}
            >
              Resend Code
            </Button>
          </div>
        )}
      </div>

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

export default OTPVerificationPage;
