import { getVouchers, createVoucher, updateVoucherStatus, updateVoucher } from '../services/adminMarketingService';

export const handleGetVouchers = async (req, res) => {
    try {
        const result = await getVouchers(req.query);
        return res.status(result.status || 200).json(result);
    } catch (error) {
        console.error('Controller - Lỗi lấy danh sách vouchers:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};

export const handleCreateVoucher = async (req, res) => {
    try {
        const result = await createVoucher(req.body);
        return res.status(result.status || 201).json(result);
    } catch (error) {
        console.error('Controller - Lỗi tạo voucher:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};

export const handleUpdateVoucherStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const result = await updateVoucherStatus(id, status);
        return res.status(result.status || 200).json(result);
    } catch (error) {
        console.error('Controller - Lỗi cập nhật trạng thái voucher:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};

export const handleUpdateVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await updateVoucher(id, req.body);
        return res.status(result.status || 200).json(result);
    } catch (error) {
        console.error('Controller - Lỗi cập nhật voucher:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};

export const handleUploadBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: 'Vui lòng chọn file hình ảnh'
            });
        }

        // We assume Cloudinary middleware has already processed the file and put the URL in req.file.path
        const bannerUrl = req.file.path;

        return res.status(200).json({
            status: 200,
            message: 'Upload banner thành công',
            data: {
                url: bannerUrl
            }
        });
    } catch (error) {
        console.error('Controller - Lỗi upload banner:', error);
        return res.status(500).json({
            status: 500,
            message: 'Lỗi server nội bộ. Vui lòng thử lại sau.',
        });
    }
};
