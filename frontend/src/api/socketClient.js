import { io } from 'socket.io-client';

let socket = null;

/**
 * Connect to the Socket.IO server with JWT authentication.
 */
export const connectSocket = (token) => {
    if (socket?.connected) {
        return socket;
    }

    // Connect to the backend server (auto-detect from current host in production,
    // or use localhost:8089 for dev)
    const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8089';

    socket = io(serverUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 2000,
        reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
        console.log('🔌 Socket.IO connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
        console.log('🔌 Socket.IO disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
        console.error('🔌 Socket.IO connection error:', error.message);
    });

    return socket;
};

/**
 * Disconnect from the Socket.IO server.
 */
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log('🔌 Socket.IO disconnected (manual)');
    }
};

/**
 * Get the current socket instance.
 */
export const getSocket = () => socket;

/**
 * Listen for new notification events.
 */
export const onNotification = (callback) => {
    if (socket) {
        socket.on('new_notification', callback);
    }
};

/**
 * Listen for unread count updates.
 */
export const onUnreadCount = (callback) => {
    if (socket) {
        socket.on('unread_count', callback);
    }
};

/**
 * Remove notification listener.
 */
export const offNotification = () => {
    if (socket) {
        socket.off('new_notification');
    }
};

/**
 * Remove unread count listener.
 */
export const offUnreadCount = () => {
    if (socket) {
        socket.off('unread_count');
    }
};
