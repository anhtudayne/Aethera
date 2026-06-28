import axiosClient from './axiosClient';

export const adminApi = {
  // Get dashboard stats (already used in Dashboard.jsx but good to have here if needed, or kept where it is)
  
  // Courses management
  getCourses: (params) => axiosClient.get('/admin/courses', { params }),
  updateCourseStatus: (id, status, reason) => axiosClient.put(`/admin/courses/${id}/status`, { status, reason }),
  getCourseHistory: (id) => axiosClient.get(`/admin/courses/${id}/history`),
  
  // Users management
  getUsers: (params) => axiosClient.get('/admin/users', { params }),
  updateUserStatus: (id, isActive) => axiosClient.put(`/admin/users/${id}/status`, { isActive }),
  
  // Instructor applications
  getInstructorApplications: (params) => axiosClient.get('/admin/instructor-applications', { params }),
  updateInstructorApplication: (id, status, reason) => axiosClient.put(`/admin/instructor-applications/${id}`, { status, reason }),
  
  // Payouts management
  getPayouts: (params) => axiosClient.get('/admin/payouts', { params }),
  markPayoutAsPaid: (id) => axiosClient.put(`/admin/payouts/${id}/complete`),
  rejectPayout: (id, note) => axiosClient.put(`/admin/payouts/${id}/reject`, { note }),
  createBulkPayout: () => axiosClient.post('/admin/payouts/bulk'),
  
  // System Settings
  getSetting: (key) => axiosClient.get(`/admin/settings/${key}`),
  updateSetting: (key, value) => axiosClient.put(`/admin/settings/${key}`, { value }),
  
  // Marketing (Vouchers & Banners)
  getVouchers: (params) => axiosClient.get('/admin/marketing/vouchers', { params }),
  createVoucher: (data) => axiosClient.post('/admin/marketing/vouchers', data),
  updateVoucher: (id, data) => axiosClient.put(`/admin/marketing/vouchers/${id}`, data),
  updateVoucherStatus: (id, status) => axiosClient.put(`/admin/marketing/vouchers/${id}/status`, { status }),
  uploadBanner: (formData) => axiosClient.post('/admin/marketing/upload-banner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Categories management
  getCategories: (params) => axiosClient.get('/admin/categories', { params }),
  createCategory: (data) => axiosClient.post('/admin/categories', data),
  updateCategory: (id, data) => axiosClient.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => axiosClient.delete(`/admin/categories/${id}`),

  // Support Tickets management
  getTickets: (params) => axiosClient.get('/admin/tickets', { params }),
  updateTicketStatus: (id, status) => axiosClient.patch(`/admin/tickets/${id}/status`, { status }),
  updateTicketNote: (id, internalNotes) => axiosClient.patch(`/admin/tickets/${id}/note`, { internalNotes }),
  updateTicketResponse: (id, adminResponse) => axiosClient.patch(`/admin/tickets/${id}/response`, { adminResponse }),

  // Refund management
  getRefundRequests: (params) => axiosClient.get('/admin/refunds', { params }),
  completeRefundTransfer: (id, adminNote) => axiosClient.patch(`/admin/refunds/${id}/complete`, { adminNote })
};
