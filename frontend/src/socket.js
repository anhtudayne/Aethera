import { io } from 'socket.io-client';

let socket = null;

/**
 * Initialize and connect Socket.IO client
 * @param {number|string} userId 
 * @returns {Socket}
 */
export const connectSocket = (userId) => {
  if (socket) return socket;

  const apiBase = import.meta.env.VITE_API_URL || '/';
  
  // Connect to the backend socket
  socket = io(apiBase, {
    query: { userId },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket.IO connected: ', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket.IO disconnected');
  });

  socket.on('connect_error', (error) => {
    console.warn('Socket connection error:', error.message);
  });

  return socket;
};

/**
 * Disconnect socket and clear reference
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get active socket instance
 * @returns {Socket|null}
 */
export const getSocket = () => socket;
