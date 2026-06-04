import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import accountService from '../services/accountService';
import { useNotification } from '../hooks/useNotification';
import '../styles/accounts.css';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ---- Icons ---- */
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DepositIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

const WithdrawIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const TransferIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ==== Component ==== */
export default function AccountDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadAccount();
  }, [id]);

  async function loadAccount() {
    try {
      setLoading(true);
      setError(null);
      const [accountData, txns] = await Promise.all([
        accountService.getAccountById(id),
        accountService.getTransactionsByAccountId(id),
      ]);
      setAccount(accountData);
      setTransactions(txns);
    } catch {
      setError('Account not found');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      await accountService.deleteAccount(id);
      showSuccess('Account deleted successfully');
      navigate('/accounts');
    } catch {
      showError('Failed to delete account');
    } finally {
      setDeleting(false);
    }
  }

  /* Loading */
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <span className="loading-text">Loading account details…</span>
      </div>
    );
  }

  /* Error */
  if (error || !account) {
    return (
      <div className="account-error">
        <div className="account-error-icon">
          <AlertCircleIcon />
        </div>
        <h3>Account Not Found</h3>
        <p>The account you're looking for doesn't exist or has been removed.</p>
        <Link to="/accounts" className="btn-go-back">
          <ArrowLeftIcon /> Go Back to Accounts
        </Link>
      </div>
    );
  }

  return (
    <div className="account-details">
      {/* Header */}
      <div className="account-details-header">
        <div className="account-details-title">
          <button className="btn-back" onClick={() => navigate('/accounts')}>
            <ArrowLeftIcon />
          </button>
          <div>
            <h1>{account.accountHolderName}</h1>
            <div className="account-num">{account.accountNumber}</div>
          </div>
          <span className={`badge badge-${account.status.toLowerCase()}`}>
            {account.status}
          </span>
        </div>
        <div className="account-detail-actions">
          <Link to={`/accounts/update/${id}`} className="btn-detail-action edit">
            <EditIcon /> Edit
          </Link>
          <button className="btn-detail-action deposit" onClick={() => navigate(`/deposit?accountId=${id}`)}>
            <DepositIcon /> Deposit
          </button>
          <button className="btn-detail-action withdraw" onClick={() => navigate(`/withdraw?accountId=${id}`)}>
            <WithdrawIcon /> Withdraw
          </button>
          <button className="btn-detail-action transfer" onClick={() => navigate(`/transfer?accountId=${id}`)}>
            <TransferIcon /> Transfer
          </button>
          <button className="btn-detail-action delete-action" onClick={() => setShowDeleteModal(true)}>
            <TrashIcon /> Delete
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="account-info-card">
        <div className="account-info-balance-section">
          <div className="balance-display">
            <label>Current Balance</label>
            <div className="balance-amount">
              <span className="currency">$</span>
              {formatCurrency(account.balance)}
            </div>
          </div>
          <span className={`badge badge-${account.accountType.toLowerCase()}`}>{account.accountType} Account</span>
        </div>
        <div className="account-info-grid">
          <div className="info-item">
            <label>Account Holder</label>
            <span>{account.accountHolderName}</span>
          </div>
          <div className="info-item">
            <label>Email Address</label>
            <span>{account.email}</span>
          </div>
          <div className="info-item">
            <label>Account Type</label>
            <span>{account.accountType}</span>
          </div>
          <div className="info-item">
            <label>Currency</label>
            <span>{account.currency}</span>
          </div>
          <div className="info-item">
            <label>Created</label>
            <span>{formatDate(account.createdAt)}</span>
          </div>
          <div className="info-item">
            <label>Last Updated</label>
            <span>{formatDate(account.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="transactions-section">
        <h2>Transaction History</h2>
        <div className="transactions-table-wrapper">
          {transactions.length === 0 ? (
            <div className="transactions-empty">
              No transactions found for this account.
            </div>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td>{formatDate(txn.date)}</td>
                    <td>
                      <span className={`badge badge-${txn.type.toLowerCase()}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td>{txn.description}</td>
                    <td
                      className={`txn-amount ${txn.type === 'DEPOSIT' ? 'credit' : 'debit'}`}
                    >
                      {txn.type === 'DEPOSIT' ? '+' : '−'}${formatCurrency(txn.amount)}
                    </td>
                    <td>
                      <span className={`badge badge-${txn.status.toLowerCase()}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Account</h3>
            <p>
              Are you sure you want to delete{' '}
              <strong>{account.accountNumber}</strong>? This will permanently
              remove the account and all associated data.
            </p>
            <div className="modal-actions">
              <button
                className="btn-modal-cancel"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn-modal-delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
