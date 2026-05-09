import express from 'express';
import { updateProfile } from '../controllers/userController';
import { updateProfileLimiter } from '../middlewares/rateLimiter';
import { verifyToken } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/authorizeMiddleware';
import { updateProfileValidation } from '../middlewares/validators/userValidator';
import { handleValidationErrors } from '../middlewares/validators/authValidator';

const router = express.Router();

// Lớp 1: updateProfileLimiter (Rate Limit)
// Lớp 2: verifyToken (Mock Auth -> Real JWT Auth)
// Lớp 3: authorizeRole (Authorization)
// Lớp 4: updateProfileValidation & handleValidationErrors (Input Validation)
router.put(
    '/profile',
    updateProfileLimiter,
    verifyToken,
    authorizeRole('user'), // Giả sử user có quyền sửa profile của chính mình
    updateProfileValidation,
    handleValidationErrors,
    updateProfile
);

router.get(
    '/profile',
    verifyToken,
    authorizeRole('user'),
    (req, res) => {
        return res.status(200).json({
            status: 200,
            message: 'Thông tin hồ sơ người dùng',
            user: req.user
        });
    }
);

export default router;
