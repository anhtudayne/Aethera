import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import { ROUTES } from '../../utils/constants';
import './OrderHistoryPage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await orderApi.getOrderDetail(id);
        if (!cancelled) setOrder(res.data);
      } catch {
        if (!cancelled) setOrder(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancelling(true);
      await orderApi.cancelOrder(id);
      // Reload order data
      const res = await orderApi.getOrderDetail(id);
      setOrder(res.data);
    } catch {
      alert('Orders cannot be canceled. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getStatusDisplay = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'paid' || s === 'completed' || s === 'fulfilled') return { label: '✅ Paid', modifier: 'paid' };
    if (s === 'pending') return { label: '⏳ Waiting for processing', modifier: 'pending' };
    if (s === 'cancelled' || s === 'canceled') return { label: '❌ Đã hủy', modifier: 'cancelled' };
    return { label: status, modifier: 'pending' };
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <span>Loading order details...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><ShoppingBag size={28} /></div>
        <h4>Order not found</h4>
        <p>This order does not exist or has been deleted.</p>
      </div>
    );
  }

  const statusInfo = getStatusDisplay(order.status);
  const isPending = (order.status || '').toLowerCase() === 'pending';
  const items = order.orderItems || order.OrderItems || order.items || [];

  return (
    <div className="order-detail-page">
      <Link to={ROUTES.ORDERS} className="order-detail-back">
        <ArrowLeft size={16} /> Back to the list
      </Link>

      <h2>Order details #{order.orderCode || order.id}</h2>

      <div className="order-detail-info">
        <div className="order-detail-info-item">
          <label>Mã đơn</label>
          <span>#{order.orderCode || order.id}</span>
        </div>
        <div className="order-detail-info-item">
          <label>Booking date</label>
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <div className="order-detail-info-item">
          <label>Total amount</label>
          <span style={{ color: 'var(--color-accent)' }}>{formatPrice(order.totalAmount || order.total)}</span>
        </div>
        <div className="order-detail-info-item">
          <label>Status</label>
          <span className={`order-status order-status--${statusInfo.modifier}`}>{statusInfo.label}</span>
        </div>
      </div>

      <h3 style={{ marginBottom: 'var(--space-md)' }}>Course list</h3>
      <div className="order-items-list">
        {items.length > 0 ? items.map((item) => {
          const course = item.Course || item.course || item;
          const isPaid = (order.status || '').toLowerCase() === 'paid';
          const orderDate = new Date(order.createdAt);
          const now = new Date();
          const diffTime = Math.abs(now - orderDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const isWithin30Days = diffDays <= 30;

          return (
            <div key={item.id || course.id} className="order-item-row">
              {course.thumbnail && (
                <img src={course.thumbnail} alt={course.name || course.title} className="order-item-img" />
              )}
              <div className="order-item-info">
                <div className="order-item-title">{course.name || course.title}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  {course.instructorName || course.instructor?.fullName || ''}
                </div>
              </div>
              <div className="order-item-price">{formatPrice(item.price || course.price)}</div>
              {isPaid && isWithin30Days && (
                <div style={{ marginLeft: 'var(--space-md)' }}>
                  <Link to={`/refund/${course.id}`} className="refund-button-link">
                    Request Refund
                  </Link>
                </div>
              )}
            </div>
          );
        }) : (
          <p style={{ color: 'var(--color-text-muted)' }}>There are no courses in this order.</p>
        )}
      </div>

      {isPending && (
        <button
          className="cancel-order-btn"
          onClick={handleCancel}
          disabled={cancelling}
        >
          {cancel ? 'Cancel...' : '❌ Cancel order'}
        </button>
      )}
    </div>
  );
};

export default OrderDetailPage;
