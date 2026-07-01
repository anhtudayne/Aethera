import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import useCart from '../../../hooks/useCart';
import useAuth from '../../../hooks/useAuth';
import { formatPrice } from '../../../utils/helpers';
import './CartIcon.css';

const CartIcon = () => {
  const { cartCount, items } = useCart();
  const { isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const displayCount = isAuthenticated ? cartCount : 0;
  const cartItems = isAuthenticated ? items : [];

  // Calculate totals
  const totalPrice = cartItems.reduce((sum, item) => {
    const coursePrice = item.course?.salePrice || item.course?.price || 0;
    return sum + Number(coursePrice);
  }, 0);

  const totalOriginalPrice = cartItems.reduce((sum, item) => {
    const coursePrice = item.course?.price || 0;
    return sum + Number(coursePrice);
  }, 0);

  const totalDiscount = totalOriginalPrice - totalPrice;

  return (
    <div
      className="nav-cart-container"
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <Link to="/cart" className="nav-icon-link" aria-label="Shopping Cart">
        <div className="nav-icon-wrapper">
          <ShoppingCart size={22} />
          {displayCount > 0 && (
            <span className="nav-badge count-badge">{displayCount}</span>
          )}
        </div>
      </Link>

      {showDropdown && (
        displayCount > 0 ? (
          <div className="nav-cart-dropdown">
            <div className="nav-cart-dropdown-items">
              {cartItems.map((item) => {
                const { id, course } = item;
                if (!course) return null;
                const { name, slug, price, salePrice, instructor, thumbnail } = course;
                const activePrice = salePrice ? Number(salePrice) : Number(price || 0);
                const originalPrice = Number(price || 0);
                const hasDiscount = salePrice && Number(salePrice) < Number(price);

                return (
                  <div key={id} className="nav-cart-dropdown-item">
                    <Link to={`/courses/${slug}`} className="nav-cart-item-thumb">
                      <img
                        src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=60'}
                        alt={name}
                      />
                    </Link>
                    <div className="nav-cart-item-info">
                      <Link to={`/courses/${slug}`} className="nav-cart-item-title">
                        {name}
                      </Link>
                      <span className="nav-cart-item-instructor">By {instructor || 'Aethera Instructor'}</span>
                      <div className="nav-cart-item-prices">
                        <span className="nav-cart-item-price-current">
                          {formatPrice(activePrice)}
                        </span>
                        {hasDiscount && (
                          <span className="nav-cart-item-price-original">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="nav-cart-dropdown-footer">
              <div className="nav-cart-dropdown-total">
                <span className="total-label">Tổng cộng:</span>
                <div className="total-amount-wrapper">
                  <span className="total-amount">{formatPrice(totalPrice)}</span>
                  {totalOriginalPrice > totalPrice && (
                    <span className="total-original">{formatPrice(totalOriginalPrice)}</span>
                  )}
                </div>
              </div>

              <Link to="/cart" className="nav-cart-dropdown-btn">
                Chuyển đến giỏ hàng
              </Link>

              {totalDiscount > 0 && (
                <div className="nav-cart-savings-row">
                  <span>Số tiền tiết kiệm được:</span>
                  <span>{formatPrice(totalDiscount)}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="nav-cart-dropdown empty">
            <p className="empty-cart-message">Giỏ hàng của bạn đang trống.</p>
            <Link to="/courses" className="empty-cart-explore-btn">
              Khám phá khóa học
            </Link>
          </div>
        )
      )}
    </div>
  );
};

export default CartIcon;
