import express from 'express';
import { updateProfile, getProfile, getStreak, logActivity } from '../controllers/userController';
import { updateProfileLimiter } from '../middlewares/rateLimiter';
import { verifyToken } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/authorizeMiddleware';
import { updateProfileValidation } from '../middlewares/validators/userValidator';
import { handleValidationErrors } from '../middlewares/validators/authValidator';

const router = express.Router();

router.put('/profile', updateProfileLimiter, verifyToken, updateProfileValidation, handleValidationErrors, updateProfile);
router.get('/profile', verifyToken, getProfile);

router.get('/streak', verifyToken, getStreak);
router.post('/streak/activity', verifyToken, logActivity);

export default router;
