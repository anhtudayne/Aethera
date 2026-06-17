import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import FormError from './FormError';

const PasswordInput = ({ 
  label = 'Password', 
  value, 
  onChange, 
  placeholder = '••••••••', 
  name = 'password', 
  error,
  required = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="auth-input-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label className="auth-input-label">{label}</label>
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`auth-input-field ${error ? 'input-error' : ''}`}
          style={{ paddingRight: '44px' }}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute',
            right: '12px',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            zIndex: 11
          }}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <FormError message={error} />}
    </div>
  );
};

export default PasswordInput;
