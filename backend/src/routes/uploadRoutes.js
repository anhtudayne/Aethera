import express from 'express';
import { uploadVideo, uploadAvatar, uploadThumbnail } from '../middlewares/uploadMiddleware.js';
import { handleUploadVideo } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/avatar', uploadAvatar.single('avatar'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 400, message: 'Vui lòng chọn ảnh' });
        }
        
        // Trả về URL từ Cloudinary
        const imageUrl = req.file.path;
        
        return res.status(200).json({
            status: 200,
            message: 'Tải ảnh lên thành công!',
            imageUrl: imageUrl
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message || 'Lỗi khi tải ảnh lên.' });
    }
});

router.post('/thumbnail', uploadThumbnail.single('thumbnail'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 400, message: 'Vui lòng chọn ảnh' });
        }
        
        const imageUrl = req.file.path;
        
        return res.status(200).json({
            status: 200,
            message: 'Tải ảnh lên thành công!',
            imageUrl: imageUrl
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message || 'Lỗi khi tải ảnh lên.' });
    }
});

router.post('/video', uploadVideo.single('video'), handleUploadVideo);

export default router;
