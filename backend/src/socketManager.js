import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io = null;

// Map userId -> Set of socketIds (user may have multiple tabs)
const userSockets = new Map();

/**
 * Initialize Socket.IO server attached to the HTTP server.
 */
export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // JWT authentication middleware for WebSocket handshake
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error('Authentication error: Token required'));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            socket.userRole = decoded.roleId;
            next();
        } catch (err) {
            return next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.userId;
        console.log(`🔌 Socket connected: userId=${userId}, socketId=${socket.id}`);

        // Register user -> socket mapping
        if (!userSockets.has(userId)) {
            userSockets.set(userId, new Set());
        }
        userSockets.get(userId).add(socket.id);

        // Join a user-specific room for easy targeting
        socket.join(`user_${userId}`);

        socket.on('disconnect', () => {
            console.log(`🔌 Socket disconnected: userId=${userId}, socketId=${socket.id}`);
            const sockets = userSockets.get(userId);
            if (sockets) {
                sockets.delete(socket.id);
                if (sockets.size === 0) {
                    userSockets.delete(userId);
                }
            }
        });
    });

    console.log('✅ Socket.IO server initialized');
    return io;
};

/**
 * Get the Socket.IO server instance.
 */
export const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized. Call initSocket(httpServer) first.');
    }
    return io;
};

/**
 * Emit an event to a specific user (across all their connected sockets/tabs).
 */
export const emitToUser = (userId, event, data) => {
    if (!io) return;
    io.to(`user_${userId}`).emit(event, data);
};
