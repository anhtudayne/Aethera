import axiosClient from '../api/axiosConfig';

export const createOrderFromCart = async (usePoints = 0) => {
    const response = await axiosClient.post('/orders/create-from-cart', { usePoints });
    return response.data;
};

export const checkOrderStatus = async (orderCode) => {
    const response = await axiosClient.get(`/orders/check-status/${orderCode}`);
    return response.data;
};

export const getMyOrders = async () => {
    const response = await axiosClient.get('/orders');
    return response.data;
};

export const getOrderDetails = async (orderId) => {
    const response = await axiosClient.get(`/orders/${orderId}`);
    return response.data;
};

export const cancelOrder = async (orderId) => {
    const response = await axiosClient.put(`/orders/${orderId}/cancel`);
    return response.data;
};
