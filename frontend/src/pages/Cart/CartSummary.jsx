import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import { formatPrice } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

const CartSummary = ({ items, onClear }) => {
  const itemCount = items.length;

  const total = items.reduce((sum, item) => {
    const { price, salePrice } = item.course || {};
    const finalPrice = (salePrice !== undefined && salePrice !== null && salePrice < price) ? salePrice : price;
    return sum + (finalPrice || 0);
  }, 0);

  return (
    <div className="cart-summary-card">
      <h3 className="summary-title">Order Summary</h3>
      
      <div className="summary-row">
        <span className="summary-label">Items ({itemCount})</span>
        <span className="summary-value">
          {items.map((item, idx) => (
            <div key={item.id} className="summary-item-mini-name">
              {idx + 1}. {item.course?.name}
            </div>
          ))}
        </span>
      </div>

      <div className="summary-divider"></div>

      <div className="summary-row total-row">
        <span className="summary-total-label">Total Amount</span>
        <span className="summary-total-value">{formatPrice(total)}</span>
      </div>

      <div className="summary-actions">
        <Link to={ROUTES.CHECKOUT} style={{ width: '100%' }}>
          <Button variant="primary" fullWidth className="summary-checkout-btn">
            <ShoppingCart size={18} style={{ marginRight: '8px' }} />
            Proceed to Checkout
          </Button>
        </Link>

        <Button 
          variant="ghost" 
          fullWidth 
          onClick={onClear} 
          className="summary-clear-btn"
          type="button"
        >
          <Trash2 size={16} style={{ marginRight: '8px' }} />
          Clear Cart
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
