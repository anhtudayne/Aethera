import axiosClient from './axiosClient';

export const orderApi = {
  createFromCart: (courseIds) => axiosClient.post('/orders/create-from-cart', { courseIds }),
  createMoMoPayment: (courseIds) => axiosClient.post('/payment/momo/create', { courseIds }),
  fulfillOrder: (id) => axiosClient.put(`/orders/${id}/fulfill`),
  checkStatus: (orderCode) => axiosClient.get(`/orders/check-status/${orderCode}`),
  getMyOrders: (params) => axiosClient.get('/orders', { params }),
  getOrderDetail: (id) => axiosClient.get(`/orders/${id}`),
  cancelOrder: (id) => axiosClient.put(`/orders/${id}/cancel`),
};
