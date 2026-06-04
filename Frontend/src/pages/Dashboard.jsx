import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/common/StatCard';
import accountService from '../services/accountService';
import { dashboardStats, mockTransactions } from '../data/mockData';
import '../styles/dashboard.css';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getTodayString() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const transactions = mockTransactions.slice(0, 8);
  const stats = dashboardStats;

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const acctData = await accountService.getAllAccounts();
        if (!cancelled) {
          setAccounts(acctData);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }
    loadData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="dash-loading__spinner" />
        <p className="dash-loading__text">Loading your dashboard...</p>
      </div>
    );
  }

  const firstName = user?.firstName || 'User';

  const quickActions = [
    { label: 'Deposit', color: '#00b894', path: '/deposit', icon: '💰' },
    { label: 'Withdraw', color: '#ff6b6b', path: '/withdraw', icon: '🏧' },
    { label: 'Transfer', color: '#6c5ce7', path: '/transfer', icon: '🔄' },
    { label: 'New Account', color: '#00cec9', path: '/accounts/create', icon: '➕' },
  ];

  const accountTypeColors = {
    SAVINGS: '#00b894',
    CHECKING: '#6c5ce7',
    BUSINESS: '#00cec9',
  };

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-header__left">
          <h1 className="dash-header__greeting">
            {getGreeting()}, <span className="dash-header__name">{firstName}</span>
          </h1>
          <p className="dash-header__date">{getTodayString()}</p>
        </div>
      </header>

      <section className="dash-stats">
        <StatCard
          title="Total Balance"
          value={`$${formatCurrency(accounts.filter(a => a.status === 'ACTIVE').reduce((sum, a) => sum + a.balance, 0))}`}
          icon="💳"
          trend="up"
          trendValue="+12.5%"
          color="purple"
        />
        <StatCard
          title="Total Accounts"
          value={String(accounts.length)}
          icon="📊"
          trend="up"
          trendValue={`+${accounts.length}`}
          color="teal"
        />
        <StatCard
          title="Monthly Income"
          value={`$${formatCurrency(stats.monthlyIncome)}`}
          icon="📈"
          trend="up"
          trendValue="+8.3%"
          color="green"
        />
        <StatCard
          title="Monthly Expenses"
          value={`$${formatCurrency(stats.monthlyExpenses)}`}
          icon="📉"
          trend="down"
          trendValue="-3.1%"
          color="red"
        />
      </section>

      <section className="dash-main">
        <div className="dash-card dash-transactions">
          <div className="dash-card__header">
            <h2 className="dash-card__title">Recent Transactions</h2>
            <button className="dash-card__link" onClick={() => navigate('/accounts')}>View All →</button>
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td>
                      <span className={`dash-badge dash-badge--${txn.type.toLowerCase()}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="dash-table__desc">{txn.description}</td>
                    <td className={txn.type === 'DEPOSIT' ? 'dash-table__amount--pos' : 'dash-table__amount--neg'}>
                      {txn.type === 'DEPOSIT' ? '+' : '-'}${formatCurrency(txn.amount)}
                    </td>
                    <td className="dash-table__date">{formatDate(txn.date)}</td>
                    <td>
                      <span className={`dash-status dash-status--${txn.status.toLowerCase()}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dash-card dash-quick-actions">
          <div className="dash-card__header">
            <h2 className="dash-card__title">Quick Actions</h2>
          </div>
          <div className="dash-actions-grid">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="dash-action-btn"
                style={{ '--action-color': action.color }}
                onClick={() => navigate(action.path)}
              >
                <span className="dash-action-btn__icon">{action.icon}</span>
                <span className="dash-action-btn__label">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="dash-accounts-section">
        <div className="dash-card">
          <div className="dash-card__header">
            <h2 className="dash-card__title">Account Overview</h2>
            <button className="dash-card__link" onClick={() => navigate('/accounts')}>Manage →</button>
          </div>
          <div className="dash-accounts-scroll">
            {accounts.map((acct) => (
              <div 
                key={acct.id} 
                className="dash-account-card"
                onClick={() => navigate(`/accounts/${acct.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="dash-account-card__icon"
                  style={{ color: accountTypeColors[acct.accountType] || '#6c5ce7' }}
                >
                  {acct.accountType === 'SAVINGS' ? '🏦' : acct.accountType === 'CHECKING' ? '💳' : '🏢'}
                </div>
                <div className="dash-account-card__info">
                  <span className="dash-account-card__type">{acct.accountType}</span>
                  <span className="dash-account-card__number">****{acct.accountNumber.slice(-4)}</span>
                  <span className="dash-account-card__holder">{acct.accountHolderName}</span>
                </div>
                <div className="dash-account-card__right">
                  <span className="dash-account-card__balance">
                    ${formatCurrency(acct.balance)}
                  </span>
                  <span className={`dash-status dash-status--${acct.status.toLowerCase()}`}>
                    {acct.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
