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
  const [loading, setLoading] = useState(true);
  const { refreshCart } = useCart();

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      const cartItems = res?.data || res || [];
      setItems(Array.isArray(cartItems) ? cartItems : []);
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
      const res = await cartApi.removeItem(itemId);
      toast.success(res?.message || 'Item removed from cart');
      // Update state locally first to be snappy
      setItems((prev) => prev.filter((item) => item.id !== itemId));
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
      refreshCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
      toast.error(err?.message || 'Could not clear cart.');
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
              {items.map((item) => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onRemove={handleRemove} 
                />
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div className="cart-summary-column">
              <CartSummary 
                items={items} 
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
