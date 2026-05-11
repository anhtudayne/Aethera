import api from '../api/axiosConfig';

export const getUserProfile = () => api.get('/user/profile');
export const updateUserProfile = (data) => api.put('/user/profile', data);

export const getAdminProfile = () => api.get('/admin/profile');
export const updateAdminProfile = (data) => api.put('/admin/profile', data);

// Helper function to call the right API based on role
export const getProfileByRole = (role) => {
    return role === 'admin' ? getAdminProfile() : getUserProfile();
};

export const updateProfileByRole = (role, data) => {
    return role === 'admin' ? updateAdminProfile(data) : updateUserProfile(data);
};

export const uploadAvatar = (formData) => {
    return api.post('/upload/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
