import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { cartApi } from '../../api/cartApi';
import useCart from '../../hooks/useCart';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';
import './CartPage.css';

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshCart } = useCart();

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      const cartItems = res?.data || res || [];
      const itemsArray = Array.isArray(cartItems) ? cartItems : [];
      setItems(itemsArray);
      // Select all by default
      setSelectedCourseIds(itemsArray.map(item => item.courseId));
    } catch (err) {
      console.error('Failed to load cart:', err);
      toast.error('Could not retrieve your cart items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCart();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchCart]);

  const handleRemove = async (itemId) => {
    try {
      // Find courseId to remove from selection too
      const removedItem = items.find(item => item.id === itemId);
      const res = await cartApi.removeItem(itemId);
      toast.success(res?.message || 'Item removed from cart');
      
      // Update state locally first to be snappy
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      if (removedItem) {
        setSelectedCourseIds(prev => prev.filter(id => id !== removedItem.courseId));
      }
      
      // Refresh Navbar cart badge count
      refreshCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
      toast.error(err?.message || 'Could not remove item.');
    }
  };

  const handleClear = async () => {
    try {
      const res = await cartApi.clearCart();
      toast.success(res?.message || 'Cart cleared successfully');
      setItems([]);
      setSelectedCourseIds([]);
      refreshCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
      toast.error(err?.message || 'Could not clear cart.');
    }
  };

  const handleToggleSelect = (courseId) => {
    setSelectedCourseIds(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedCourseIds.length === items.length) {
      setSelectedCourseIds([]);
    } else {
      setSelectedCourseIds(items.map(item => item.courseId));
    }
  };

  if (loading) {
    return (
      <div className="cart-page-loader-wrapper">
        <div className="cart-spinner"></div>
        <p>Loading your premium workspace...</p>
      </div>
    );
  }

  const isCartEmpty = items.length === 0;

  return (
    <div className="cart-page-viewport">
      <div className="cart-page-container">
        <div className="cart-header-section">
          <h1 className="cart-page-title">Shopping Cart</h1>
          {!isCartEmpty && (
            <span className="cart-badge-count">
              {items.length} {items.length === 1 ? 'course' : 'courses'} in cart
            </span>
          )}
        </div>

        {isCartEmpty ? (
          <EmptyCart />
        ) : (
          <div className="cart-layout-grid">
            {/* Left Column: Items */}
            <div className="cart-items-column">
              <div className="cart-select-all-banner-neo">
                <label className="cart-select-all-label-neo">
                  <input 
                    type="checkbox"
                    checked={items.length > 0 && selectedCourseIds.length === items.length}
                    onChange={handleToggleSelectAll}
                    className="cart-checkbox-neo"
                  />
                  <span>Select All ({items.length} courses)</span>
                </label>
                {selectedCourseIds.length > 0 && (
                  <span className="cart-selected-count-badge-neo">
                    Selected {selectedCourseIds.length} course{selectedCourseIds.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              <div className="cart-items-list-neo">
                {items.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    onRemove={handleRemove} 
                    isSelected={selectedCourseIds.includes(item.courseId)}
                    onToggleSelect={() => handleToggleSelect(item.courseId)}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="cart-summary-column">
              <CartSummary 
                items={items} 
                selectedCourseIds={selectedCourseIds}
                onClear={handleClear} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
