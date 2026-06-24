import axiosClient from "./axiosClient";

export const qaApi = {
    getQuestions: (courseId, params) => {
        return axiosClient.get(`/courses/${courseId}/questions`, { params });
    },
    createQuestion: (courseId, data) => {
        return axiosClient.post(`/courses/${courseId}/questions`, data);
    },
    getUserUpvotes: (courseId) => {
        return axiosClient.get(`/courses/${courseId}/upvotes`);
    },
    getQuestionById: (questionId) => {
        return axiosClient.get(`/questions/${questionId}`);
    },
    createAnswer: (questionId, content) => {
        return axiosClient.post(`/questions/${questionId}/answers`, { content });
    },
    toggleUpvote: (questionId) => {
        return axiosClient.post(`/questions/${questionId}/upvote`);
    }
};
