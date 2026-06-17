import axiosClient from './axiosClient';

export const courseApi = {
  getAll: (params) => axiosClient.get('/courses', { params }),
  getFeatured: (limit = 8) => axiosClient.get('/courses/featured', { params: { limit } }),
  getNewArrivals: (limit = 8) => axiosClient.get('/courses/new-arrivals', { params: { limit } }),
  getBestSellers: (limit = 8) => axiosClient.get('/courses/best-sellers', { params: { limit } }),
  getTopViewed: (limit = 8) => axiosClient.get('/courses/top-viewed', { params: { limit } }),
  getByCategory: (slug, params) => axiosClient.get(`/courses/category/${slug}`, { params }),
  getBySlug: (slug) => axiosClient.get(`/courses/${slug}`),
  getCurriculum: (slug) => axiosClient.get(`/courses/${slug}/curriculum`),
  checkEnrollment: (slug) => axiosClient.get(`/courses/${slug}/check-enrollment`),
  incrementView: (id) => axiosClient.patch(`/courses/${id}/view`),
  getRelated: (id, limit = 4) => axiosClient.get(`/courses/${id}/related`, { params: { limit } }),
};
