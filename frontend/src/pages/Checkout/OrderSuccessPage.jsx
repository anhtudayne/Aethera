import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, PlayCircle, BookOpen, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { orderApi } from '../../api/orderApi';
import Button from '../../components/common/Button/Button';
import { formatPrice } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const resultCode = searchParams.get('resultCode'); // MoMo callback resultCode

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra trạng thái thanh toán thành công
  // - Nếu có resultCode từ MoMo: thành công khi resultCode === '0'
  // - Nếu không có: kiểm tra status của order từ DB (nếu đã load xong) hoặc mặc định coi như thành công (cho simulated flow)
  const isPaymentSuccess = resultCode !== null 
    ? resultCode === '0' 
    : (order ? order.status === 'paid' : true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const res = await orderApi.getOrderDetail(orderId);
        // Extract from ApiResponse wrapper
        setOrder(res?.data || res);
      } catch (err) {
        console.error('Failed to load order details for success page:', err);
        toast.error('Could not load order receipt details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="success-loader-wrapper">
        <div className="success-spinner"></div>
        <p>Generating your receipt & workspace access...</p>
      </div>
    );
  }

  // Find first course slug to start learning
  const orderItems = order?.orderItems || [];
  const firstCourse = orderItems[0]?.course;
  const firstCourseSlug = firstCourse?.slug;

  const handleStartLearning = () => {
    if (firstCourseSlug) {
      navigate(`/learn/${firstCourseSlug}`);
    } else {
      navigate(ROUTES.MY_COURSES);
    }
  };

  return (
    <div className="success-page-viewport">
      <div className="success-page-card">
        {isPaymentSuccess ? (
          <>
            {/* Animated Checkmark */}
            <div className="checkmark-bounce-wrapper">
              <CheckCircle2 size={72} className="checkmark-success-icon" />
            </div>

            <h1 className="success-heading">Payment Successful!</h1>
            <p className="success-subheading">
              Thank you for choosing Aethera. Your order is processed and lifetime course access is granted.
            </p>
          </>
        ) : (
          <>
            {/* Failure Icon */}
            <div className="checkmark-bounce-wrapper failure-icon-wrapper">
              <XCircle size={72} className="checkmark-failure-icon" style={{ color: '#e02424' }} />
            </div>

            <h1 className="success-heading" style={{ color: '#e02424' }}>Payment Failed or Cancelled</h1>
            <p className="success-subheading">
              We were unable to complete your transaction. If any money was deducted, it will be refunded automatically by MoMo.
            </p>
          </>
        )}

        {order ? (
          <div className="order-receipt-box">
            <div className="receipt-row">
              <span className="receipt-label">Order Code</span>
              <span className="receipt-val">{order.code || 'N/A'}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Total Amount</span>
              <span className="receipt-val price-highlight">{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Status</span>
              <span className={`receipt-val status-badge ${order.status}`}>
                {order.status === 'paid' ? 'Paid ✅' : order.status === 'cancelled' ? 'Cancelled ❌' : 'Pending ⏳'}
              </span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Courses Purchased</span>
              <span className="receipt-val">
                {orderItems.map((item) => (
                  <div key={item.id} className="receipt-course-title">
                    • {item.course?.name}
                  </div>
                ))}
              </span>
            </div>
          </div>
        ) : (
          <div className="order-receipt-missing">
            <p>Could not retrieve order details. Please check your dashboard to view active courses.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="success-action-buttons">
          {isPaymentSuccess ? (
            <Button
              onClick={handleStartLearning}
              variant="primary"
              fullWidth
              className="success-btn-cta"
              icon={PlayCircle}
            >
              Start Learning
            </Button>
          ) : (
            <Link to={ROUTES.CART} style={{ width: '100%', display: 'block' }}>
              <Button
                variant="primary"
                fullWidth
                className="success-btn-cta"
                style={{ backgroundColor: '#e02424', borderColor: '#e02424' }}
              >
                Return to Cart
              </Button>
            </Link>
          )}

          <Link to={ROUTES.MY_COURSES} style={{ width: '100%', display: 'block' }}>
            <Button variant="ghost" fullWidth className="success-btn-sec" icon={BookOpen}>
              Go to My Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
