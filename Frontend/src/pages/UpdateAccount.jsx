import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import accountService from '../services/accountService';
import { useNotification } from '../hooks/useNotification';
import '../styles/forms.css';

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

function validate(values) {
  const errors = {};

  if (!values.holderName.trim()) {
    errors.holderName = 'Account holder name is required';
  } else if (values.holderName.trim().length < 2) {
    errors.holderName = 'Name must be at least 2 characters';
  }

  if (!values.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!values.type) {
    errors.type = 'Please select an account type';
  }

  if (!values.status) {
    errors.status = 'Please select a status';
  }

  return errors;
}

export default function UpdateAccount() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [values, setValues] = useState({
    holderName: '',
    email: '',
    type: '',
    status: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    loadAccount();
  }, [id]);

  async function loadAccount() {
    try {
      setLoading(true);
      setFetchError(null);
      const account = await accountService.getAccountById(id);
      setValues({
        holderName: account.accountHolderName || account.holderName,
        email: account.email,
        type: account.accountType || account.type,
        status: account.status,
      });
    } catch {
      setFetchError('Account not found');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate({ ...values, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(values);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({
      holderName: true,
      email: true,
      type: true,
      status: true,
    });

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setSubmitting(true);
      await accountService.updateAccount(id, values);
      showSuccess('Account updated successfully!');
      navigate(`/accounts/${id}`);
    } catch {
      showError('Failed to update account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  /* Loading state */
  if (loading) {
    return (
      <div className="form-card" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="form-loading">
          <div className="form-loading-spinner" />
          <span className="form-loading-text">Loading account data…</span>
        </div>
      </div>
    );
  }

  /* Fetch error */
  if (fetchError) {
    return (
      <div className="account-error">
        <div className="account-error-icon">
          <AlertCircleIcon />
        </div>
        <h3>Account Not Found</h3>
        <p>The account you're trying to edit doesn't exist or has been removed.</p>
        <Link to="/accounts" className="btn-go-back">
          <ArrowLeftIcon /> Go Back to Accounts
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button className="form-back-link" onClick={() => navigate(`/accounts/${id}`)}>
        <ArrowLeftIcon />
        Back to Account Details
      </button>

      <div className="form-card">
        <div className="form-card-header">
          <h1>Update Account</h1>
          <p>Modify the account information below and save your changes.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Holder Name */}
          <div className="form-group">
            <label>
              Account Holder Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="holderName"
              className={`form-input ${errors.holderName && touched.holderName ? 'error' : ''}`}
              placeholder="e.g. John Smith"
              value={values.holderName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.holderName && touched.holderName && (
              <div className="form-error">
                <AlertCircleIcon />
                {errors.holderName}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
              placeholder="e.g. john@example.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && (
              <div className="form-error">
                <AlertCircleIcon />
                {errors.email}
              </div>
            )}
          </div>

          {/* Row: Account Type + Status */}
          <div className="form-row">
            <div className="form-group">
              <label>
                Account Type <span className="required">*</span>
              </label>
              <select
                name="type"
                className={`form-select ${errors.type && touched.type ? 'error' : ''}`}
                value={values.type}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select type…</option>
                <option value="SAVINGS">Savings</option>
                <option value="CHECKING">Checking</option>
                <option value="BUSINESS">Business</option>
              </select>
              {errors.type && touched.type && (
                <div className="form-error">
                  <AlertCircleIcon />
                  {errors.type}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>
                Status <span className="required">*</span>
              </label>
              <select
                name="status"
                className={`form-select ${errors.status && touched.status ? 'error' : ''}`}
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select status…</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              {errors.status && touched.status && (
                <div className="form-error">
                  <AlertCircleIcon />
                  {errors.status}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <Link to={`/accounts/${id}`} className="btn-cancel">
              Cancel
            </Link>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="btn-spinner" />
                  Saving…
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
