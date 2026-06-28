import { getAdminUsers, updateUserStatus, getInstructorApplications as getAppsService, updateInstructorApplication as updateAppService } from '../services/adminUserService';

export const handleGetAdminUsers = async (req, res) => {
    try {
        const result = await getAdminUsers(req.query);
        return res.status(result.status || 200).json(result);
    } catch (error) {
        console.error('Controller - Lỗi lấy danh sách user:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};

export const handleUpdateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        
        if (isActive === undefined) {
            return res.status(400).json({
                status: 400,
                message: 'Thiếu tham số isActive'
            });
        }

        const result = await updateUserStatus(id, isActive);
        return res.status(result.status || 200).json(result);
    } catch (error) {
        console.error('Controller - Lỗi cập nhật trạng thái user:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};

export const handleGetInstructorApplications = async (req, res) => {
    try {
        const result = await getAppsService(req.query);
        return res.status(result.status || 200).json(result);
    } catch (error) {
        console.error('Controller - Lỗi lấy danh sách đơn đăng ký:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};

export const handleUpdateInstructorApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        if (!data.status) {
            return res.status(400).json({
                status: 400,
                message: 'Thiếu tham số status'
            });
        }

        const result = await updateAppService(id, data);
        return res.status(result.status || 200).json(result);
    } catch (error) {
        console.error('Controller - Lỗi duyệt đơn đăng ký:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};
