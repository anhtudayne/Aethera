import axiosClient from '../api/axiosConfig';

export const validateCoupon = async (code, cartTotal) => {
    try {
        const response = await axiosClient.post('/coupons/validate', { code, cartTotal });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
