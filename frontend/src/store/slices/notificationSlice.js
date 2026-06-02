import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as notificationService from '../../services/notificationService';

// Fetch notifications (paginated)
export const fetchNotifications = createAsyncThunk(
    'notification/fetchNotifications',
    async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
        try {
            const res = await notificationService.getNotifications(page, limit);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi tải thông báo');
        }
    }
);

// Fetch unread count
export const fetchUnreadCount = createAsyncThunk(
    'notification/fetchUnreadCount',
    async (_, { rejectWithValue }) => {
        try {
            const res = await notificationService.getUnreadCount();
            return res.data.data.unreadCount;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi');
        }
    }
);

// Mark one notification as read
export const markNotificationRead = createAsyncThunk(
    'notification/markRead',
    async (id, { rejectWithValue }) => {
        try {
            await notificationService.markAsRead(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi');
        }
    }
);

// Mark all notifications as read
export const markAllNotificationsRead = createAsyncThunk(
    'notification/markAllRead',
    async (_, { rejectWithValue }) => {
        try {
            await notificationService.markAllAsRead();
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        notifications: [],
        pagination: null,
        unreadCount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        // Called when Socket.IO pushes a new notification
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
        },
        // Called when Socket.IO pushes updated unread count
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },
        // Reset state on logout
        resetNotifications: (state) => {
            state.notifications = [];
            state.pagination = null;
            state.unreadCount = 0;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload.notifications;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch unread count
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })
            // Mark one as read
            .addCase(markNotificationRead.fulfilled, (state, action) => {
                const id = action.payload;
                const notif = state.notifications.find(n => n.id === id);
                if (notif && !notif.isRead) {
                    notif.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            // Mark all as read
            .addCase(markAllNotificationsRead.fulfilled, (state) => {
                state.notifications.forEach(n => { n.isRead = true; });
                state.unreadCount = 0;
            });
    },
});

export const { addNotification, setUnreadCount, resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
