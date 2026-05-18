import api from '../api/axiosConfig';

export const getCoursesService = (params) => api.get('/courses', { params });
export const getFeaturedService = () => api.get('/courses/featured');
export const getNewArrivalsService = () => api.get('/courses/new-arrivals');
export const getBestSellersService = () => api.get('/courses/best-sellers');
export const getCourseBySlugService = (slug) => api.get(`/courses/${slug}`);
export const getRelatedCoursesService = (id) => api.get(`/courses/${id}/related`);
export const getCategoriesService = () => api.get('/categories');
export const getCoursesByCategoryService = (slug, page = 1, limit = 6) => api.get(`/courses/category/${slug}`, { params: { page, limit } });

