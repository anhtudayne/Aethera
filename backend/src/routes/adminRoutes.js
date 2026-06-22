import express from 'express';
import { updateProfile, getProfile } from '../controllers/userController';
import { handleGetAdminDashboard } from '../controllers/dashboardController';
import { updateProfileLimiter } from '../middlewares/rateLimiter';
import { verifyToken } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/authorizeMiddleware';
import { ROLES } from '../utils/constants';
import { updateProfileValidation } from '../middlewares/validators/userValidator';
import { handleValidationErrors } from '../middlewares/validators/authValidator';
import { handleGetAdminCourses, handleUpdateCourseStatus, handleGetCourseHistory } from '../controllers/adminCourseController';
import { handleGetAdminUsers, handleUpdateUserStatus } from '../controllers/adminUserController';
import { handleGetPayouts, handleMarkAsPaid, handleRejectPayout } from '../controllers/adminPayoutController';
import { handleGetSetting, handleUpdateSetting } from '../controllers/adminSettingsController';
import { handleGetVouchers, handleCreateVoucher, handleUpdateVoucherStatus, handleUpdateVoucher, handleUploadBanner } from '../controllers/adminMarketingController';
import { handleGetAdminCategories, handleCreateCategory, handleUpdateCategory, handleDeleteCategory } from '../controllers/adminCategoryController';
import uploadCloud from '../middlewares/uploadMiddleware';
const router = express.Router();

router.get(
    '/profile',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    getProfile
);

router.get(
    '/dashboard',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleGetAdminDashboard
);

// Cho phép Admin tự sửa profile của mình
router.put(
    '/profile',
    updateProfileLimiter,
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    updateProfileValidation,
    handleValidationErrors,
    updateProfile
);

// Quản lý người dùng
router.get(
    '/users',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleGetAdminUsers
);

router.put(
    '/users/:id/status',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleUpdateUserStatus
);

// Lấy lịch sử thay đổi trạng thái khóa học
router.get(
    '/courses/:id/history',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleGetCourseHistory
);

// Cập nhật trạng thái khóa học
router.put(
    '/courses/:id/status',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleUpdateCourseStatus
);

// Quản lý Payouts
router.get(
    '/payouts',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleGetPayouts
);

router.put(
    '/payouts/:id/complete',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleMarkAsPaid
);

router.put(
    '/payouts/:id/reject',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleRejectPayout
);

// Quản lý Settings
router.get(
    '/settings/:key',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleGetSetting
);

router.put(
    '/settings/:key',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleUpdateSetting
);

// Lấy danh sách khóa học
router.get(
    '/courses',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleGetAdminCourses
);

// Quản lý Marketing (Vouchers & Banners)
router.get(
    '/marketing/vouchers',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleGetVouchers
);

router.post(
    '/marketing/vouchers',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleCreateVoucher
);

router.put(
    '/marketing/vouchers/:id/status',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleUpdateVoucherStatus
);

router.put(
    '/marketing/vouchers/:id',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleUpdateVoucher
);

router.post(
    '/marketing/upload-banner',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    uploadCloud.single('banner'),
    handleUploadBanner
);

// Quản lý Categories
router.get(
    '/categories',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleGetAdminCategories
);

router.post(
    '/categories',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleCreateCategory
);

router.put(
    '/categories/:id',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleUpdateCategory
);

router.delete(
    '/categories/:id',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleDeleteCategory
);

export default router;
