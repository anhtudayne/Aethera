import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';
import { notificationApi } from '../../api/notificationApi';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import './NotificationsPage.css';

const TYPE_ICONS = {
  order_created: '📦',
  order_paid: '✅',
  new_review: '⭐',
  course_completed: '🎓',
  certificate_issued: '🏆',
  system: '🔔',
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await notificationApi.getAll({ page: 1, limit: 50 });
        if (!cancelled) setNotifications(res.data?.notifications || res.data || []);
      } catch {
        if (!cancelled) setNotifications([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, read: true } : n))
      );
    } catch {
      // silent
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })));
    } catch {
      // silent
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationApi.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      // silent
    }
  };

  const isUnread = (n) => !n.isRead && !n.read;

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    return d.toLocaleDateString('vi-VN');
  };

  const unreadCount = notifications.filter(isUnread).length;

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2>Thông báo 🔔 {unreadCount > 0 && <span style={{ fontSize: '0.9rem', color: 'var(--color-accent)' }}>({unreadCount} chưa đọc)</span>}</h2>
        {unreadCount > 0 && (
          <button className="mark-all-btn" onClick={handleMarkAllRead}>
            <CheckCheck size={16} /> Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <span>Đang tải...</span>
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Không có thông báo nào"
          description="Thông báo mới sẽ hiển thị ở đây khi có cập nhật."
        />
      ) : (
        <div className="notifications-list">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${isUnread(n) ? 'notification-item--unread' : ''}`}
              onClick={() => isUnread(n) && handleMarkRead(n.id)}
            >
              <div className="notification-icon">{TYPE_ICONS[n.type] || '🔔'}</div>
              <div className="notification-body">
                <div className="notification-message">{n.message || n.content}</div>
                <div className="notification-time">{formatTime(n.createdAt)}</div>
              </div>
              <div className="notification-actions">
                {isUnread(n) && (
                  <button
                    className="notification-action-btn"
                    onClick={(e) => { e.stopPropagation(); handleMarkRead(n.id); }}
                    title="Đánh dấu đã đọc"
                  >
                    <Check size={16} />
                  </button>
                )}
                <button
                  className="notification-action-btn delete"
                  onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
