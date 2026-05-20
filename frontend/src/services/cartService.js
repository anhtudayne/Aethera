import api from '../api/axiosConfig';

export const getCartService = () => api.get('/cart');
export const getCartCountService = () => api.get('/cart/count');
export const addToCartService = (courseId) => api.post('/cart', { courseId });
export const removeCartItemService = (id) => api.delete(`/cart/${id}`);
export const clearCartService = () => api.delete('/cart');
