import { Outlet, NavLink, Link } from 'react-router-dom';
import { 
  MonitorPlay, 
  MessageSquare, 
  BarChart, 
  Wrench, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import UserMenu from '../common/Navbar/UserMenu';
import NotificationBell from '../common/Navbar/NotificationBell';
import { ROUTES } from '../../utils/constants';
import './InstructorLayout.css';

const InstructorLayout = () => {
  const SIDEBAR_NAV = [
    { to: ROUTES.INSTRUCTOR_DASHBOARD, icon: MonitorPlay, label: 'Courses' },
    { to: '/instructor/communications', icon: MessageSquare, label: 'Communications' },
    { to: '/instructor/performance', icon: BarChart, label: 'Performance' },
    { to: '/instructor/tools', icon: Wrench, label: 'Tools' },
    { to: '/instructor/help', icon: HelpCircle, label: 'Resources' },
  ];

  return (
    <div className="instructor-layout">
      {/* Left Sidebar */}
      <aside className="instructor-sidebar">
        <Link to={ROUTES.HOME} className="instructor-logo" title="Aethera Home">
          <Sparkles size={32} />
        </Link>
        <nav className="instructor-nav">
          {SIDEBAR_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) => 
                isActive ? 'instructor-nav-item active' : 'instructor-nav-item'
              }
            >
              <item.icon size={24} strokeWidth={1.5} />
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="instructor-main">
        {/* Top Header */}
        <header className="instructor-header">
          <div className="instructor-header-actions">
            <Link to={ROUTES.HOME} className="instructor-header-link">
              Student
            </Link>
            <NotificationBell />
            <UserMenu />
          </div>
        </header>

        {/* Page Content */}
        <div className="instructor-content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default InstructorLayout;
