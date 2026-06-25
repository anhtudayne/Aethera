import axiosClient from './axiosClient';

export const refundApi = {
  getMyRequests: () => axiosClient.get('/refunds/my-requests'),
  checkRefundEligibility: (courseId) => axiosClient.get(`/refunds/check/${courseId}`),
  createRefund: (data) => axiosClient.post('/refunds', data),
};
