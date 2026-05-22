import axiosClient from '../api/axiosConfig';

export const createOrderFromCart = async () => {
    const response = await axiosClient.post('/orders/create-from-cart');
    return response.data;
};

export const checkOrderStatus = async (orderCode) => {
    const response = await axiosClient.get(`/orders/check-status/${orderCode}`);
    return response.data;
};
