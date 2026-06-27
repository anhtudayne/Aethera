import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Globe, Lock, CreditCard, Wallet, Landmark, Building } from 'lucide-react';
import { cartApi } from '../../api/cartApi';
import { orderApi } from '../../api/orderApi';
import { userApi } from '../../api/userApi';
import useCart from '../../hooks/useCart';
import OrderReviewItem from './OrderReviewItem';
import { formatPrice } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshCart } = useCart();

  const selectedCourseIds = location.state?.selectedCourseIds;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [creditBalance, setCreditBalance] = useState(0);
  const [applyCredit, setApplyCredit] = useState(false);
  
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [validatingVoucher, setValidatingVoucher] = useState(false);
  
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
      
      const filtered = selectedCourseIds && Array.isArray(selectedCourseIds)
        ? cartItems.filter(item => selectedCourseIds.includes(item.courseId))
        : cartItems;

      if (filtered.length === 0) {
        toast.info('No courses selected for checkout.');
        navigate(ROUTES.CART);
        return;
      }

      setItems(filtered);
    } catch (err) {
      console.error('Failed to load cart items for checkout:', err);
      toast.error('Could not load checkout items.');
      navigate(ROUTES.CART);
    } finally {
      setLoading(false);
    }
  }, [navigate, selectedCourseIds]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApi.getProfile();
        const profile = res.user || res.data;
        if (profile) {
          setCreditBalance(Number(profile.creditBalance || 0));
        }
      } catch (err) {
        console.error('Failed to fetch user credit balance:', err);
      }
    };
    fetchProfile();
  }, []);

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
  const voucherDiscountAmount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  let amountAfterVoucher = total - voucherDiscountAmount;
  if (amountAfterVoucher < 0) amountAfterVoucher = 0;

  const creditUsed = applyCredit ? Math.min(creditBalance, amountAfterVoucher) : 0;
  const netTotal = amountAfterVoucher - creditUsed;
  const discountPercent = totalOriginalPrice > 0 ? Math.round((totalDiscount / totalOriginalPrice) * 100) : 0;

  const handleApplyVoucher = async () => {
    if (!voucherCodeInput.trim()) return;
    setValidatingVoucher(true);
    try {
      const res = await orderApi.validateVoucher(voucherCodeInput, total);
      setAppliedVoucher(res.data || res);
      toast.success('Voucher applied successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Invalid voucher code.');
      setAppliedVoucher(null);
    } finally {
      setValidatingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCodeInput('');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    setPaying(true);
    try {
      const ids = selectedCourseIds || items.map(item => item.courseId);

      // If credit covers the entire purchase
      if (netTotal === 0) {
        const res = await orderApi.createMoMoPayment(ids, applyCredit, appliedVoucher?.code);
        if (res?.isPaid || res?.data?.isPaid || (res?.success && !res?.payUrl)) {
          const orderId = res?.orderId || res?.data?.orderId;
          toast.success('Order completed successfully using Credit!');
          refreshCart();
          navigate(`/order-success?orderId=${orderId}`);
          return;
        }
      }

      if (paymentMethod === 'e-wallet') {
        // MoMo Payment Flow
        const res = await orderApi.createMoMoPayment(ids, applyCredit, appliedVoucher?.code);
        const payUrl = res?.data?.payUrl || res?.payUrl;
        
        if (!payUrl) {
          throw new Error('Failed to retrieve MoMo payment URL.');
        }

        toast.success('Redirecting to MoMo secure payment gateway...');
        setTimeout(() => {
          window.location.href = payUrl;
        }, 1000);
        return;
      }

      // Default Simulation Flow (Credit Card, etc.)
      const createRes = await orderApi.createFromCart(ids, applyCredit, appliedVoucher?.code);
      const orderId = createRes?.data?.orderId || createRes?.orderId;
      const isAlreadyPaid = createRes?.data?.isPaid || createRes?.isPaid;
      
      if (!orderId) {
        throw new Error('Failed to retrieve order ID from server response.');
      }

      if (!isAlreadyPaid) {
        await orderApi.fulfillOrder(orderId);
      }

      toast.success('Payment completed successfully!');
      refreshCart();
      navigate(`/order-success?orderId=${orderId}`);
    } catch (err) {
      console.error('Checkout error:', err);
      toast.toast ? toast.toast(err?.message) : toast.error(err?.message || 'Payment simulation failed. Please try again.');
    } finally {
      if (paymentMethod !== 'e-wallet' || netTotal === 0) {
        setPaying(false);
      }
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
              
              {netTotal === 0 ? (
                <div className="checkout-no-payment-needed">
                  <h4 className="free-purchase-title">Good news! No payment needed.</h4>
                  <p className="free-purchase-desc">
                    Your Aethera credits fully cover this purchase. Click complete to begin learning.
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

                  {/* Option 2: MoMo (E-Wallet) */}
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
                      <span className="payment-method-name">Ví điện tử MoMo</span>
                      <span style={{ backgroundColor: '#a50064', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px', fontWeight: 'bold', letterSpacing: '0.5px' }}>MoMo Sandbox</span>
                    </label>
                    
                    {paymentMethod === 'e-wallet' && (
                      <div className="payment-method-instruction" onClick={(e) => e.stopPropagation()}>
                        <p>Hệ thống sẽ chuyển hướng bạn sang cổng thanh toán thử nghiệm (Sandbox) của MoMo để quét mã QR và xác nhận thanh toán.</p>
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
              
              <div className="checkout-voucher-section mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold mb-2">Have a voucher code?</h3>
                {appliedVoucher ? (
                  <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 p-2 rounded border border-emerald-200">
                    <div>
                      <span className="font-bold">{appliedVoucher.code}</span>
                      <span className="ml-2 text-xs">is applied</span>
                    </div>
                    <button onClick={handleRemoveVoucher} className="text-emerald-700 hover:text-emerald-900 font-bold">✕</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter code" 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 uppercase"
                      value={voucherCodeInput}
                      onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                      disabled={validatingVoucher}
                    />
                    <button 
                      onClick={handleApplyVoucher} 
                      disabled={validatingVoucher || !voucherCodeInput.trim()}
                      className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 disabled:opacity-50"
                    >
                      {validatingVoucher ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

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

                {appliedVoucher && (
                  <div className="summary-detail-row discount-row">
                    <span className="summary-label">Voucher applied:</span>
                    <span className="summary-value">- {formatPrice(voucherDiscountAmount)}</span>
                  </div>
                )}

                <div className="summary-divider"></div>

                {creditBalance > 0 && (
                  <>
                    <div className="summary-divider"></div>
                    <div className="checkout-credit-apply-row">
                      <label className="credit-checkbox-label">
                        <input
                          type="checkbox"
                          checked={applyCredit}
                          onChange={(e) => setApplyCredit(e.target.checked)}
                        />
                        <span>Apply Aethera Credit ({formatPrice(creditBalance)})</span>
                      </label>
                    </div>
                  </>
                )}

                {applyCredit && creditUsed > 0 && (
                  <div className="summary-detail-row credit-row">
                    <span className="summary-label">Credit Applied:</span>
                    <span className="summary-value">- {formatPrice(creditUsed)}</span>
                  </div>
                )}

                <div className="summary-divider"></div>

                <div className="summary-detail-row total-payment-row">
                  <span className="total-label">Total:</span>
                  <span className="total-value">{formatPrice(netTotal)}</span>
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
                    <span>{netTotal === 0 ? 'Enroll now' : 'Complete Payment'}</span>
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
