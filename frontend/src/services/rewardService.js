import axiosClient from '../api/axiosConfig';

export const getMyLoyaltyPoints = async () => {
    const response = await axiosClient.get('/rewards/loyalty-points');
    return response.data;
};

export const getRewardSummary = async () => {
    const response = await axiosClient.get('/rewards/summary');
    return response.data;
};
