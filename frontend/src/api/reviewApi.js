import axiosClient from './axiosClient';

export const reviewApi = {
  getByCourseId: (courseId, params) => axiosClient.get(`/reviews/course/${courseId}`, { params }),
};
