import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Tạo thư mục nếu chưa có
const uploadDir = path.join(__dirname, '../../public/uploads/avatars');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file định dạng ảnh (JPG, PNG, GIF)!'));
        }
    }
});

router.post('/avatar', upload.single('avatar'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 400, message: 'Vui lòng chọn ảnh' });
        }
        
        // Trả về URL public có thể truy cập được từ frontend
        const imageUrl = `http://localhost:8089/uploads/avatars/${req.file.filename}`;
        
        return res.status(200).json({
            status: 200,
            message: 'Tải ảnh lên thành công!',
            imageUrl: imageUrl
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message || 'Lỗi khi tải ảnh lên.' });
    }
});

export default router;
