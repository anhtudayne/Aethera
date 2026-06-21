import axiosClient from './axiosClient';

export const certificateApi = {
  getMyCertificates: () => axiosClient.get('/certificates'),
  verify: (code) => axiosClient.get(`/certificates/verify/${code}`),
};
