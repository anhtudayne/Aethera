import React, { useEffect } from 'react';

const Toast = ({ type = 'success', title, message, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const isSuccess = type === 'success';

    return (
        <div className={`fixed bottom-lg right-lg z-50 flex items-center gap-md p-md bg-surface-container-lowest border-l-4 ${isSuccess ? 'border-[#22c55e]' : 'border-error'} shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.1)] rounded-r-lg max-w-sm animate-fade-in-up`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSuccess ? 'bg-[#22c55e]/20 text-[#166534]' : 'bg-error/20 text-error'}`}>
                <span className="material-symbols-outlined text-[20px] fill-icon">
                    {isSuccess ? 'check_circle' : 'error'}
                </span>
            </div>
            <div className="flex flex-col">
                <span className="font-title-sm text-title-sm text-on-surface text-[14px]">{title}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-[13px]">{message}</span>
            </div>
            <button onClick={onClose} className="ml-auto text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
        </div>
    );
};

export default Toast;
