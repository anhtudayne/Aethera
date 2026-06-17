import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cartApi } from '../../api/cartApi';
import { orderApi } from '../../api/orderApi';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import OrderReviewItem from './OrderReviewItem';
import Button from '../../components/common/Button/Button';
import { formatPrice } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshCart } = useCart();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      const cartItems = res?.data || res || [];
      if (Array.isArray(cartItems) && cartItems.length === 0) {
        toast.info('Your cart is empty. Redirecting to cart page...');
        navigate(ROUTES.CART);
        return;
      }
      setItems(Array.isArray(cartItems) ? cartItems : []);
    } catch (err) {
      console.error('Failed to load cart items for checkout:', err);
      toast.error('Could not load checkout items.');
      navigate(ROUTES.CART);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCart();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchCart]);

  const total = items.reduce((sum, item) => {
    const { price, salePrice } = item.course || {};
    const finalPrice = (salePrice !== undefined && salePrice !== null && salePrice < price) ? salePrice : price;
    return sum + (finalPrice || 0);
  }, 0);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    setPaying(true);
    try {
      // Step 1: Create Order
      const createRes = await orderApi.createFromCart();
      const orderId = createRes?.data?.orderId || createRes?.orderId;
      
      if (!orderId) {
        throw new Error('Failed to retrieve order ID from server response.');
      }

      // Step 2: Fulfill Order (Instant payment simulation)
      await orderApi.fulfillOrder(orderId);

      toast.success('Payment completed successfully!');
      
      // Reset Navbar cart count
      refreshCart();

      // Navigate to success page
      navigate(`/order-success?orderId=${orderId}`);
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err?.message || 'Payment simulation failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-loader-wrapper">
        <div className="checkout-spinner"></div>
        <p>Loading secure billing details...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page-viewport">
      <div className="checkout-page-container">
        <h1 className="checkout-page-title">Secure Checkout</h1>

        <div className="checkout-layout-grid">
          {/* Left Column: Billing Information & Review Items */}
          <div className="checkout-left-column">
            {/* Billing Info */}
            <div className="checkout-section-card">
              <h3 className="checkout-section-title">Billing Information</h3>
              <div className="checkout-billing-info">
                <div className="billing-info-row">
                  <span className="billing-label">Full Name</span>
                  <span className="billing-val">{user?.name || `${user?.lastName || ''} ${user?.firstName || ''}`.trim() || 'Aethera Student'}</span>
                </div>
                <div className="billing-info-row">
                  <span className="billing-label">Email Address</span>
                  <span className="billing-val">{user?.email || 'N/A'}</span>
                </div>
                <div className="billing-info-row">
                  <span className="billing-label">Country</span>
                  <span className="billing-val">Vietnam</span>
                </div>
              </div>
            </div>

            {/* Order Items Review */}
            <div className="checkout-section-card">
              <h3 className="checkout-section-title">Order Review</h3>
              <div className="order-review-list">
                {items.map((item) => (
                  <OrderReviewItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Payment & Terms Summary */}
          <div className="checkout-right-column">
            <form onSubmit={handlePaymentSubmit} className="checkout-payment-card">
              <h3 className="checkout-section-title">Payment Summary</h3>
              
              <div className="payment-summary-rows">
                <div className="payment-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="payment-row">
                  <span>Processing Fee</span>
                  <span>Free</span>
                </div>
                <div className="payment-divider"></div>
                <div className="payment-row total-row">
                  <span>Total Due</span>
                  <span className="payment-total-value">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="checkout-terms-note">
                By confirming this payment, you agree to our terms of service. You will receive lifetime access and instant certification upon completing courses.
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={paying}
                disabled={paying || items.length === 0}
                className="checkout-pay-btn"
              >
                Confirm Payment
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
