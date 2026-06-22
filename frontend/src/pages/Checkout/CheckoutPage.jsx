import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Globe, Lock, CreditCard, Wallet, Landmark, Building } from 'lucide-react';
import { cartApi } from '../../api/cartApi';
import { orderApi } from '../../api/orderApi';
import useCart from '../../hooks/useCart';
import OrderReviewItem from './OrderReviewItem';
import { formatPrice } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  
  // Custom checkout states matching Udemy
  const [selectedCountry, setSelectedCountry] = useState('VN');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

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

  // Order summary calculations
  const totalOriginalPrice = items.reduce((sum, item) => {
    const { price } = item.course || {};
    return sum + (price || 0);
  }, 0);

  const totalDiscount = items.reduce((sum, item) => {
    const { price, salePrice } = item.course || {};
    const finalPrice = (salePrice !== undefined && salePrice !== null && salePrice < price) ? salePrice : price;
    return sum + ((price - finalPrice) || 0);
  }, 0);

  const total = totalOriginalPrice - totalDiscount;
  const discountPercent = totalOriginalPrice > 0 ? Math.round((totalDiscount / totalOriginalPrice) * 100) : 0;

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
        <div className="checkout-layout-grid">
          {/* Left Column: Checkout details, address, payment methods, order details */}
          <div className="checkout-left-column">
            <h1 className="checkout-main-title">Checkout</h1>

            {/* Section 1: Billing Address */}
            <div className="checkout-section-block">
              <h2 className="checkout-section-heading">Billing address</h2>
              <div className="checkout-billing-address-box">
                <div className="checkout-field-group">
                  <label className="checkout-field-label">Country</label>
                  <div className="checkout-select-container">
                    <Globe className="checkout-select-icon" size={16} />
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="checkout-country-dropdown"
                    >
                      <option value="VN">Vietnam</option>
                      <option value="US">United States</option>
                      <option value="SG">Singapore</option>
                      <option value="JP">Japan</option>
                    </select>
                  </div>
                </div>
                <p className="checkout-billing-disclaimer">
                  Aethera is required by law to collect applicable transaction taxes for purchases made in certain tax jurisdictions.
                </p>
              </div>
            </div>

            {/* Section 2: Payment Method */}
            <div className="checkout-section-block">
              <h2 className="checkout-section-heading">Payment method</h2>
              
              {total === 0 ? (
                <div className="checkout-no-payment-needed">
                  <h4 className="free-purchase-title">Good news! No payment needed.</h4>
                  <p className="free-purchase-desc">
                    Your discounts or Aethera credits fully cover this purchase. Enroll now to begin learning.
                  </p>
                </div>
              ) : (
                <div className="checkout-payment-methods-list">
                  {/* Option 1: Credit/Debit Card */}
                  <div 
                    className={`payment-method-row ${paymentMethod === 'credit-card' ? 'payment-method-selected' : ''}`}
                    onClick={() => setPaymentMethod('credit-card')}
                  >
                    <label className="payment-radio-label">
                      <input
                        type="radio"
                        name="payment-method"
                        value="credit-card"
                        checked={paymentMethod === 'credit-card'}
                        onChange={() => setPaymentMethod('credit-card')}
                        className="payment-radio-input"
                      />
                      <CreditCard size={18} className="payment-icon" />
                      <span className="payment-method-name">Credit/Debit Card</span>
                    </label>

                    {paymentMethod === 'credit-card' && (
                      <div className="credit-card-form" onClick={(e) => e.stopPropagation()}>
                        <div className="card-input-row">
                          <input
                            type="text"
                            placeholder="Name on Card"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="card-text-field"
                            required
                          />
                        </div>
                        <div className="card-input-row">
                          <input
                            type="text"
                            placeholder="Card Number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="card-text-field"
                            required
                          />
                        </div>
                        <div className="card-input-cols">
                          <input
                            type="text"
                            placeholder="Expiry Date (MM/YY)"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="card-text-field"
                            required
                          />
                          <input
                            type="text"
                            placeholder="CVC/CVV"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="card-text-field"
                            required
                          />
                        </div>
                        <p className="card-demo-note">
                          Note: This is a secure payment simulation. Your actual card details are not processed.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Option 2: Momo / ShopeePay / ZaloPay (E-Wallet) */}
                  <div 
                    className={`payment-method-row ${paymentMethod === 'e-wallet' ? 'payment-method-selected' : ''}`}
                    onClick={() => setPaymentMethod('e-wallet')}
                  >
                    <label className="payment-radio-label">
                      <input
                        type="radio"
                        name="payment-method"
                        value="e-wallet"
                        checked={paymentMethod === 'e-wallet'}
                        onChange={() => setPaymentMethod('e-wallet')}
                        className="payment-radio-input"
                      />
                      <Wallet size={18} className="payment-icon" />
                      <span className="payment-method-name">Momo / ZaloPay (E-Wallet)</span>
                    </label>
                    
                    {paymentMethod === 'e-wallet' && (
                      <div className="payment-method-instruction" onClick={(e) => e.stopPropagation()}>
                        <p>You will be redirected to Momo/ZaloPay secure gateway to scan the QR code and complete your purchase.</p>
                      </div>
                    )}
                  </div>

                  {/* Option 3: Internet Banking / ATM */}
                  <div 
                    className={`payment-method-row ${paymentMethod === 'banking' ? 'payment-method-selected' : ''}`}
                    onClick={() => setPaymentMethod('banking')}
                  >
                    <label className="payment-radio-label">
                      <input
                        type="radio"
                        name="payment-method"
                        value="banking"
                        checked={paymentMethod === 'banking'}
                        onChange={() => setPaymentMethod('banking')}
                        className="payment-radio-input"
                      />
                      <Landmark size={18} className="payment-icon" />
                      <span className="payment-method-name">Internet Banking (VNPay / ATM)</span>
                    </label>
                    
                    {paymentMethod === 'banking' && (
                      <div className="payment-method-instruction" onClick={(e) => e.stopPropagation()}>
                        <p>Choose your bank in the next step. You will be redirected to VNPay portal for authentication.</p>
                      </div>
                    )}
                  </div>

                  {/* Option 4: Direct Bank Transfer */}
                  <div 
                    className={`payment-method-row ${paymentMethod === 'transfer' ? 'payment-method-selected' : ''}`}
                    onClick={() => setPaymentMethod('transfer')}
                  >
                    <label className="payment-radio-label">
                      <input
                        type="radio"
                        name="payment-method"
                        value="transfer"
                        checked={paymentMethod === 'transfer'}
                        onChange={() => setPaymentMethod('transfer')}
                        className="payment-radio-input"
                      />
                      <Building size={18} className="payment-icon" />
                      <span className="payment-method-name">Direct Bank Transfer</span>
                    </label>
                    
                    {paymentMethod === 'transfer' && (
                      <div className="payment-method-instruction" onClick={(e) => e.stopPropagation()}>
                        <p>Transfer the total amount directly to our corporate bank account. Details will be shown after you place the order.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Order Details */}
            <div className="checkout-section-block">
              <h2 className="checkout-section-heading">Order details <span className="checkout-details-count">({items.length} course{items.length > 1 ? 's' : ''})</span></h2>
              <div className="checkout-order-review-list">
                {items.map((item) => (
                  <OrderReviewItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary sticky */}
          <div className="checkout-right-column">
            <div className="checkout-order-summary-card">
              <h2 className="checkout-summary-title">Order summary</h2>
              
              <div className="checkout-summary-details">
                <div className="summary-detail-row">
                  <span className="summary-label">Original Price:</span>
                  <span className="summary-value">{formatPrice(totalOriginalPrice)}</span>
                </div>
                
                {totalDiscount > 0 && (
                  <div className="summary-detail-row discount-row">
                    <span className="summary-label">Discounts ({discountPercent}% Off):</span>
                    <span className="summary-value">- {formatPrice(totalDiscount)}</span>
                  </div>
                )}

                <div className="summary-divider"></div>

                <div className="summary-detail-row subtotal-row">
                  <span className="summary-label">Subtotal:</span>
                  <span className="summary-value">{formatPrice(total)}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-detail-row total-payment-row">
                  <span className="total-label">Total:</span>
                  <span className="total-value">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="checkout-legal-disclaimer">
                By enrolling, you agree to these <a href="/" className="legal-link" onClick={(e) => e.preventDefault()}>Terms of Use</a>.
              </div>

              <button
                onClick={handlePaymentSubmit}
                disabled={paying || items.length === 0}
                className="checkout-complete-payment-btn"
              >
                {paying ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Lock size={16} className="lock-icon" />
                    <span>{total === 0 ? 'Enroll now' : 'Complete Payment'}</span>
                  </>
                )}
              </button>

              <div className="checkout-moneyback-badge">
                <h4 className="moneyback-title">30-Day Money-Back Guarantee</h4>
                <p className="moneyback-text">Not satisfied? Get a full refund within 30 days. Simple and straightforward!</p>
              </div>

              <div className="checkout-social-proof-panel">
                <span className="social-proof-icon">🔥</span>
                <p className="social-proof-text">
                  Join <strong>5 people</strong> in Vietnam who have recently enrolled in Aethera courses in the last 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
