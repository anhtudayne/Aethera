import './AuthFormWrapper.css';

const AuthFormWrapper = ({ children, title, subtitle }) => {
  return (
    <div className="auth-form-inner-card">
      {/* Title & Subtitle */}
      <div className="auth-title-container">
        <h2 className="auth-form-title">{title}</h2>
        {subtitle && <p className="auth-form-subtitle">{subtitle}</p>}
      </div>

      {/* Children Form Fields */}
      {children}
    </div>
  );
};

export default AuthFormWrapper;
