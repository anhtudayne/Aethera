import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import { ROUTES } from '../../utils/constants';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderApi.getMyOrders({ page: 1, limit: 20 });
        setOrders(res.data?.orders || res.data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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

  return (
    <div className="orders-page">
      <h2>Lịch sử đơn hàng 🧾</h2>

      {loading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <span>Đang tải...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><ShoppingBag size={28} /></div>
          <h4>Chưa có đơn hàng nào</h4>
          <p>Đơn hàng của bạn sẽ hiển thị ở đây sau khi mua khóa học.</p>
        </div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const statusInfo = getStatusDisplay(order.status);
              return (
                <tr key={order.id}>
                  <td><span className="order-code">#{order.orderCode || order.id}</span></td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(order.totalAmount || order.total)}</td>
                  <td>
                    <span className={`order-status order-status--${statusInfo.modifier}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td>
                    <Link to={`${ROUTES.ORDERS}/${order.id}`} className="view-order-btn">
                      Chi tiết <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistoryPage;
