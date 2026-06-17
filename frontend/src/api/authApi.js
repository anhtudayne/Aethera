import axiosClient from './axiosClient';

export const authApi = {
  register: (data) => axiosClient.post('/auth/register', data),
  verifyOTP: (data) => axiosClient.post('/auth/verify-otp', data),
  resendOTP: (data) => axiosClient.post('/auth/resend-otp', data),
  login: (data) => axiosClient.post('/auth/login', data),
  googleLogin: (data) => axiosClient.post('/auth/google', data),
  forgotPassword: (data) => axiosClient.post('/auth/forgot-password', data),
  resetPassword: (data) => axiosClient.post('/auth/reset-password', data),
  changePassword: (data) => axiosClient.put('/auth/change-password', data),
};
