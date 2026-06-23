import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Shield } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

const CartSummary = ({ items, selectedCourseIds = [], onClear }) => {
  const navigate = useNavigate();

  // Filter items that are selected
  const selectedItems = items.filter(item => selectedCourseIds.includes(item.courseId));
  const selectedCount = selectedItems.length;

  // Calculate prices based on selection
  const totalOriginalPrice = selectedItems.reduce((sum, item) => {
    const { price } = item.course || {};
    return sum + (Number(price) || 0);
  }, 0);

  const totalDiscount = selectedItems.reduce((sum, item) => {
    const { price, salePrice } = item.course || {};
    const finalPrice = (salePrice !== undefined && salePrice !== null && salePrice < price) ? salePrice : price;
    return sum + ((Number(price) - Number(finalPrice)) || 0);
  }, 0);

  const total = totalOriginalPrice - totalDiscount;

  const handleCheckoutClick = (e) => {
    e.preventDefault();
    if (selectedCount === 0) return;
    navigate(ROUTES.CHECKOUT, { state: { selectedCourseIds } });
  };

  return (
    <div className="cart-summary-card-neo">
      <h3 className="summary-title-neo">Order Summary</h3>
      
      <div className="summary-details-neo">
        <div className="summary-row-neo">
          <span className="summary-label-neo">Original Price ({selectedCount} selected)</span>
          <span className="summary-value-neo">{formatPrice(totalOriginalPrice)}</span>
        </div>
        
        {totalDiscount > 0 && (
          <div className="summary-row-neo discount-row-neo">
            <span className="summary-label-neo">Discounts</span>
            <span className="summary-value-neo">- {formatPrice(totalDiscount)}</span>
          </div>
        )}

        <div className="summary-divider-neo"></div>

        <div className="summary-row-neo total-row-neo">
          <span className="summary-total-label-neo">Total Amount</span>
          <span className="summary-total-value-neo">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="summary-actions-neo">
        <button
          onClick={handleCheckoutClick}
          disabled={selectedCount === 0}
          className="cart-checkout-btn-neo"
        >
          <ShoppingCart size={18} />
          <span>Checkout selected ({selectedCount})</span>
        </button>

        <button 
          onClick={onClear} 
          className="cart-clear-btn-neo"
          type="button"
        >
          <Trash2 size={16} />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="cart-summary-trust-neo">
        <Shield size={16} className="trust-icon-neo" />
        <span>30-Day Money-Back Guarantee</span>
      </div>
    </div>
  );
};

export default CartSummary;
