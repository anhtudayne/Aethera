import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import AuthLayout from './components/layouts/AuthLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ROUTES } from './utils/constants';
import {
  HomePage,
  CourseListingPage,
  CourseDetailPage,
  CategoryPage,
  CertificateVerifyPage,
  LoginPage,
  RegisterPage,
  OTPPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  CartPage,
  CheckoutPage,
  OrderSuccessPage,
  CoursePlayerPage,
  DashboardPage,
  MyCoursesPage,
  WishlistPage,
  OrderHistoryPage,
  OrderDetailPage,
  MyCertificatesPage,
  MyReviewsPage,
  NotificationsPage,
  ProfileSettingsPage,
  NotFoundPage,
  AdminDashboardPage,
  CourseApprovalsPage,
  UsersManagementPage,
  PayoutsManagementPage,
  MarketingManagementPage
} from './pages';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public Routes — MainLayout */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.COURSES} element={<CourseListingPage />} />
        <Route path={ROUTES.COURSE_DETAIL} element={<CourseDetailPage />} />
        <Route path={ROUTES.CATEGORY} element={<CategoryPage />} />
        <Route path={ROUTES.CERTIFICATE_VERIFY} element={<CertificateVerifyPage />} />
      </Route>

      {/* Authentication Routes — AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.VERIFY_OTP} element={<OTPPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
      </Route>

      {/* Protected Routes — Guarded by ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        {/* Checkout flow with Header & Footer */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.CART} element={<CartPage />} />
          <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
          <Route path={ROUTES.ORDER_SUCCESS} element={<OrderSuccessPage />} />
        </Route>

        {/* Course video player — minimal design, no footer */}
        <Route path={ROUTES.COURSE_PLAYER} element={<CoursePlayerPage />} />

        {/* Student/Admin Dashboard area — DashboardLayout with sidebar */}
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.ADMIN_COURSE_APPROVALS} element={<CourseApprovalsPage />} />
          <Route path={ROUTES.ADMIN_USERS} element={<UsersManagementPage />} />
          <Route path={ROUTES.ADMIN_PAYOUTS} element={<PayoutsManagementPage />} />
          <Route path={ROUTES.ADMIN_MARKETING} element={<MarketingManagementPage />} />
          <Route path={ROUTES.MY_COURSES} element={<MyCoursesPage />} />
          <Route path={ROUTES.WISHLIST} element={<WishlistPage />} />
          <Route path={ROUTES.ORDERS} element={<OrderHistoryPage />} />
          <Route path={ROUTES.ORDER_DETAIL} element={<OrderDetailPage />} />
          <Route path={ROUTES.CERTIFICATES} element={<MyCertificatesPage />} />
          <Route path={ROUTES.MY_REVIEWS} element={<MyReviewsPage />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
          <Route path={ROUTES.SETTINGS} element={<ProfileSettingsPage />} />
        </Route>
      </Route>

      {/* 404 Not Found Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
