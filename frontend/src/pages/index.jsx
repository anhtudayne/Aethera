import { Link } from 'react-router-dom';
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

// Admin pages
import AdminDashboardPage from './admin/Dashboard';
import CourseApprovalsPage from './admin/CourseApprovalsPage';
import UsersManagementPage from './admin/UsersManagementPage';
import PayoutsManagementPage from './admin/PayoutsManagementPage';
import MarketingManagementPage from './admin/MarketingManagementPage';

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
  AdminDashboardPage,
  CourseApprovalsPage,
  UsersManagementPage,
  PayoutsManagementPage,
  MarketingManagementPage,
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
import { useEffect } from 'react';
import { userApi } from '../api/userApi';

export const CoursePlayerPage = () => {
  useEffect(() => {
    // Điểm danh và cộng 5 phút học tập mẫu khi mở Course Player
    const logInitialActivity = async () => {
      try {
        await userApi.logStreakActivity(5);
      } catch (err) {
        console.error('Failed to log streak activity', err);
      }
    };
    logInitialActivity();

    // Trong thực tế, sẽ gọi API mỗi phút khi video đang phát
    const interval = setInterval(() => {
      userApi.logStreakActivity(1).catch(console.error);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: '#0F172A', color: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Course Player Placeholder</h3>
        <Link to={ROUTES.DASHBOARD} style={{ color: '#6366F1', fontSize: '0.9rem' }}>Back to Dashboard</Link>
      </div>
      <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '48px' }}>
        <div style={{ width: '100%', maxWidth: '800px', aspectRatio: '16/9', background: '#1E293B', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <BookOpen size={48} style={{ color: '#6366F1', marginBottom: '16px' }} />
          <p>Lecture Video and Notes Workspace will render here in Stage F5.</p>
        </div>
      </div>
    </div>
  );
};

// ── 404 Page ────
export const NotFoundPage = () => (
  <StubContainer title="Page Not Found" subtitle="Sorry, the page you are looking for does not exist or has been moved." icon={AlertTriangle}>
    <Link to={ROUTES.HOME}><Button variant="primary">Return Home</Button></Link>
  </StubContainer>
);
