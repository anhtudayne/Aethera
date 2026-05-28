import api from '../api/axiosConfig';

export const addViewedCourseService = (courseId) => api.post('/viewed/add', { courseId });
export const getViewedCoursesService = () => api.get('/viewed');
