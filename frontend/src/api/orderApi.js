import axiosClient from './axiosClient';

export const orderApi = {
  createFromCart: () => axiosClient.post('/orders/create-from-cart'),
  fulfillOrder: (id) => axiosClient.put(`/orders/${id}/fulfill`),
  checkStatus: (orderCode) => axiosClient.get(`/orders/check-status/${orderCode}`),
  getMyOrders: (params) => axiosClient.get('/orders', { params }),
  getOrderDetail: (id) => axiosClient.get(`/orders/${id}`),
  cancelOrder: (id) => axiosClient.put(`/orders/${id}/cancel`),
};
