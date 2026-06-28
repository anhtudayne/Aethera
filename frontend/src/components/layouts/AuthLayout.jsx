import { Outlet, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import './AuthLayout.css';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Left side: Form */}
      <div className="auth-form-container">
        <div className="auth-form-header">
          <Link to={ROUTES.HOME} className="auth-back-link">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
        <div className="auth-form-box">
          <div className="auth-logo-row">
            <Sparkles size={24} className="auth-logo-icon" />
            <span className="auth-logo-name">Aethera</span>
          </div>
          <Outlet />
        </div>
      </div>

      {/* Right side: Illustration Panel */}
      <div className="auth-illustration-panel">
        <div className="auth-overlay-decor"></div>
        <div className="auth-illustration-content">
          <span className="auth-badge-tag">PREMIUM E-LEARNING</span>
          <h2 className="auth-illustration-title">
            Refine Knowledge.<br />Elevate Experience.
          </h2>
          <p className="auth-illustration-desc">
            Your learning journey starts here. Experience the most advanced and sophisticated online learning platform.
          </p>
          <div className="auth-illustration-features">
            <div className="auth-feature-item">
              <span className="auth-feature-dot"></span>
              <span>Curated high-quality video courses</span>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-dot"></span>
              <span>Interactive note-taking during study</span>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-dot"></span>
              <span>Verified certification templates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
