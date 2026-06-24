import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { createUserTicket, getMyTickets, getMyEnrolledCoursesForReport } from '../controllers/userTicketController';
import { uploadTicketEvidence } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use(verifyToken); // Tất cả các route yêu cầu đăng nhập

router.get('/my-enrolled-courses', getMyEnrolledCoursesForReport);
router.get('/my-tickets', getMyTickets);
router.post('/', createUserTicket);

// Route upload ảnh minh chứng (tối đa 2 ảnh)
router.post('/upload-evidence', (req, res, next) => {
    uploadTicketEvidence.array('files', 2)(req, res, (err) => {
        if (err) {
            return res.status(400).json({ status: 400, message: err.message || 'Lỗi khi tải ảnh lên.' });
        }
        next();
    });
}, (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ status: 400, message: 'Vui lòng chọn ít nhất 1 ảnh minh chứng.' });
        }
        
        const urls = req.files.map(file => file.path);
        
        return res.status(200).json({
            status: 200,
            message: 'Tải ảnh minh chứng thành công!',
            urls: urls
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message || 'Lỗi khi tải ảnh lên.' });
    }
});

export default router;
