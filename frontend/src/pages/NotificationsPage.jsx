import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
} from '../store/slices/notificationSlice';

const typeIcons = {
    order_created: '📦',
    order_paid: '✅',
    new_review: '⭐',
    points_earned: '🎁',
};

const typeLabels = {
    order_created: 'Đơn hàng mới',
    order_paid: 'Thanh toán',
    new_review: 'Đánh giá',
    points_earned: 'Điểm thưởng',
};

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
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function NotificationsPage() {
    const dispatch = useDispatch();
    const { notifications, pagination, loading, unreadCount } = useSelector((state) => state.notification);
    const [filter, setFilter] = useState('all'); // 'all' | 'unread'
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchNotifications({ page: currentPage, limit: 20 }));
    }, [dispatch, currentPage]);

    const handleMarkAllRead = () => {
        dispatch(markAllNotificationsRead());
    };

    const handleMarkRead = (id) => {
        dispatch(markNotificationRead(id));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            🔔 Thông báo
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 ml-1">
                                    {unreadCount} chưa đọc
                                </span>
                            )}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Quản lý tất cả thông báo của bạn</p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                            Đánh dấu tất cả đã đọc
                        </button>
                    )}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        Tất cả ({notifications.length})
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            filter === 'unread'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        Chưa đọc ({notifications.filter(n => !n.isRead).length})
                    </button>
                </div>

                {/* Notification list */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <p className="text-base font-medium">Không có thông báo nào</p>
                            <p className="text-sm mt-1">
                                {filter === 'unread' ? 'Bạn đã đọc tất cả thông báo!' : 'Thông báo sẽ xuất hiện ở đây'}
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`flex items-start gap-4 px-5 py-4 border-b border-gray-100 last:border-b-0 transition-colors ${
                                    !notif.isRead ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-gray-50'
                                }`}
                            >
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                                    {typeIcons[notif.type] || '🔔'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                            {notif.title}
                                        </span>
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">
                                            {typeLabels[notif.type] || 'Thông báo'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{notif.message}</p>
                                    <p className="text-xs text-gray-400 mt-1.5">{timeAgo(notif.createdAt)}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {!notif.isRead && (
                                        <>
                                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                                            <button
                                                onClick={() => handleMarkRead(notif.id)}
                                                className="text-xs text-gray-400 hover:text-primary font-medium transition-colors"
                                                title="Đánh dấu đã đọc"
                                            >
                                                Đã đọc
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Trước
                        </button>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                                    page === currentPage
                                        ? 'bg-primary text-white font-bold'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= pagination.totalPages}
                            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Sau →
                        </button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
