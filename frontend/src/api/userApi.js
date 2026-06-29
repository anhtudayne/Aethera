import axiosClient from './axiosClient';

export const userApi = {
  getProfile: () => axiosClient.get('/user/profile'),
  updateProfile: (data) => axiosClient.put('/user/profile', data),
  getStreak: () => axiosClient.get('/user/streak'),
  logStreakActivity: (minutes) => axiosClient.post('/user/streak/activity', { minutes }),
  applyInstructor: (data) => axiosClient.post('/user/apply-instructor', data),
  getInstructorApplicationStatus: () => axiosClient.get('/user/instructor-application'),
  uploadAvatar: (formData) => axiosClient.post('/upload/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};
