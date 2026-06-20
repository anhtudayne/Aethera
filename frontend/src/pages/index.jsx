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
import AdminDashboardPage from './admin/Dashboard';
import CourseApprovalsPage from './admin/CourseApprovalsPage';
import UsersManagementPage from './admin/UsersManagementPage';
import PayoutsManagementPage from './admin/PayoutsManagementPage';
import MarketingManagementPage from './admin/MarketingManagementPage';

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
  MarketingManagementPage
};

export const CertificateVerifyPage = () => (
  <StubContainer title="Verify Certificate" subtitle="Check the authenticity of Aethera certificates.">
    <input type="text" placeholder="Enter Certificate Code (e.g. CERT-XXXX)" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginBottom: '16px', textAlign: 'center' }} />
    <Button variant="primary" fullWidth>Verify Code</Button>
  </StubContainer>
);

// ── Course Player ────
export const CoursePlayerPage = () => (
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

export const DashboardPage = () => {
  const userStr = localStorage.getItem('aethera_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin' || user?.roleId === 'admin';

  if (isAdmin) {
    return <AdminDashboardPage />;
  }

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>Student Dashboard</h3>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Overview of active study programs, progress and stats.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '20px', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Courses Enrolled</h4>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent)' }}>12</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Completed Programs</h4>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)' }}>4</p>
        </div>
      </div>
    </div>
  );
};

export const MyCoursesPage = () => (
  <div>
    <h3 style={{ marginBottom: '16px' }}>My Enrolled Courses</h3>
    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Click on a course program to resume video lectures.</p>
    <Link to="/learn/premium-javascript">
      <Button variant="primary">Resume Learning: Javascript</Button>
    </Link>
  </div>
);

export const WishlistPage = () => (
  <div>
    <h3 style={{ marginBottom: '16px' }}>My Wishlist</h3>
    <p style={{ color: 'var(--color-text-muted)' }}>You have no courses in your wishlist yet.</p>
  </div>
);

export const OrderHistoryPage = () => (
  <div>
    <h3 style={{ marginBottom: '16px' }}>Purchase History</h3>
    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Manage receipts and order invoices.</p>
    <Link to={`${ROUTES.ORDERS}/1`} style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>View Order #1</Link>
  </div>
);

export const OrderDetailPage = () => (
  <div>
    <h3 style={{ marginBottom: '16px' }}>Order Details</h3>
    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Invoice details of your purchase.</p>
    <Link to={ROUTES.ORDERS}><Button variant="secondary">Back to List</Button></Link>
  </div>
);

export const MyCertificatesPage = () => (
  <div>
    <h3 style={{ marginBottom: '16px' }}>My Certificates</h3>
    <p style={{ color: 'var(--color-text-muted)' }}>Complete your courses to verify program certificates here.</p>
  </div>
);

export const MyReviewsPage = () => (
  <div>
    <h3 style={{ marginBottom: '16px' }}>My Reviews</h3>
    <p style={{ color: 'var(--color-text-muted)' }}>Feedback and ratings you have written for courses.</p>
  </div>
);

export const NotificationsPage = () => (
  <div>
    <h3 style={{ marginBottom: '16px' }}>Notifications</h3>
    <p style={{ color: 'var(--color-text-muted)' }}>No unread updates.</p>
  </div>
);

export const ProfileSettingsPage = () => (
  <div>
    <h3 style={{ marginBottom: '16px' }}>Profile Settings</h3>
    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Update name, password, email or avatar configurations.</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '380px' }}>
      <input type="text" placeholder="Full Name" style={{ padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }} />
      <Button variant="primary">Save Changes</Button>
    </div>
  </div>
);

// ── 404 Page ────
export const NotFoundPage = () => (
  <StubContainer title="Page Not Found" subtitle="Sorry, the page you are looking for does not exist or has been moved." icon={AlertTriangle}>
    <Link to={ROUTES.HOME}><Button variant="primary">Return Home</Button></Link>
  </StubContainer>
);
