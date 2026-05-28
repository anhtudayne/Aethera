import axiosClient from '../api/axiosConfig';

export const createReview = async (data) => {
    const response = await axiosClient.post('/reviews', data);
    return response.data;
};

export const getCourseReviews = async (courseId, page = 1, limit = 10) => {
    const response = await axiosClient.get(`/reviews/course/${courseId}`, { params: { page, limit } });
    return response.data;
};

export const getMyReviews = async () => {
    const response = await axiosClient.get('/reviews/my-reviews');
    return response.data;
};

export const checkCanReview = async (courseId) => {
    const response = await axiosClient.get(`/reviews/can-review/${courseId}`);
    return response.data;
};
