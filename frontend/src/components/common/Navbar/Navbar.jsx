import { Link, NavLink, useLocation } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import SearchBar from './SearchBar';
import CartIcon from './CartIcon';
import NotificationBell from './NotificationBell';
import UserMenu from './UserMenu';
import { ROUTES } from '../../../utils/constants';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isCheckoutPage = location.pathname === ROUTES.CHECKOUT;

  if (isCheckoutPage) {
    return (
      <header className="navbar navbar-checkout-minimal">
        <div className="container nav-container">
          <Link to={ROUTES.HOME} className="nav-logo">
            <Sparkles className="nav-logo-icon" size={20} />
            <span className="nav-logo-text">Aethera</span>
          </Link>
          <Link to={ROUTES.CART} className="nav-checkout-cancel">
            Cancel
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Left Section: Logo & Main Navigation Links */}
        <div className="nav-left-section">
          <Link to={ROUTES.HOME} className="nav-logo">
            <Sparkles className="nav-logo-icon" size={20} />
            <span className="nav-logo-text">Aethera</span>
          </Link>

          <nav className="nav-links-left">
            <NavLink
              to={ROUTES.COURSES}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              Explore Courses
            </NavLink>
            <NavLink
              to={ROUTES.CERTIFICATE_VERIFY}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              Verify Certificate
            </NavLink>
          </nav>
        </div>

        {/* Center Section: Search Bar */}
        <div className="nav-search-section">
          <SearchBar />
        </div>

        {/* Right Section: User Actions */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              {/* Instructor link */}
              {(user?.role === 'instructor' || user?.roleId === 'instructor') ? (
                <Link to={ROUTES.INSTRUCTOR_DASHBOARD} className="nav-text-link">
                  Instructor
                </Link>
              ) : (
                <Link to="/" className="nav-text-link">
                  Teach on Aethera
                </Link>
              )}

              {/* Admin link if applicable */}
              {(user?.roleId === 'admin' || user?.role === 'admin') && (
                <Link to={ROUTES.ADMIN_DASHBOARD} className="nav-text-link">
                  Admin
                </Link>
              )}

              {/* My Learning link */}
              <Link to={ROUTES.MY_COURSES} className="nav-text-link">
                My Learning
              </Link>

              {/* Wishlist Link */}
              <Link to={ROUTES.WISHLIST} className="nav-icon-link nav-wishlist-link" aria-label="Wishlist">
                <div className="nav-icon-wrapper">
                  <Heart size={22} />
                </div>
              </Link>

              {/* Cart */}
              <CartIcon />

              {/* Notifications */}
              <NotificationBell />

              {/* User Avatar Menu */}
              <UserMenu />
            </>
          ) : (
            <>
              <Link to="/" className="nav-text-link">
                Aethera Business
              </Link>
              <Link to={ROUTES.LOGIN} className="nav-text-link">
                Teach on Aethera
              </Link>

              <CartIcon />

              <div className="nav-auth-buttons">
                <Link to={ROUTES.LOGIN}>
                  <button className="nav-btn nav-btn-secondary">Log in</button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <button className="nav-btn nav-btn-primary">Sign up</button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
