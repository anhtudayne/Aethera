import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/authorizeMiddleware';

const router = express.Router();

router.get(
    '/profile',
    verifyToken,
    authorizeRole('admin'),
    (req, res) => {
        return res.status(200).json({
            status: 200,
            message: 'Chào mừng Admin!',
            user: req.user
        });
    }
);

export default router;
