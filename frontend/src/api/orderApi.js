import axiosClient from './axiosClient';

export const orderApi = {
  createFromCart: (courseIds, useCredit = false, voucherCode = null) => axiosClient.post('/orders/create-from-cart', { courseIds, useCredit, voucherCode }),
  validateVoucher: (code, cartItemsTotal) => axiosClient.post('/orders/validate-voucher', { code, cartItemsTotal }),
  createMoMoPayment: (courseIds, useCredit = false, voucherCode = null) => axiosClient.post('/payment/momo/create', { courseIds, useCredit, voucherCode }),
  fulfillOrder: (id) => axiosClient.put(`/orders/${id}/fulfill`),
  checkStatus: (orderCode) => axiosClient.get(`/orders/check-status/${orderCode}`),
  getMyOrders: (params) => axiosClient.get('/orders', { params }),
  getOrderDetail: (id) => axiosClient.get(`/orders/${id}`),
  cancelOrder: (id) => axiosClient.put(`/orders/${id}/cancel`),
};
