import { getAdminCourses, updateCourseStatus, getCourseStatusHistory } from '../services/adminCourseService';
import { getCoursePreview } from '../services/adminCoursePreviewService';

/**
 * Controller: Lấy danh sách khóa học cho Admin quản lý
 */
export const handleGetAdminCourses = async (req, res, next) => {
    try {
        const result = await getAdminCourses(req.query);
        return res.status(result.status || 200).json(result);
    } catch (err) {
        console.error('Controller - Lỗi lấy danh sách khóa học admin:', err);
        next(err);
    }
};

/**
 * Controller: Cập nhật trạng thái khóa học (Duyệt / Từ chối)
 */
export const handleUpdateCourseStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, reasons } = req.body;
        const adminId = req.user ? req.user.id : null;
        
        if (!status) {
            return res.status(400).json({ status: 400, message: 'Vui lòng cung cấp trạng thái mới.' });
        }

        const result = await updateCourseStatus(id, status, reasons, adminId);
        return res.status(result.status || 200).json(result);
    } catch (err) {
        console.error('Controller - Lỗi cập nhật trạng thái khóa học:', err);
        next(err);
    }
};

/**
 * Controller: Lấy lịch sử thay đổi trạng thái của khóa học
 */
export const handleGetCourseHistory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await getCourseStatusHistory(id);
        return res.status(result.status || 200).json(result);
    } catch (err) {
        console.error('Controller - Lỗi lấy lịch sử trạng thái:', err);
        next(err);
    }
};

export const handleGetCoursePreview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await getCoursePreview(id);
        return res.status(result.status || 200).json(result);
    } catch (err) {
        console.error('Controller - Lỗi lấy admin course preview:', err);
        next(err);
    }
};
