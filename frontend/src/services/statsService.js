import api from '../api/axiosConfig';

export const getDashboardStatsService = (startDate, endDate) => {
    let url = '/stats/dashboard';
    if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return api.get(url);
};
