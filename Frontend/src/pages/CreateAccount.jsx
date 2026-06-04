import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  if (values.initialDeposit === '' || values.initialDeposit === undefined) {
    errors.initialDeposit = 'Initial deposit amount is required';
  } else if (Number(values.initialDeposit) < 0) {
    errors.initialDeposit = 'Deposit amount cannot be negative';
  }

  return errors;
}

export default function CreateAccount() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [values, setValues] = useState({
    holderName: '',
    email: '',
    type: '',
    initialDeposit: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
      initialDeposit: true,
    });

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setSubmitting(true);
      await accountService.createAccount(values);
      showSuccess('Account created successfully!');
      navigate('/accounts');
    } catch {
      showError('Failed to create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <button className="form-back-link" onClick={() => navigate('/accounts')}>
        <ArrowLeftIcon />
        Back to Accounts
      </button>

      <div className="form-card">
        <div className="form-card-header">
          <h1>Create New Account</h1>
          <p>Fill in the details below to open a new banking account.</p>
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

          {/* Row: Account Type + Initial Deposit */}
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
                Initial Deposit <span className="required">*</span>
              </label>
              <div className="input-with-prefix">
                <span className="input-prefix">$</span>
                <input
                  type="number"
                  name="initialDeposit"
                  className={`form-input ${errors.initialDeposit && touched.initialDeposit ? 'error' : ''}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={values.initialDeposit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {errors.initialDeposit && touched.initialDeposit && (
                <div className="form-error">
                  <AlertCircleIcon />
                  {errors.initialDeposit}
                </div>
              )}
              <div className="form-hint">Minimum deposit: $0.00</div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <Link to="/accounts" className="btn-cancel">
              Cancel
            </Link>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="btn-spinner" />
                  Creating…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
