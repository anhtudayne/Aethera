import axiosClient from './axiosClient';

export const ticketApi = {
  getMyEnrolledCourses: () => axiosClient.get('/tickets/my-enrolled-courses'),
  createTicket: (data) => axiosClient.post('/tickets', data),
  getMyTickets: () => axiosClient.get('/tickets/my-tickets'),
  uploadEvidence: (formData) => axiosClient.post('/tickets/upload-evidence', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};
