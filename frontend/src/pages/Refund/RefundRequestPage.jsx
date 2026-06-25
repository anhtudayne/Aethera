import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Wallet, CreditCard, Loader, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { refundApi } from '../../api/refundApi';
import { ROUTES } from '../../utils/constants';
import './RefundRequestPage.css';

const RefundRequestPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const [method, setMethod] = useState('credit'); // default to credit balance
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        setLoading(true);
        const res = await refundApi.checkRefundEligibility(courseId);
        setEligibility(res.data);
      } catch (err) {
        console.error('Error checking refund eligibility:', err);
        setError('Failed to check refund eligibility. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchEligibility();
    }
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eligibility || !eligibility.canRefund) return;

    try {
      setSubmitting(true);
      setError('');
      await refundApi.createRefund({
        courseId: parseInt(courseId),
        method,
        reason,
      });

      // Navigate to success page with method and amount state
      navigate(ROUTES.REFUND_SUCCESS, {
        state: {
          method,
          amount: eligibility.refundAmount,
          courseName: eligibility.course?.name,
        },
      });
    } catch (err) {
      console.error('Error submitting refund request:', err);
      setError(err.response?.data?.message || 'Failed to submit refund request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString('vi-VN') + '₫';
  };

  if (loading) {
    return (
      <div className="refund-loading-container">
        <Loader className="animate-spin" size={32} />
        <p>Verifying course refund eligibility...</p>
      </div>
    );
  }

  const course = eligibility?.course || {};
  const canRefund = eligibility?.canRefund;
  const isAlreadyRefunded = eligibility?.reason?.includes('already refunded') || eligibility?.reason?.includes('refunded in the past');

  return (
    <div className="refund-request-container">
      <div className="refund-request-card">
        <div className="refund-back-link">
          <Link to={ROUTES.ORDERS}>
            <ArrowLeft size={16} /> Back to Purchase History
          </Link>
        </div>

        <h1 className="refund-page-title">Request a Refund</h1>
        <p className="refund-page-subtitle">
          Please review the details below to request a refund for this course.
        </p>

        {/* Course Details Panel */}
        <div className="refund-course-panel">
          <img
            src={course.thumbnail || '/assets/images/placeholder.png'}
            alt={course.name}
            className="refund-course-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300';
            }}
          />
          <div className="refund-course-info">
            <h2 className="refund-course-name">{course.name || 'Course Name'}</h2>
            <div className="refund-purchase-meta">
              <span>Price Paid: <strong>{formatCurrency(eligibility?.refundAmount || 0)}</strong></span>
              {eligibility?.purchaseDate && (
                <span>
                  Purchased Date: <strong>
                    {new Date(eligibility.purchaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </strong>
                </span>
              )}
            </div>
            {canRefund && eligibility?.daysRemaining !== undefined && (
              <div className="refund-window-tag">
                {eligibility.daysRemaining} days remaining in refund window
              </div>
            )}
          </div>
        </div>

        {/* Error / Ineligible Notification */}
        {error && (
          <div className="refund-alert-box error">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {!canRefund && (
          <div className="refund-alert-box error">
            <AlertTriangle size={20} />
            <div>
              <strong>Ineligible for Refund</strong>
              <p className="refund-ineligible-reason">
                {isAlreadyRefunded
                  ? 'Cannot refund because you can only refund each course once. This course has been refunded in the past.'
                  : eligibility?.reason || 'This course is not eligible for refund.'}
              </p>
            </div>
          </div>
        )}

        {/* Refund Form */}
        <form onSubmit={handleSubmit} className="refund-form">
          <div className="refund-section-title">Select Refund Method</div>

          <div className="refund-methods-grid">
            {/* Option 1: Credit Balance */}
            <div
              className={`refund-method-card ${method === 'credit' ? 'selected' : ''} ${!canRefund ? 'disabled' : ''}`}
              onClick={() => canRefund && setMethod('credit')}
            >
              <div className="method-radio">
                <input
                  type="radio"
                  name="refundMethod"
                  id="method-credit"
                  checked={method === 'credit'}
                  disabled={!canRefund}
                  onChange={() => setMethod('credit')}
                />
              </div>
              <div className="method-details">
                <div className="method-label-row">
                  <Wallet className="method-icon" size={18} />
                  <span className="method-name">Credit Balance (Instant)</span>
                </div>
                <p className="method-desc">
                  Get {formatCurrency(eligibility?.refundAmount || 0)} credit instantly. Use it immediately to buy any other course on Aethera.
                </p>
              </div>
            </div>

            {/* Option 2: MoMo / Bank Transfer */}
            <div
              className={`refund-method-card ${method === 'external' || method === 'momo' || method === 'bank_transfer' ? 'selected' : ''} ${!canRefund ? 'disabled' : ''}`}
              onClick={() => {
                if (canRefund) {
                  // default to momo for external payout
                  setMethod('momo');
                }
              }}
            >
              <div className="method-radio">
                <input
                  type="radio"
                  name="refundMethod"
                  id="method-external"
                  checked={method === 'momo' || method === 'bank_transfer'}
                  disabled={!canRefund}
                  onChange={() => setMethod('momo')}
                />
              </div>
              <div className="method-details">
                <div className="method-label-row">
                  <CreditCard className="method-icon" size={18} />
                  <span className="method-name">MoMo / Bank Transfer (2-3 Days)</span>
                </div>
                <p className="method-desc">
                  Refund directly to your personal payment account. Admin will process and transfer the funds within 2-3 business days.
                </p>
              </div>
            </div>
          </div>

          {/* External Method Sub-Selection if external is chosen */}
          {(method === 'momo' || method === 'bank_transfer') && canRefund && (
            <div className="external-sub-selection">
              <label>Select Account Type:</label>
              <div className="sub-radio-group">
                <label className="sub-radio-label">
                  <input
                    type="radio"
                    name="externalType"
                    checked={method === 'momo'}
                    onChange={() => setMethod('momo')}
                  />
                  MoMo Wallet
                </label>
                <label className="sub-radio-label">
                  <input
                    type="radio"
                    name="externalType"
                    checked={method === 'bank_transfer'}
                    onChange={() => setMethod('bank_transfer')}
                  />
                  Bank Transfer
                </label>
              </div>
            </div>
          )}

          <div className="refund-form-group">
            <label htmlFor="reason" className="refund-label">
              Reason for Refund <span className="label-optional">(Optional)</span>
            </label>
            <textarea
              id="reason"
              className="refund-textarea"
              placeholder="Please tell us why you are returning this course. Your feedback helps us improve."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={!canRefund || submitting}
              maxLength={400}
            />
          </div>

          <div className="refund-warnings">
            <div className="warning-item">
              <CheckCircle2 size={16} className="warning-icon" />
              <span>Your access to the course lectures, exercises, and certificates will be revoked immediately upon request confirmation.</span>
            </div>
            <div className="warning-item">
              <CheckCircle2 size={16} className="warning-icon" />
              <span><strong>Crucial Policy:</strong> Each course can only be refunded once ever. If you repurchase this course later, you will not be allowed to refund it again.</span>
            </div>
          </div>

          <div className="refund-actions">
            <button
              type="button"
              className="refund-btn-cancel"
              onClick={() => navigate(ROUTES.ORDERS)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="refund-btn-submit"
              disabled={!canRefund || submitting}
            >
              {submitting ? 'Submitting...' : 'Confirm Refund'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundRequestPage;
