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
} from 'lucide-react';
import Navbar from '../common/Navbar/Navbar';
import { ROUTES } from '../../utils/constants';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const sidebarLinks = [
    { to: ROUTES.DASHBOARD, label: 'Overview', icon: LayoutDashboard, end: true },
    { to: ROUTES.MY_COURSES, label: 'My Courses', icon: BookOpen },
    { to: ROUTES.WISHLIST, label: 'Wishlist', icon: Heart },
    { to: ROUTES.ORDERS, label: 'Purchase History', icon: ShoppingBag },
    { to: ROUTES.CERTIFICATES, label: 'Certificates', icon: Award },
    { to: ROUTES.MY_REVIEWS, label: 'My Reviews', icon: MessageSquare },
    { to: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: Bell },
    { to: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
  ];

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
