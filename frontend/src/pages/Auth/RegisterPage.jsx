import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../../api/authApi';
import AuthFormWrapper from '../../components/auth/AuthFormWrapper';
import PasswordInput from '../../components/auth/PasswordInput';
import FormError from '../../components/auth/FormError';
import Button from '../../components/common/Button/Button';
import { ROUTES } from '../../utils/constants';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one letter and one number';
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
    if (!validate()) return;

    setLoading(true);
    
    // Split full name into firstName and lastName for backend compatibility
    const nameParts = formData.fullName.trim().split(/\s+/);
    const firstName = nameParts.length === 1 ? nameParts[0] : nameParts.pop();
    const lastName = nameParts.length === 1 ? nameParts[0] : nameParts.join(' ');

    try {
      await authApi.register({
        firstName,
        lastName,
        email: formData.email.trim(),
        password: formData.password
      });

      toast.success('Registration successful! Please verify your OTP sent to email.');
      // Redirect to OTP Verification with email state
      navigate(ROUTES.VERIFY_OTP, { state: { email: formData.email.trim() } });
    } catch (err) {
      console.error('Registration error:', err);
      if (err?.statusCode === 409 || err?.status === 409 || err?.message?.includes('registered') || err?.message?.includes('exists')) {
        setErrors((prev) => ({ ...prev, email: 'Email address already registered' }));
        toast.error('Email is already registered');
      } else {
        toast.error(err?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="Create account"
      subtitle="Start your premium learning journey with Aethera today"
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="auth-input-group">
          <label className="auth-input-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            disabled={loading}
            className={`auth-input-field ${errors.fullName ? 'input-error' : ''}`}
            required
          />
          {errors.fullName && <FormError message={errors.fullName} />}
        </div>

        {/* Email */}
        <div className="auth-input-group">
          <label className="auth-input-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
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

        {/* Confirm Password */}
        <PasswordInput
          label="Confirm Password"
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
          Sign Up
        </Button>
      </form>

      {/* Footer links */}
      <div className="auth-footer-links">
        <span>
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="auth-link">
            Sign In
          </Link>
        </span>
      </div>
    </AuthFormWrapper>
  );
};

export default RegisterPage;
