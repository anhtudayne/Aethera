import axiosClient from './axiosClient';

export const instructorApi = {
  getMyCourses: (params) => axiosClient.get('/instructor/my-courses', { params }),
  createCourse: (data) => axiosClient.post('/courses', data),
  updateCourse: (id, data) => axiosClient.put(`/courses/${id}`, data),

  // Curriculum Management
  getSections: (courseId) => axiosClient.get(`/sections?courseId=${courseId}`),
  createSection: (data) => axiosClient.post('/sections', data),
  updateSection: (id, data) => axiosClient.put(`/sections/${id}`, data),
  deleteSection: (id) => axiosClient.delete(`/sections/${id}`),

  createLesson: (data) => axiosClient.post('/lessons', data),
  updateLesson: (id, data) => axiosClient.put(`/lessons/${id}`, data),
  deleteLesson: (id) => axiosClient.delete(`/lessons/${id}`),

  // Upload
  uploadCourseThumbnail: (formData) => axiosClient.post('/upload/thumbnail', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
