import axiosClient from './axiosClient';

export const cartApi = {
  getCart: () => axiosClient.get('/cart'),
  getCount: () => axiosClient.get('/cart/count'),
  addToCart: (courseId) => axiosClient.post('/cart', { courseId }),
  removeItem: (id) => axiosClient.delete(`/cart/${id}`),
  clearCart: () => axiosClient.delete('/cart'),
};
