import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import './Button.css';

const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon: Icon,
  disabled,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={clsx(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'btn-full-width',
        loading && 'btn-loading',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="btn-spinner" size={16} />}
      {!loading && Icon && <Icon className="btn-icon" size={18} />}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;
