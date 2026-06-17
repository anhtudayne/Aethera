import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import useCart from '../../../hooks/useCart';
import useAuth from '../../../hooks/useAuth';

const CartIcon = () => {
  const { cartCount } = useCart();
  const { isAuthenticated } = useAuth();

  // If not authenticated, we still show cart, but with count 0
  const displayCount = isAuthenticated ? cartCount : 0;

  return (
    <Link to="/cart" className="nav-icon-link" aria-label="Shopping Cart">
      <div className="nav-icon-wrapper">
        <ShoppingCart size={22} />
        {displayCount > 0 && (
          <span className="nav-badge count-badge">{displayCount}</span>
        )}
      </div>
    </Link>
  );
};

export default CartIcon;
