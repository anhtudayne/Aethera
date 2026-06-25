import { Link, useSearchParams, useParams } from 'react-router-dom';
import { Sparkles, BookOpen, AlertTriangle } from 'lucide-react';
import { ROUTES } from '../utils/constants';
import Button from '../components/common/Button/Button';

// ── Helpers for Stubs ────
const StubContainer = ({ title, subtitle, icon: Icon = Sparkles, children }) => (
  <div className="container" style={{ padding: '80px 24px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', marginBottom: '24px' }}>
      <Icon size={28} />
    </div>
    <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '12px' }}>{title}</h2>
    <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>{subtitle}</p>
    {children}
  </div>
);

// ── Real page imports ────
import HomePage from './Home/HomePage';
import CourseListingPage from './Courses/CourseListingPage';
import CourseDetailPage from './CourseDetail/CourseDetailPage';
import CategoryPage from './Category/CategoryPage';
import LoginPage from './Auth/LoginPage';
import RegisterPage from './Auth/RegisterPage';
import OTPPage from './Auth/OTPVerificationPage';
import ForgotPasswordPage from './Auth/ForgotPasswordPage';
import ResetPasswordPage from './Auth/ResetPasswordPage';
import CartPage from './Cart/CartPage';
import CheckoutPage from './Checkout/CheckoutPage';
import OrderSuccessPage from './Checkout/OrderSuccessPage';
import RefundRequestPage from './Refund/RefundRequestPage';
import RefundSuccessPage from './Refund/RefundSuccessPage';
import CreditBalancePage from './CreditBalance/CreditBalancePage';

// Admin pages
import AdminDashboardPage from './admin/Dashboard';
import CourseApprovalsPage from './admin/CourseApprovalsPage';
import UsersManagementPage from './admin/UsersManagementPage';
import PayoutsManagementPage from './admin/PayoutsManagementPage';
import MarketingManagementPage from './admin/MarketingManagementPage';
import CategoryManagementPage from './admin/CategoryManagementPage';
import TicketManagementPage from './admin/TicketManagementPage';

// Instructor pages
import InstructorDashboardPage from './instructor/InstructorDashboardPage';
import InstructorCourseCreatePage from './instructor/InstructorCourseCreatePage';
import InstructorCourseManagePage from './instructor/InstructorCourseManagePage';
import InstructorCourseCurriculumPage from './instructor/InstructorCourseCurriculumPage';

// ── Dashboard / User pages (REAL implementations) ────
import DashboardPageReal from './Dashboard/DashboardPage';
import MyCoursesPage from './MyCourses/MyCoursesPage';
import WishlistPage from './Wishlist/WishlistPage';
import OrderHistoryPage from './Orders/OrderHistoryPage';
import OrderDetailPage from './Orders/OrderDetailPage';
import MyCertificatesPage from './Certificates/MyCertificatesPage';
import CertificateVerifyPage from './Certificates/CertificateVerifyPage';
import MyReviewsPage from './Reviews/MyReviewsPage';
import NotificationsPage from './Notifications/NotificationsPage';
import ProfileSettingsPage from './Settings/ProfileSettingsPage';
import SupportPage from './Support/SupportPage';

export {
  HomePage,
  CourseListingPage,
  CourseDetailPage,
  CategoryPage,
  LoginPage,
  RegisterPage,
  OTPPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  CartPage,
  CheckoutPage,
  OrderSuccessPage,
  RefundRequestPage,
  RefundSuccessPage,
  CreditBalancePage,
  AdminDashboardPage,
  CourseApprovalsPage,
  UsersManagementPage,
  PayoutsManagementPage,
  MarketingManagementPage,
  CategoryManagementPage,
  TicketManagementPage,
  InstructorDashboardPage,
  InstructorCourseCreatePage,
  InstructorCourseManagePage,
  InstructorCourseCurriculumPage,
  CertificateVerifyPage,
  MyCoursesPage,
  WishlistPage,
  OrderHistoryPage,
  OrderDetailPage,
  MyCertificatesPage,
  MyReviewsPage,
  NotificationsPage,
  ProfileSettingsPage,
  SupportPage,
};

// ── DashboardPage: Routes admin to admin, student to student ────
import { STORAGE_KEYS } from '../utils/constants';

export const DashboardPage = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin' || user?.roleId === 'admin';

  if (isAdmin) {
    return <AdminDashboardPage />;
  }

  return <DashboardPageReal />;
};

// ── Course Player ────
import CoursePlayerPage from './CoursePlayer/CoursePlayerPage';
export { CoursePlayerPage };

// ── 404 Page ────
export const NotFoundPage = () => (
  <StubContainer title="Page Not Found" subtitle="Sorry, the page you are looking for does not exist or has been moved." icon={AlertTriangle}>
    <Link to={ROUTES.HOME}><Button variant="primary">Return Home</Button></Link>
  </StubContainer>
);
