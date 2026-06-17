import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Settings, LogOut } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import { getInitials } from '../../../utils/helpers';
import { ROUTES } from '../../../utils/constants';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate(ROUTES.HOME);
  };

  if (!user) return null;

  const displayName = user.fullName || user.name || `${user.lastName || ''} ${user.firstName || ''}`.trim() || 'Aethera Student';
  const displayAvatar = user.image || user.avatarUrl;

  return (
    <div className="nav-user-menu" ref={dropdownRef}>
      <button onClick={toggleMenu} className="nav-avatar-btn" aria-label="User Menu">
        {displayAvatar ? (
          <img src={displayAvatar} alt={displayName} className="nav-avatar-img" />
        ) : (
          <div className="nav-avatar-initials">{getInitials(displayName)}</div>
        )}
      </button>

      {isOpen && (
        <div className="nav-dropdown">
          <div className="dropdown-header">
            <p className="dropdown-name">{displayName}</p>
            <p className="dropdown-email">{user.email}</p>
          </div>
          <hr className="dropdown-divider" />
          <ul className="dropdown-list">
            <li>
              <Link to={ROUTES.DASHBOARD} onClick={() => setIsOpen(false)} className="dropdown-item">
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to={ROUTES.MY_COURSES} onClick={() => setIsOpen(false)} className="dropdown-item">
                <BookOpen size={16} />
                <span>My Courses</span>
              </Link>
            </li>
            <li>
              <Link to={ROUTES.SETTINGS} onClick={() => setIsOpen(false)} className="dropdown-item">
                <Settings size={16} />
                <span>Settings</span>
              </Link>
            </li>
            <hr className="dropdown-divider" />
            <li>
              <button onClick={handleLogout} className="dropdown-item dropdown-logout">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
