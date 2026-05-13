import express from 'express';
import { updateProfile, getProfile } from '../controllers/userController';
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
    getProfile
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
