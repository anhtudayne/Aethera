import express from 'express';
import { updateProfile } from '../controllers/userController';
import { updateProfileLimiter } from '../middlewares/rateLimiter';
import { verifyToken } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/authorizeMiddleware';
import { updateProfileValidation } from '../middlewares/validators/userValidator';
import { handleValidationErrors } from '../middlewares/validators/authValidator';

const router = express.Router();

// Lớp 1: updateProfileLimiter (Rate Limit)
// Lớp 2: verifyToken (Mock Auth)
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

export default router;
