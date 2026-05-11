import { useEffect, useState } from 'react';

export default function Alert({ type = 'error', message, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message || !visible) return null;

  const styles = {
    success: 'bg-green-50 border-green-400 text-green-700',
    error: 'bg-red-50 border-red-400 text-red-700',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-700',
    info: 'bg-blue-50 border-blue-400 text-blue-700',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`flex items-start gap-3 rounded-xl border-l-4 p-4 mb-4 animate-fade-in ${styles[type]}`}>
      <span className="text-lg flex-shrink-0">{icons[type]}</span>
      <p className="text-sm flex-1">{message}</p>
      <button
        onClick={() => { setVisible(false); onClose?.(); }}
        className="text-gray-400 hover:text-gray-600 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
