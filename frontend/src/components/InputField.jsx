import { useState } from 'react';

export default function InputField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  icon,
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            {icon}
          </span>
        )}
        <input
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full rounded-xl border px-4 py-3 text-sm outline-none
            transition-all duration-200 ease-in-out
            ${icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-12' : ''}
            ${error
              ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-gray-300 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20'
            }
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 animate-fade-in">{error}</p>
      )}
    </div>
  );
}
