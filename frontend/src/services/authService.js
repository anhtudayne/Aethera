import api from '../api/axiosConfig';

export const registerService = (data) => api.post('/auth/register', data);

export const verifyOtpService = (data) => api.post('/auth/verify-otp', data);

export const resendOtpService = (data) => api.post('/auth/resend-otp', data);

export const loginService = (data) => api.post('/auth/login', data);

export const forgotPasswordService = (data) => api.post('/auth/forgot-password', data);

export const resetPasswordService = (data) => api.post('/auth/reset-password', data);
