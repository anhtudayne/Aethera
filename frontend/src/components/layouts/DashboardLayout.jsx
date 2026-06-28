import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Heart,
  ShoppingBag,
  Award,
  MessageSquare,
  Bell,
  Settings,
  Tag,
  Layers,
  LifeBuoy,
  Wallet,
  Briefcase
} from 'lucide-react';
import Navbar from '../common/Navbar/Navbar';
import { ROUTES, STORAGE_KEYS } from '../../utils/constants';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin' || user?.roleId === 'admin';

  const studentLinks = [
    { to: ROUTES.DASHBOARD, label: 'Overview', icon: LayoutDashboard, end: true },
    { to: ROUTES.MY_COURSES, label: 'My Courses', icon: BookOpen },
    { to: ROUTES.WISHLIST, label: 'Wishlist', icon: Heart },
    { to: ROUTES.ORDERS, label: 'Purchase History', icon: ShoppingBag },
    { to: ROUTES.CREDIT_BALANCE, label: 'Credit Balance', icon: Wallet },
    { to: ROUTES.CERTIFICATES, label: 'Certificates', icon: Award },
    { to: ROUTES.MY_REVIEWS, label: 'My Reviews', icon: MessageSquare },
    { to: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: Bell },
    { to: ROUTES.INSTRUCTOR_REGISTRATION, label: 'Trở thành Giảng viên', icon: Briefcase },
    { to: ROUTES.REPORT, label: 'Report Issue', icon: LifeBuoy },
    { to: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
  ];

  const adminLinks = [
    { to: ROUTES.DASHBOARD, label: 'Admin Dashboard', icon: LayoutDashboard, end: true },
    { to: ROUTES.ADMIN_USERS, label: 'Users Management', icon: Heart },
    { to: ROUTES.ADMIN_COURSE_APPROVALS, label: 'Course Approvals', icon: BookOpen },
    { to: ROUTES.ADMIN_INSTRUCTOR_APPROVALS, label: 'Duyệt Giảng viên', icon: Briefcase },
    { to: ROUTES.ADMIN_PAYOUTS, label: 'Payouts', icon: ShoppingBag },
    { to: ROUTES.ADMIN_CATEGORIES, label: 'Categories', icon: Layers },
    { to: ROUTES.ADMIN_MARKETING, label: 'Marketing', icon: Tag },
    { to: ROUTES.ADMIN_TICKETS, label: 'Support / Refunds', icon: LifeBuoy },
    { to: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
  ];

  const sidebarLinks = isAdmin ? adminLinks : studentLinks;

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="container dashboard-container">
        {/* Sidebar Nav */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    isActive ? 'sidebar-link sidebar-link-active' : 'sidebar-link'
                  }
                >
                  <Icon size={18} className="sidebar-icon" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Dashboard Main Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
