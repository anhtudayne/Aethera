import { AlertCircle } from 'lucide-react';

const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px', 
        color: 'var(--color-error)', 
        fontSize: '0.8rem', 
        marginTop: '4px',
        fontWeight: 500
      }}
    >
      <AlertCircle size={14} style={{ flexShrink: 0 }} />
      <span>{message}</span>
    </div>
  );
};

export default FormError;
