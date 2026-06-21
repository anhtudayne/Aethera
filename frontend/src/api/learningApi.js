import axiosClient from './axiosClient';

export const learningApi = {
  getMyCourses: (params) => axiosClient.get('/learning/my-courses', { params }),
  getCourseContent: (slug) => axiosClient.get(`/learning/courses/${slug}/content`),
  markLessonComplete: (lessonId) => axiosClient.post(`/learning/lessons/${lessonId}/complete`),
};
