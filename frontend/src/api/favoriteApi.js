import axiosClient from './axiosClient';

export const favoriteApi = {
  check: (courseId) => axiosClient.get(`/favorites/check/${courseId}`),
  toggle: (courseId) => axiosClient.post('/favorites/toggle', { courseId }),
};
