import { useState, useEffect } from 'react';
import { Wallet, ArrowDownRight, Loader } from 'lucide-react';
import { userApi } from '../../api/userApi';
import { refundApi } from '../../api/refundApi';
import './CreditBalancePage.css';

const CreditBalancePage = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refunds, setRefunds] = useState([]);
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

        // 3. Build refunds list
        const list = [];

        // Add all refund requests
        refundsList.forEach(req => {
          let methodLabel = 'Credit Wallet';
          if (req.method === 'momo') {
            methodLabel = 'MoMo';
          } else if (req.method === 'bank_transfer') {
            methodLabel = 'Bank Transfer';
          }

          list.push({
            id: `refund-${req.id}`,
            amount: Number(req.refundAmount),
            title: `Refund: "${req.course?.name || 'Course'}"`,
            date: new Date(req.completedAt || req.createdAt),
            status: req.status, // 'PROCESSING' or 'COMPLETED'
            methodLabel
          });
        });

        // Sort by date descending
        list.sort((a, b) => b.date - a.date);
        setRefunds(list);
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

  const paginatedRefunds = refunds.slice(0, visibleCount);

  if (loading) {
    return (
      <div className="credit-loading-container">
        <Loader className="animate-spin" size={32} />
        <p>Loading refund history...</p>
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
        <div className="transactions-header-row">
          <h2 className="section-title">Refund History</h2>
        </div>
        
        {refunds.length === 0 ? (
          <div className="empty-transactions">
            <p>No refund history available.</p>
          </div>
        ) : (
          <div className="transactions-wrapper">
            <div className="transactions-list">
              {paginatedRefunds.map(req => (
                <div key={req.id} className="transaction-item">
                  <div className="transaction-icon credit">
                    <ArrowDownRight size={20} />
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-title-row">
                      <h4 className="transaction-item-title">{req.title}</h4>
                      <span className={`transaction-status-badge ${req.status.toLowerCase()}`}>
                        {req.status === 'COMPLETED' ? 'Completed' : 'Processing'}
                      </span>
                    </div>
                    <div className="transaction-meta-row">
                      <span className="transaction-date">
                        {req.date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="transaction-divider">•</span>
                      <span className="transaction-method">
                        Method: <strong>{req.methodLabel}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="transaction-amount credit">
                    +{formatCurrency(req.amount)}
                  </div>
                </div>
              ))}
            </div>

            {refunds.length > visibleCount && (
              <div className="load-more-container">
                <button 
                  className="load-more-btn"
                  onClick={() => setVisibleCount(prev => prev + 5)}
                >
                  Load More History
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
