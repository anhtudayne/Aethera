import * as adminSettingsService from '../services/adminSettingsService';

export const handleGetSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const result = await adminSettingsService.getSetting(key);
        return res.status(result.status || 200).json(result);
    } catch (error) {
        console.error('Controller - Lỗi lấy cài đặt:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};

export const handleUpdateSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        
        if (value === undefined) {
            return res.status(400).json({
                status: 400,
                message: 'Thiếu tham số value'
            });
        }

        const result = await adminSettingsService.updateSetting(key, value);
        return res.status(result.status || 200).json(result);
    } catch (error) {
        console.error('Controller - Lỗi cập nhật cài đặt:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};
