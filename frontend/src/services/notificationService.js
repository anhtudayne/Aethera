import api from '../api/axiosConfig';

export const getNotifications = (page = 1, limit = 20) => {
    return api.get(`/notifications?page=${page}&limit=${limit}`);
};

export const getUnreadCount = () => {
    return api.get('/notifications/unread-count');
};

export const markAsRead = (id) => {
    return api.put(`/notifications/${id}/read`);
};

export const markAllAsRead = () => {
    return api.put('/notifications/read-all');
};
