import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import axiosClient from '../../../api/axiosClient';
import useAuth from '../../../hooks/useAuth';
import { getSocket } from '../../../socket';

const NotificationBell = () => {
  const { isAuthenticated, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axiosClient.get('/notifications/unread-count');
      const count = typeof response === 'number' ? response : (response?.count ?? response?.data?.count ?? 0);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load notification unread count:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      Promise.resolve().then(() => setUnreadCount(0));
      return;
    }

    const timer = setTimeout(() => {
      fetchUnreadCount();
    }, 0);

    const interval = setInterval(fetchUnreadCount, 60000); // Polling backup

    // Listen to real-time events via Socket
    const socket = getSocket();
    const handleNewNotification = () => {
      setUnreadCount((prev) => prev + 1);
    };

    if (socket) {
      socket.on('newNotification', handleNewNotification);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      if (socket) {
        socket.off('newNotification', handleNewNotification);
      }
    };
  }, [isAuthenticated, user, fetchUnreadCount]);

  return (
    <Link to="/dashboard/notifications" className="nav-icon-link" aria-label="Notifications">
      <div className="nav-icon-wrapper">
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="nav-badge alert-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
    </Link>
  );
};

export default NotificationBell;
