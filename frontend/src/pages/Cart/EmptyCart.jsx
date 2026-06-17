import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import { ROUTES } from '../../utils/constants';

const EmptyCart = () => {
  return (
    <div className="empty-cart-container">
      <div className="empty-cart-icon-wrapper">
        <ShoppingBag size={48} className="empty-cart-icon" />
      </div>
      <h3 className="empty-cart-title">Your cart is empty</h3>
      <p className="empty-cart-description">
        Browse our catalog and find premium courses designed to elevate your skills and career.
      </p>
      <Link to={ROUTES.COURSES}>
        <Button variant="primary" size="lg" className="empty-cart-btn">
          Explore Courses
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCart;
