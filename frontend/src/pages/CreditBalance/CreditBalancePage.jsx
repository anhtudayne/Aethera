import { useState, useEffect } from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, Loader } from 'lucide-react';
import { userApi } from '../../api/userApi';
import { refundApi } from '../../api/refundApi';
import { orderApi } from '../../api/orderApi';
import './CreditBalancePage.css';

const CreditBalancePage = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'refunds', 'purchases'
  const [visibleCount, setVisibleCount] = useState(5); // Show 5 initially, load 5 more on click

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch User Profile for balance
        const profileRes = await userApi.getProfile();
        const profile = profileRes.user || profileRes.data;
        const currentBalance = profile?.creditBalance || 0;
        setBalance(Number(currentBalance));

        // 2. Fetch Refund Requests
        const refundsRes = await refundApi.getMyRequests();
        const refundsList = refundsRes.data || [];

        // 3. Fetch Orders (to see if any order used credit or MoMo)
        const ordersRes = await orderApi.getMyOrders({ limit: 100 });
        const ordersList = ordersRes.data?.orders || [];

        // 4. Build credit transactions list
        const list = [];

        // Add all refund requests
        refundsList.forEach(req => {
          let type = 'credit';
          let methodLabel = 'Ví Credit';
          if (req.method === 'momo') {
            type = 'momo_refund';
            methodLabel = 'Ví MoMo';
          } else if (req.method === 'bank_transfer') {
            type = 'bank_refund';
            methodLabel = 'Ngân hàng';
          }

          list.push({
            id: `refund-${req.id}`,
            type,
            amount: Number(req.refundAmount),
            title: `Hoàn tiền: "${req.course?.name || 'Khóa học'}"`,
            date: new Date(req.completedAt || req.createdAt),
            status: req.status, // 'PROCESSING' or 'COMPLETED'
            methodLabel,
            category: 'refund'
          });
        });

        // Add all purchases using credit or other methods
        ordersList.forEach(order => {
          if (order.status === 'paid') {
            const courseNames = order.orderItems?.map(item => item.course?.name).filter(Boolean).join(', ') || 'Khóa học';
            const creditUsed = Number(order.creditUsed || 0);
            const totalAmount = Number(order.totalAmount || 0);

            if (creditUsed > 0) {
              list.push({
                id: `order-credit-${order.id}`,
                type: 'credit_debit',
                amount: creditUsed,
                title: `Thanh toán: ${courseNames}`,
                date: new Date(order.createdAt),
                status: 'COMPLETED',
                methodLabel: 'Ví Credit',
                category: 'purchase'
              });
            }

            // Also show MoMo payments to complete transaction history
            const cashAmount = totalAmount - creditUsed;
            if (cashAmount > 0 && order.paymentMethod === 'momo') {
              list.push({
                id: `order-momo-${order.id}`,
                type: 'momo_debit',
                amount: cashAmount,
                title: `Thanh toán: ${courseNames}`,
                date: new Date(order.createdAt),
                status: 'COMPLETED',
                methodLabel: 'Ví MoMo',
                category: 'purchase'
              });
            }
          }
        });

        // Sort by date descending
        list.sort((a, b) => b.date - a.date);
        setTransactions(list);
      } catch (err) {
        console.error('Error fetching credit data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString('vi-VN') + '₫';
  };

  const getFilteredTransactions = () => {
    if (activeTab === 'refunds') {
      return transactions.filter(tx => tx.category === 'refund');
    }
    if (activeTab === 'purchases') {
      return transactions.filter(tx => tx.category === 'purchase');
    }
    return transactions;
  };

  const filteredTx = getFilteredTransactions();
  const paginatedTx = filteredTx.slice(0, visibleCount);

  if (loading) {
    return (
      <div className="credit-loading-container">
        <Loader className="animate-spin" size={32} />
        <p>Đang tải lịch sử giao dịch...</p>
      </div>
    );
  }

  return (
    <div className="credit-balance-page">
      <div className="credit-header">
        <h1 className="credit-title">Số dư Credit</h1>
        <p className="credit-subtitle">Quản lý và theo dõi lịch sử hoàn tiền, chi tiêu của bạn trên Aethera.</p>
      </div>

      <div className="credit-card-panel">
        <div className="credit-card-info">
          <div className="credit-card-icon-wrapper">
            <Wallet size={32} />
          </div>
          <div className="credit-balance-info">
            <span className="credit-balance-label">Số dư khả dụng</span>
            <span className="credit-balance-value">{formatCurrency(balance)}</span>
          </div>
        </div>
        <div className="credit-card-rules">
          <h3>Cách sử dụng Aethera Credit:</h3>
          <ul>
            <li>Credit được tự động áp dụng khi thanh toán để giảm trừ trực tiếp vào hóa đơn.</li>
            <li>Nếu số dư Credit đủ chi trả toàn bộ khóa học, bạn chỉ cần trả 0₫ và vào học ngay.</li>
            <li>Credit tích lũy từ hoạt động hoàn tiền khóa học và không thể quy đổi thành tiền mặt.</li>
          </ul>
        </div>
      </div>

      <div className="credit-transactions-section">
        <div className="transactions-header-row">
          <h2 className="section-title">Lịch sử giao dịch</h2>
          
          <div className="transaction-tabs">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => { setActiveTab('all'); setVisibleCount(5); }}
            >
              Tất cả
            </button>
            <button 
              className={`tab-btn ${activeTab === 'refunds' ? 'active' : ''}`}
              onClick={() => { setActiveTab('refunds'); setVisibleCount(5); }}
            >
              Hoàn tiền
            </button>
            <button 
              className={`tab-btn ${activeTab === 'purchases' ? 'active' : ''}`}
              onClick={() => { setActiveTab('purchases'); setVisibleCount(5); }}
            >
              Đã chi tiêu
            </button>
          </div>
        </div>
        
        {filteredTx.length === 0 ? (
          <div className="empty-transactions">
            <p>Không có lịch sử giao dịch nào.</p>
          </div>
        ) : (
          <div className="transactions-wrapper">
            <div className="transactions-list">
              {paginatedTx.map(tx => {
                const isRefund = tx.category === 'refund';
                return (
                  <div key={tx.id} className="transaction-item">
                    <div className={`transaction-icon ${isRefund ? 'credit' : 'debit'}`}>
                      {isRefund ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-title-row">
                        <h4 className="transaction-item-title">{tx.title}</h4>
                        <span className={`transaction-status-badge ${tx.status.toLowerCase()}`}>
                          {tx.status === 'COMPLETED' ? 'Thành công' : 'Đang xử lý'}
                        </span>
                      </div>
                      <div className="transaction-meta-row">
                        <span className="transaction-date">
                          {tx.date.toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="transaction-divider">•</span>
                        <span className="transaction-method">
                          Phương thức: <strong>{tx.methodLabel}</strong>
                        </span>
                      </div>
                    </div>
                    <div className={`transaction-amount ${isRefund ? 'credit' : 'debit'}`}>
                      {isRefund ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTx.length > visibleCount && (
              <div className="load-more-container">
                <button 
                  className="load-more-btn"
                  onClick={() => setVisibleCount(prev => prev + 5)}
                >
                  Xem thêm lịch sử giao dịch
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditBalancePage;
