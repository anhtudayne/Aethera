import express from 'express';
import { updateProfile } from '../controllers/userController';
import { updateProfileLimiter } from '../middlewares/rateLimiter';
import { verifyToken } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/authorizeMiddleware';
import { updateProfileValidation } from '../middlewares/validators/userValidator';
import { handleValidationErrors } from '../middlewares/validators/authValidator';

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

// Cho phép Admin tự sửa profile của mình
router.put(
    '/profile',
    updateProfileLimiter,
    verifyToken,
    authorizeRole('admin'),
    updateProfileValidation,
    handleValidationErrors,
    updateProfile
);

export default router;
