import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, RotateCcw } from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import { refundApi } from '../../api/refundApi';
import { ROUTES } from '../../utils/constants';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'refunds'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'orders') {
          const res = await orderApi.getMyOrders({ page: 1, limit: 50 });
          setOrders(res.data?.orders || res.data || []);
        } else {
          const res = await refundApi.getMyRequests();
          setRefunds(res.data || []);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
        if (activeTab === 'orders') {
          setOrders([]);
        } else {
          setRefunds([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  const getStatusDisplay = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'paid' || s === 'completed' || s === 'fulfilled') return { label: '✅ Đã thanh toán', modifier: 'paid' };
    if (s === 'pending') return { label: '⏳ Chờ xử lý', modifier: 'pending' };
    if (s === 'cancelled' || s === 'canceled') return { label: '❌ Đã hủy', modifier: 'cancelled' };
    return { label: status, modifier: 'pending' };
  };

  const getRefundStatusDisplay = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'COMPLETED') return { label: '✅ Completed', modifier: 'paid' };
    if (s === 'PROCESSING') return { label: '⏳ Processing', modifier: 'pending' };
    return { label: status, modifier: 'pending' };
  };

  const getRefundMethodDisplay = (method) => {
    if (method === 'credit') return 'Credit Balance';
    if (method === 'momo') return 'MoMo Wallet';
    if (method === 'bank_transfer') return 'Bank Transfer';
    return method;
  };

  return (
    <div className="orders-page">
      <h2>History & Transactions 🧾</h2>

      <div className="orders-tab-header">
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Order History
        </button>
        <button
          className={`tab-btn ${activeTab === 'refunds' ? 'active' : ''}`}
          onClick={() => setActiveTab('refunds')}
        >
          Refund History
        </button>
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <span>Loading...</span>
        </div>
      ) : activeTab === 'orders' ? (
        orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><ShoppingBag size={28} /></div>
            <h4>No orders yet</h4>
            <p>Your orders will appear here after you purchase a course.</p>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order Code</th>
                <th>Courses</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusInfo = getStatusDisplay(order.status);
                const items = order.orderItems || order.OrderItems || order.items || [];
                return (
                  <tr key={order.id}>
                    <td><span className="order-code">#{order.orderCode || order.id}</span></td>
                    <td>
                      <div className="order-courses-cell" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {items.map((item) => {
                          const course = item.course || item.Course || item;
                          return (
                            <div key={item.id || course.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img 
                                src={course.thumbnail || '/placeholder-course.png'} 
                                alt={course.name || course.title} 
                                style={{ width: '48px', height: '32px', borderRadius: '3px', objectFit: 'cover', flexShrink: 0 }} 
                              />
                              <Link 
                                to={`/courses/${course.slug}`} 
                                style={{ fontWeight: 700, fontSize: '0.88rem', color: 'inherit', textDecoration: 'none' }}
                                className="course-refund-link"
                              >
                                {course.name || course.title || 'Course'}
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td style={{ fontWeight: 700 }}>{formatPrice(order.totalAmount || order.total)}</td>
                    <td>
                      <span className={`order-status order-status--${statusInfo.modifier}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td>
                      <Link to={`${ROUTES.ORDERS}/${order.id}`} className="view-order-btn">
                        Details <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      ) : (
        refunds.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><RotateCcw size={28} /></div>
            <h4>No refund requests yet</h4>
            <p>Your refund transactions will be shown here.</p>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Requested Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((req) => {
                const statusInfo = getRefundStatusDisplay(req.status);
                return (
                  <tr key={req.id}>
                    <td>
                      <div className="refund-course-cell" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={req.course?.thumbnail || '/placeholder-course.png'} 
                          alt={req.course?.name} 
                          className="order-item-img" 
                          style={{ width: '64px', height: '42px', borderRadius: '4px', objectFit: 'cover', margin: 0 }}
                        />
                        <div>
                          <Link 
                            to={`/courses/${req.course?.slug}`} 
                            style={{ fontWeight: 700, color: 'inherit', textDecoration: 'none' }}
                            className="course-refund-link"
                          >
                            {req.course?.name || 'Course'}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td>{formatDate(req.createdAt)}</td>
                    <td style={{ fontWeight: 700 }}>{formatPrice(req.refundAmount)}</td>
                    <td>{getRefundMethodDisplay(req.method)}</td>
                    <td>
                      <span className={`order-status order-status--${statusInfo.modifier}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default OrderHistoryPage;
