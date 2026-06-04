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

export default function Transfer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addNotification } = useNotification();

  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(null);

  // Load accounts on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await accountService.getAllAccounts();
        const active = data.filter((a) => a.status === 'ACTIVE');
        setAccounts(active);

        const preselect = searchParams.get('fromAccountId');
        if (preselect && active.some((a) => String(a.id) === String(preselect))) {
          setFromAccountId(preselect);
        }
      } catch {
        addNotification('Failed to load accounts', 'error');
      } finally {
        setLoadingAccounts(false);
      }
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fromAccount = accounts.find((a) => String(a.id) === String(fromAccountId));
  const toAccount = accounts.find((a) => String(a.id) === String(toAccountId));
  const numericAmount = parseFloat(amount) || 0;
  const insufficientFunds = fromAccount && numericAmount > 0 && numericAmount > fromAccount.balance;

  // Filter "to" accounts: exclude from account
  const toAccountOptions = accounts.filter((a) => String(a.id) !== String(fromAccountId));

  const validate = useCallback(() => {
    const errs = {};
    if (!fromAccountId) errs.from = 'Please select a source account';
    if (!toAccountId) errs.to = 'Please select a destination account';
    if (fromAccountId && toAccountId && fromAccountId === toAccountId) {
      errs.to = 'Source and destination accounts must be different';
    }
    if (!amount || numericAmount <= 0) errs.amount = 'Enter a valid amount greater than $0';
    if (fromAccount && numericAmount > fromAccount.balance) {
      errs.amount = 'Insufficient funds in source account';
    }
    return errs;
  }, [fromAccountId, toAccountId, amount, numericAmount, fromAccount]);

  const handlePreSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    try {
      const result = await accountService.transfer(fromAccountId, toAccountId, numericAmount, description);
      addNotification(`Successfully transferred ${formatCurrency(numericAmount)}`, 'success');
      setSuccess({
        ...result,
        fromName: fromAccount.accountHolderName,
        fromNumber: fromAccount.accountNumber,
        toName: toAccount.accountHolderName,
        toNumber: toAccount.accountNumber,
      });
    } catch (err) {
      if (err.message === 'Insufficient funds') {
        addNotification('Insufficient funds in the source account.', 'error');
        setErrors({ amount: 'Insufficient funds' });
      } else {
        addNotification(err.message || 'Transfer failed. Please try again.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFromAccountId('');
    setToAccountId('');
    setAmount('');
    setDescription('');
    setErrors({});
    setSuccess(null);
    setShowConfirm(false);
  };

  // Loading
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

  // Success
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
            <h2 className="success-title">Transfer Successful!</h2>
            <p className="success-subtitle">
              Your funds have been transferred between accounts.
            </p>

            <div className="transaction-summary">
              <div className="summary-header">
                <span className="summary-label">Transfer Receipt</span>
                <span className="summary-label">{success.transactionId}</span>
              </div>
              <div className="summary-row">
                <span className="label">From Account</span>
                <span className="value">{success.fromNumber}</span>
              </div>
              <div className="summary-row">
                <span className="label">From Holder</span>
                <span className="value">{success.fromName}</span>
              </div>
              <div className="summary-row">
                <span className="label">To Account</span>
                <span className="value">{success.toNumber}</span>
              </div>
              <div className="summary-row">
                <span className="label">To Holder</span>
                <span className="value">{success.toName}</span>
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
                <span className="label">Fees</span>
                <span className="value" style={{ color: '#00b894' }}>$0.00</span>
              </div>
              <div className="summary-row">
                <span className="label">Status</span>
                <span className="value" style={{ color: '#00b894' }}>
                  ✓ {success.status}
                </span>
              </div>
              <div className="summary-row total">
                <span className="label">Amount Transferred</span>
                <span className="value success-amount">
                  {formatCurrency(success.amount)}
                </span>
              </div>
              <div className="summary-row">
                <span className="label">Source New Balance</span>
                <span className="value">{formatCurrency(success.fromBalanceAfter)}</span>
              </div>
              <div className="summary-row">
                <span className="label">Destination New Balance</span>
                <span className="value">{formatCurrency(success.toBalanceAfter)}</span>
              </div>
            </div>

            <div className="success-actions">
              <button className="btn-action primary" onClick={handleReset}>
                🔄 Make Another Transfer
              </button>
              <button
                className="btn-action secondary"
                onClick={() => navigate('/accounts')}
              >
                📄 View Accounts
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="transaction-page">
      <div className="page-header">
        <h1 className="page-title">
          <span className="icon">🔄</span>
          Transfer Money
        </h1>
        <p className="page-subtitle">
          Move funds seamlessly between your accounts.
        </p>
      </div>

      <div className="form-card">
        <form onSubmit={handlePreSubmit} noValidate>
          {/* From Account */}
          <div className="form-group">
            <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              From Account <span style={{ color: '#ff6b6b' }}>*</span>
            </label>
            <select
              className={`form-select ${errors.from ? 'error' : ''}`}
              value={fromAccountId}
              onChange={(e) => {
                setFromAccountId(e.target.value);
                // Clear "to" if it becomes same as new "from"
                if (e.target.value === toAccountId) setToAccountId('');
                setErrors((prev) => ({ ...prev, from: undefined }));
              }}
            >
              <option value="">— Choose source account —</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountNumber} · {acc.accountHolderName} · {formatCurrency(acc.balance)}
                </option>
              ))}
            </select>
            {errors.from && (
              <div className="form-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.from}
              </div>
            )}
          </div>

          {/* Transfer Arrow */}
          <div className="transfer-flow">
            <div className="transfer-arrow">
              <div className="arrow-line" />
              <span className="arrow-icon">↓</span>
              <div className="arrow-line" />
            </div>
          </div>

          {/* To Account */}
          <div className="form-group">
            <label style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              To Account <span style={{ color: '#ff6b6b' }}>*</span>
            </label>
            <select
              className={`form-select ${errors.to ? 'error' : ''}`}
              value={toAccountId}
              onChange={(e) => {
                setToAccountId(e.target.value);
                setErrors((prev) => ({ ...prev, to: undefined }));
              }}
              disabled={!fromAccountId}
            >
              <option value="">— Choose destination account —</option>
              {toAccountOptions.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountNumber} · {acc.accountHolderName} · {formatCurrency(acc.balance)}
                </option>
              ))}
            </select>
            {!fromAccountId && (
              <div className="form-hint" style={{ marginTop: 6, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                Select a source account first
              </div>
            )}
            {errors.to && (
              <div className="form-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.to}
              </div>
            )}
          </div>

          {/* Amount */}
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
              placeholder="e.g. Rent payment, Investment transfer…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Transfer Summary Preview */}
          {fromAccount && toAccount && numericAmount > 0 && (
            <div className="transfer-preview">
              <div className="preview-title">Transfer Summary</div>
              <div className="preview-flow">
                <div className="preview-account">
                  <div className="account-label">From</div>
                  <div className="account-name">{fromAccount.accountHolderName}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                    {fromAccount.accountNumber}
                  </div>
                </div>
                <span className="preview-arrow">→</span>
                <div className="preview-account">
                  <div className="account-label">To</div>
                  <div className="account-name">{toAccount.accountHolderName}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                    {toAccount.accountNumber}
                  </div>
                </div>
              </div>
              <div className="summary-row">
                <span className="label">Transfer Amount</span>
                <span className="value" style={{ color: '#a29bfe', fontWeight: 700 }}>
                  {formatCurrency(numericAmount)}
                </span>
              </div>
              <div className="summary-row">
                <span className="label">Fees</span>
                <span className="value" style={{ color: '#00b894' }}>$0.00</span>
              </div>
              <div className="summary-row">
                <span className="label">Source Balance After</span>
                <span className={`value ${insufficientFunds ? 'negative' : ''}`}>
                  {insufficientFunds ? '−' : ''}{formatCurrency(Math.abs(fromAccount.balance - numericAmount))}
                </span>
              </div>
              <div className="summary-row">
                <span className="label">Destination Balance After</span>
                <span className="value positive" style={{ color: '#00b894' }}>
                  {formatCurrency(toAccount.balance + numericAmount)}
                </span>
              </div>
            </div>
          )}

          {/* Balance preview for source only */}
          {fromAccount && (!toAccount || numericAmount <= 0) && (
            <div className="balance-preview">
              <div className="balance-row">
                <span className="label">Source Current Balance</span>
                <span className="value">{formatCurrency(fromAccount.balance)}</span>
              </div>
            </div>
          )}

          {/* Insufficient funds warning */}
          {insufficientFunds && (
            <div className="insufficient-warning">
              <span className="warn-icon">⚠️</span>
              Insufficient funds — the transfer amount exceeds the source account balance
              of {formatCurrency(fromAccount.balance)}.
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
              className="btn-submit btn-transfer"
              disabled={submitting || insufficientFunds}
            >
              {submitting ? (
                <>
                  <span className="spinner" />
                  Processing…
                </>
              ) : (
                '🔄 Transfer Funds'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="confirmation-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirmation-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title">Confirm Transfer</h3>
            <p className="confirm-subtitle">
              Please review the details below before confirming.
            </p>

            <div className="transaction-summary" style={{ margin: '0 0 24px 0' }}>
              <div className="summary-row">
                <span className="label">From</span>
                <span className="value">{fromAccount?.accountNumber}</span>
              </div>
              <div className="summary-row">
                <span className="label">To</span>
                <span className="value">{toAccount?.accountNumber}</span>
              </div>
              <div className="summary-row">
                <span className="label">Amount</span>
                <span className="value" style={{ color: '#a29bfe', fontWeight: 700 }}>
                  {formatCurrency(numericAmount)}
                </span>
              </div>
              <div className="summary-row">
                <span className="label">Fees</span>
                <span className="value" style={{ color: '#00b894' }}>$0.00</span>
              </div>
              {description && (
                <div className="summary-row">
                  <span className="label">Note</span>
                  <span className="value">{description}</span>
                </div>
              )}
            </div>

            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowConfirm(false)}
                style={{ textAlign: 'center' }}
              >
                Cancel
              </button>
              <button
                className="btn-submit btn-transfer"
                onClick={handleConfirm}
                style={{ margin: 0 }}
              >
                ✓ Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
