import axiosClient from './axiosClient';

export const reviewApi = {
  getByCourseId: (courseId, params) => axiosClient.get(`/reviews/course/${courseId}`, { params }),
  getMyReviews: () => axiosClient.get('/reviews/my-reviews'),
  create: (data) => axiosClient.post('/reviews', data),
  checkCanReview: (courseId) => axiosClient.get(`/reviews/can-review/${courseId}`),
};
