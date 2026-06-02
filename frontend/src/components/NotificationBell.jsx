import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchNotifications,
    fetchUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    addNotification,
    setUnreadCount,
} from '../store/slices/notificationSlice';
import { connectSocket, disconnectSocket, onNotification, onUnreadCount, offNotification, offUnreadCount } from '../api/socketClient';

// Relative time helper
const timeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Vừa xong';
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    if (diffDay < 7) return `${diffDay} ngày trước`;
    return date.toLocaleDateString('vi-VN');
};

// Icon mapping by notification type
const typeIcons = {
    order_created: '📦',
    order_paid: '✅',
    new_review: '⭐',
    points_earned: '🎁',
};

export default function NotificationBell() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notifications, unreadCount } = useSelector((state) => state.notification);
    const { user } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const dropdownRef = useRef(null);

    // Socket.IO connection & listeners
    useEffect(() => {
        if (!user) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        // Connect WebSocket
        connectSocket(token);

        // Listen for new notifications (real-time)
        onNotification((data) => {
            dispatch(addNotification(data));
            // Show toast
            setToast(data);
            setTimeout(() => setToast(null), 5000);
        });

        // Listen for unread count updates
        onUnreadCount((data) => {
            dispatch(setUnreadCount(data.count));
        });

        // Fetch initial unread count
        dispatch(fetchUnreadCount());

        return () => {
            offNotification();
            offUnreadCount();
            disconnectSocket();
        };
    }, [user, dispatch]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch notifications when dropdown opens
    const toggleDropdown = () => {
        if (!isOpen) {
            dispatch(fetchNotifications({ page: 1, limit: 10 }));
        }
        setIsOpen(!isOpen);
    };

    const handleNotificationClick = (notif) => {
        if (!notif.isRead) {
            dispatch(markNotificationRead(notif.id));
        }
        setIsOpen(false);

        // Navigate based on notification type
        if (notif.type === 'order_created' || notif.type === 'order_paid') {
            navigate('/user/orders');
        } else if (notif.type === 'new_review') {
            navigate('/user/rewards');
        }
    };

    const handleMarkAllRead = (e) => {
        e.stopPropagation();
        dispatch(markAllNotificationsRead());
    };

    const handleViewAll = () => {
        setIsOpen(false);
        navigate('/user/notifications');
    };

    return (
        <>
            {/* Toast notification */}
            {toast && (
                <div className="fixed top-20 right-4 z-[100] animate-slide-in-right">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-4 max-w-sm flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{typeIcons[toast.type] || '🔔'}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{toast.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{toast.message}</p>
                        </div>
                        <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Bell icon + dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className="relative p-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
                    title="Thông báo"
                    id="notification-bell"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>

                    {/* Badge */}
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* Dropdown panel */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-semibold text-gray-800 text-sm">🔔 Thông báo</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                                >
                                    Đánh dấu tất cả đã đọc
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <p className="text-sm">Chưa có thông báo nào</p>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <button
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 flex items-start gap-3 ${
                                            !notif.isRead ? 'bg-blue-50/50' : ''
                                        }`}
                                    >
                                        <span className="text-xl flex-shrink-0 mt-0.5">{typeIcons[notif.type] || '🔔'}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm truncate ${!notif.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                                            <p className="text-[11px] text-gray-400 mt-1">{timeAgo(notif.createdAt)}</p>
                                        </div>
                                        {!notif.isRead && (
                                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="border-t border-gray-100">
                                <button
                                    onClick={handleViewAll}
                                    className="w-full px-4 py-2.5 text-center text-sm text-primary hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Xem tất cả thông báo →
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
