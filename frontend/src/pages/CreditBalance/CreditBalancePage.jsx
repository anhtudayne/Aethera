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

        // 3. Fetch Orders (to see if any order used credit)
        const ordersRes = await orderApi.getMyOrders({ limit: 100 });
        const ordersList = ordersRes.data?.orders || [];

        // 4. Build credit transactions list
        const list = [];

        // Additions (completed credit refunds)
        refundsList.forEach(req => {
          if (req.method === 'credit' && req.status === 'COMPLETED') {
            list.push({
              id: `refund-${req.id}`,
              type: 'credit',
              amount: Number(req.refundAmount),
              title: `Refund for "${req.course?.name || 'Course'}"`,
              date: new Date(req.completedAt || req.createdAt),
            });
          }
        });

        // Deductions (paid orders using credit)
        ordersList.forEach(order => {
          if (Number(order.creditUsed) > 0 && order.status === 'paid') {
            const courseNames = order.orderItems?.map(item => item.course?.name).filter(Boolean).join(', ') || 'Courses';
            list.push({
              id: `order-${order.id}`,
              type: 'debit',
              amount: Number(order.creditUsed),
              title: `Purchased: ${courseNames}`,
              date: new Date(order.createdAt),
            });
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

  if (loading) {
    return (
      <div className="credit-loading-container">
        <Loader className="animate-spin" size={32} />
        <p>Loading credit details...</p>
      </div>
    );
  }

  return (
    <div className="credit-balance-page">
      <div className="credit-header">
        <h1 className="credit-title">Credit Balance</h1>
        <p className="credit-subtitle">Manage and track your virtual currency on Aethera.</p>
      </div>

      <div className="credit-card-panel">
        <div className="credit-card-info">
          <div className="credit-card-icon-wrapper">
            <Wallet size={32} />
          </div>
          <div className="credit-balance-info">
            <span className="credit-balance-label">Available Balance</span>
            <span className="credit-balance-value">{formatCurrency(balance)}</span>
          </div>
        </div>
        <div className="credit-card-rules">
          <h3>How to use Aethera Credit:</h3>
          <ul>
            <li>Credit is automatically applied at checkout to discount your total purchase amount.</li>
            <li>If your credit balance covers the full order amount, you pay 0₫ and get instant access.</li>
            <li>Credits are non-transferable and cannot be exchanged for cash.</li>
          </ul>
        </div>
      </div>

      <div className="credit-transactions-section">
        <h2 className="section-title">Transaction History</h2>
        
        {transactions.length === 0 ? (
          <div className="empty-transactions">
            <p>No credit transactions yet.</p>
          </div>
        ) : (
          <div className="transactions-list">
            {transactions.map(tx => (
              <div key={tx.id} className="transaction-item">
                <div className={`transaction-icon ${tx.type}`}>
                  {tx.type === 'credit' ? (
                    <ArrowDownRight size={20} />
                  ) : (
                    <ArrowUpRight size={20} />
                  )}
                </div>
                <div className="transaction-details">
                  <h4 className="transaction-item-title">{tx.title}</h4>
                  <span className="transaction-date">
                    {tx.date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className={`transaction-amount ${tx.type}`}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditBalancePage;
