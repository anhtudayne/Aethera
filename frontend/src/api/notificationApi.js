import axiosClient from './axiosClient';

export const notificationApi = {
  getAll: (params) => axiosClient.get('/notifications', { params }),
  getUnreadCount: () => axiosClient.get('/notifications/unread-count'),
  markAsRead: (id) => axiosClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => axiosClient.put('/notifications/read-all'),
  delete: (id) => axiosClient.delete(`/notifications/${id}`),
};
