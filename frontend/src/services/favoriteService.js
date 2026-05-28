import api from '../api/axiosConfig';

export const getFavoritesService = () => api.get('/favorites');
export const toggleFavoriteService = (courseId) => api.post('/favorites/toggle', { courseId });
