import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import accountService from '../services/accountService';
import { useNotification } from '../context/NotificationContext';
import '../styles/forms.css';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);

export default function Deposit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addNotification } = useNotification();

  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  // Load accounts on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await accountService.getAllAccounts();
        const active = data.filter((a) => a.status === 'ACTIVE');
        setAccounts(active);

        // Pre-select from URL ?accountId=X
        const preselect = searchParams.get('accountId');
        if (preselect && active.some((a) => String(a.id) === String(preselect))) {
          setSelectedAccountId(preselect);
        }
      } catch {
        addNotification('Failed to load accounts', 'error');
      } finally {
        setLoadingAccounts(false);
      }
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedAccount = accounts.find((a) => String(a.id) === String(selectedAccountId));
  const numericAmount = parseFloat(amount) || 0;
  const balanceAfter = selectedAccount ? selectedAccount.balance + numericAmount : 0;

  const validate = useCallback(() => {
    const errs = {};
    if (!selectedAccountId) errs.account = 'Please select an account';
    if (!amount || numericAmount <= 0) errs.amount = 'Enter a valid amount greater than $0';
    return errs;
  }, [selectedAccountId, amount, numericAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const result = await accountService.deposit(selectedAccountId, numericAmount, description);
      addNotification(`Successfully deposited ${formatCurrency(numericAmount)}`, 'success');
      setSuccess({
        ...result,
        accountName: selectedAccount.accountHolderName,
        accountNumber: selectedAccount.accountNumber,
      });
    } catch (err) {
      addNotification(err.message || 'Deposit failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedAccountId('');
    setAmount('');
    setDescription('');
    setErrors({});
    setSuccess(null);
  };

  // Loading state
  if (loadingAccounts) {
    return (
      <div className="transaction-page">
        <div className="page-loading">
          <div className="loading-spinner" />
          <span className="loading-text">Loading accounts…</span>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="transaction-page">
        <div className="form-card">
          <div className="success-state">
            <div className="success-checkmark">
              <svg viewBox="0 0 24 24">
                <polyline points="6 12 10 16 18 8" />
              </svg>
            </div>
            <h2 className="success-title">Deposit Successful!</h2>
            <p className="success-subtitle">
              Your funds have been deposited successfully.
            </p>

            <div className="transaction-summary">
              <div className="summary-header">
                <span className="summary-label">Transaction Receipt</span>
                <span className="summary-label">{success.transactionId}</span>
              </div>
              <div className="summary-row">
                <span className="label">Account</span>
                <span className="value">{success.accountNumber}</span>
              </div>
              <div className="summary-row">
                <span className="label">Account Holder</span>
                <span className="value">{success.accountName}</span>
              </div>
              <div className="summary-row">
                <span className="label">Date</span>
                <span className="value">
                  {new Date(success.date).toLocaleString()}
                </span>
              </div>
              {success.description && (
                <div className="summary-row">
                  <span className="label">Note</span>
                  <span className="value">{success.description}</span>
                </div>
              )}
              <div className="summary-row">
                <span className="label">Status</span>
                <span className="value" style={{ color: '#00b894' }}>
                  ✓ {success.status}
                </span>
              </div>
              <div className="summary-row total">
                <span className="label">Amount Deposited</span>
                <span className="value success-amount">
                  +{formatCurrency(success.amount)}
                </span>
              </div>
              <div className="summary-row">
                <span className="label">New Balance</span>
                <span className="value">{formatCurrency(success.balanceAfter)}</span>
              </div>
            </div>

            <div className="success-actions">
              <button className="btn-action primary" onClick={handleReset}>
                💰 Make Another Deposit
              </button>
              <button
                className="btn-action secondary"
                onClick={() => navigate(`/accounts/${selectedAccountId}`)}
              >
                📄 View Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="transaction-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="icon">💰</span>
          Deposit Money
        </h1>
        <p className="page-subtitle">
          Add funds to any of your active accounts instantly.
        </p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          {/* Account Selector */}
          <div className="form-group">
            <label className="form-group">
              <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Select Account <span style={{ color: '#ff6b6b' }}>*</span>
              </span>
            </label>
            <select
              className={`form-select ${errors.account ? 'error' : ''}`}
              value={selectedAccountId}
              onChange={(e) => {
                setSelectedAccountId(e.target.value);
                setErrors((prev) => ({ ...prev, account: undefined }));
              }}
            >
              <option value="">— Choose an account —</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountNumber} · {acc.accountHolderName} · {formatCurrency(acc.balance)}
                </option>
              ))}
            </select>
            {errors.account && (
              <div className="form-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.account}
              </div>
            )}
          </div>

          {/* Amount Input */}
          <div className="form-group">
            <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Amount <span style={{ color: '#ff6b6b' }}>*</span>
            </label>
            <div className="amount-input-wrapper">
              <span className="amount-prefix">$</span>
              <input
                type="number"
                className={`form-input ${errors.amount ? 'error' : ''}`}
                placeholder="0.00"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors((prev) => ({ ...prev, amount: undefined }));
                }}
              />
            </div>
            {errors.amount && (
              <div className="form-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.amount}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Description / Note
            </label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Monthly salary, Savings deposit…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Balance Preview */}
          {selectedAccount && (
            <div className="balance-preview">
              <div className="balance-row">
                <span className="label">Current Balance</span>
                <span className="value">{formatCurrency(selectedAccount.balance)}</span>
              </div>
              {numericAmount > 0 && (
                <>
                  <div className="balance-row">
                    <span className="label">Deposit Amount</span>
                    <span className="value positive">+{formatCurrency(numericAmount)}</span>
                  </div>
                  <div className="balance-row">
                    <span className="label" style={{ fontWeight: 600, color: '#e8e8e8' }}>
                      Balance After Deposit
                    </span>
                    <span className="value positive" style={{ fontSize: 17 }}>
                      {formatCurrency(balanceAfter)}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit btn-deposit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner" />
                  Processing…
                </>
              ) : (
                '💰 Deposit Funds'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
