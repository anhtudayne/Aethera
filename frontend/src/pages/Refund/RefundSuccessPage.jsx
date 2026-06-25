import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, ArrowRight, Home } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import './RefundSuccessPage.css';

const RefundSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state from navigation
  const { method, amount, courseName } = location.state || {
    method: 'credit',
    amount: 0,
    courseName: 'Course',
  };

  const formatCurrency = (val) => {
    return Number(val).toLocaleString('vi-VN') + '₫';
  };

  const isCredit = method === 'credit';

  return (
    <div className="refund-success-container">
      <div className="refund-success-card">
        <div className="refund-success-icon-wrapper">
          {isCredit ? (
            <div className="success-icon-circle credit">
              <CheckCircle size={48} />
            </div>
          ) : (
            <div className="success-icon-circle external">
              <Clock size={48} />
            </div>
          )}
        </div>

        <h1 className="refund-success-title">
          {isCredit ? 'Refund Completed Successfully!' : 'Refund Request Submitted!'}
        </h1>

        <p className="refund-success-desc">
          Your request to refund <strong>{formatCurrency(amount)}</strong> for <strong>"{courseName}"</strong> has been successfully processed.
        </p>

        <div className="refund-success-detail-box">
          <div className="detail-row">
            <span className="detail-label">Refund Amount</span>
            <span className="detail-value highlight">{formatCurrency(amount)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Refund Method</span>
            <span className="detail-value uppercase">
              {method === 'credit'
                ? 'Aethera Credit Balance'
                : method === 'momo'
                ? 'MoMo Wallet'
                : 'Bank Transfer'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className={`detail-value badge ${isCredit ? 'completed' : 'processing'}`}>
              {isCredit ? 'Completed' : 'Processing (2-3 Days)'}
            </span>
          </div>
        </div>

        <div className="refund-success-note">
          {isCredit ? (
            <p>The refund amount has been added to your Aethera Credit Balance. It will be automatically applied at your next checkout.</p>
          ) : (
            <p>Our administrators will process the payment transfer directly to your MoMo or Bank account within 2-3 business days. Thank you for your patience.</p>
          )}
        </div>

        <div className="refund-success-actions">
          {isCredit ? (
            <button
              onClick={() => navigate(ROUTES.CREDIT_BALANCE)}
              className="refund-btn-primary"
            >
              View Credit Balance <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => navigate(ROUTES.ORDERS)}
              className="refund-btn-primary"
            >
              View Refund History <ArrowRight size={16} />
            </button>
          )}
          <button
            onClick={() => navigate(ROUTES.COURSES)}
            className="refund-btn-secondary"
          >
            <Home size={16} /> Explore Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundSuccessPage;
