import express from 'express';
import { updateProfile, getProfile } from '../controllers/userController';
import { handleGetAdminDashboard } from '../controllers/dashboardController';
import { updateProfileLimiter } from '../middlewares/rateLimiter';
import { verifyToken } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/authorizeMiddleware';
import { ROLES } from '../utils/constants';
import { updateProfileValidation } from '../middlewares/validators/userValidator';
import { handleValidationErrors } from '../middlewares/validators/authValidator';
import { handleGetAdminCourses, handleUpdateCourseStatus, handleGetCourseHistory, handleGetCoursePreview } from '../controllers/adminCourseController';
import { handleGetAdminUsers, handleUpdateUserStatus, handleGetInstructorApplications, handleUpdateInstructorApplication } from '../controllers/adminUserController';
import { handleGetPayouts, handleMarkAsPaid, handleRejectPayout } from '../controllers/adminPayoutController';
import { handleGetSetting, handleUpdateSetting } from '../controllers/adminSettingsController';
import { handleGetVouchers, handleCreateVoucher, handleUpdateVoucherStatus, handleUpdateVoucher, handleUploadBanner } from '../controllers/adminMarketingController';
import { handleGetAdminCategories, handleCreateCategory, handleUpdateCategory } from '../controllers/adminCategoryController';
import { getAllTickets, updateTicketStatus, updateInternalNote, updateAdminResponse } from '../controllers/adminTicketController';
import { getRefundRequests, completeRefundTransfer } from '../controllers/adminRefundController';
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

// Quản lý đơn đăng ký giảng viên
router.get(
    '/instructor-applications',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleGetInstructorApplications
);

router.put(
    '/instructor-applications/:id',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleUpdateInstructorApplication
);

// Lấy lịch sử thay đổi trạng thái khóa học
router.get(
    '/courses/:id/history',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleGetCourseHistory
);

// Xem trước khóa học
router.get(
    '/courses/:id/preview',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleGetCoursePreview
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

import { handleBulkPayout } from '../controllers/bulkPayoutController';
router.post(
    '/payouts/bulk',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    handleBulkPayout
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



// Quản lý Support Tickets (Refund / Report)
router.get(
    '/tickets',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    getAllTickets
);

router.patch(
    '/tickets/:id/status',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    updateTicketStatus
);

router.patch(
    '/tickets/:id/note',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    updateInternalNote
);

router.patch(
    '/tickets/:id/response',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    updateAdminResponse
);

// Quản lý Refunds (Admin)
router.get(
    '/refunds',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    getRefundRequests
);

router.patch(
    '/refunds/:id/complete',
    verifyToken,
    authorizeRole(ROLES.ADMIN),
    completeRefundTransfer
);

export default router;
