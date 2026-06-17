import { Link, NavLink } from 'react-router-dom';
import { Sparkles, LogIn } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import SearchBar from './SearchBar';
import CartIcon from './CartIcon';
import NotificationBell from './NotificationBell';
import UserMenu from './UserMenu';
import Button from '../Button/Button';
import { ROUTES } from '../../../utils/constants';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="navbar glass">
      <div className="container nav-container">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="nav-logo">
          <Sparkles className="nav-logo-icon" size={24} />
          <span className="nav-logo-text">Aethera</span>
        </Link>

        {/* Explore Links */}
        <nav className="nav-links">
          <NavLink
            to={ROUTES.COURSES}
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link-active' : 'nav-link'
            }
          >
            Explore
          </NavLink>
        </nav>

        {/* Search */}
        <div className="nav-search-section">
          <SearchBar />
        </div>

        {/* User / Auth Controls */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <CartIcon />
              <NotificationBell />
              <UserMenu />
            </>
          ) : (
            <div className="nav-auth-buttons">
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm" icon={LogIn}>
                  Sign In
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button variant="primary" size="sm">
                  Join Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
