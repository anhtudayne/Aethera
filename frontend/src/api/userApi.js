import axiosClient from './axiosClient';

export const userApi = {
  getProfile: () => axiosClient.get('/user/profile'),
  updateProfile: (data) => axiosClient.put('/user/profile', data),
  getStreak: () => axiosClient.get('/user/streak'),
  logStreakActivity: (minutes) => axiosClient.post('/user/streak/activity', { minutes }),
};
