import axiosClient from './axiosClient';

export const dashboardApi = {
  getDashboard: () => axiosClient.get('/user/dashboard'),
};
