import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';
import { useNotification } from '../hooks/useNotification';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  const { register, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setShakeError(true);
      const timer = setTimeout(() => setShakeError(false), 600);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    
    const success = await register(email, password);
    if (success) {
      showSuccess('Registration successful! Please sign in.');
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="login-page">
      {/* Animated background particles */}
      <div className="login-bg">
        <div className="login-bg__shape login-bg__shape--1" />
        <div className="login-bg__shape login-bg__shape--2" />
        <div className="login-bg__shape login-bg__shape--3" />
        <div className="login-bg__shape login-bg__shape--4" />
        <div className="login-bg__shape login-bg__shape--5" />
        <div className="login-bg__shape login-bg__shape--6" />
        <div className="login-bg__circle login-bg__circle--1" />
        <div className="login-bg__circle login-bg__circle--2" />
        <div className="login-bg__circle login-bg__circle--3" />
      </div>

      <div className={`login-card ${shakeError ? 'login-card--shake' : ''}`}>
        {/* Logo */}
        <div className="login-card__logo">
          <div className="login-card__logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="18" width="32" height="18" rx="3" stroke="url(#logoGrad)" strokeWidth="2.5" />
              <path d="M20 4L32 18H8L20 4Z" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinejoin="round" />
              <rect x="16" y="24" width="8" height="6" rx="1" fill="url(#logoGrad)" />
              <defs>
                <linearGradient id="logoGrad" x1="4" y1="4" x2="36" y2="36">
                  <stop stopColor="#6c5ce7" />
                  <stop offset="1" stopColor="#a29bfe" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="login-card__brand">VaultBank</span>
        </div>

        {/* Heading */}
        <h1 className="login-card__title">Create Account</h1>
        <p className="login-card__subtitle">Join us to manage your finances</p>

        {/* Error message */}
        {error && (
          <div className="login-card__error">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#ff6b6b" strokeWidth="1.5" />
              <path d="M8 4.5V9" stroke="#ff6b6b" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="11.5" r="0.75" fill="#ff6b6b" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="login-card__form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="login-input-group">
            <label className="login-input-group__label" htmlFor="email">Email Address</label>
            <div className="login-input-group__wrapper">
              <span className="login-input-group__icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M2 6L9 10.5L16 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                className="login-input-group__input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-input-group">
            <label className="login-input-group__label" htmlFor="password">Password</label>
            <div className="login-input-group__wrapper">
              <span className="login-input-group__icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="4" y="8" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M6 8V5.5C6 3.84 7.34 2.5 9 2.5C10.66 2.5 12 3.84 12 5.5V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="9" cy="12.5" r="1" fill="currentColor" />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="login-input-group__input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="login-input-group__toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 2L16 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M3.5 6.5C2.5 7.5 2 9 2 9C2 9 5 14 9 14C10 14 10.9 13.7 11.7 13.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M7.5 4.2C8 4.1 8.5 4 9 4C13 4 16 9 16 9C16 9 15.5 10 14.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 9C2 9 5 4 9 4C13 4 16 9 16 9C16 9 13 14 9 14C5 14 2 9 2 9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                    <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="login-input-group">
            <label className="login-input-group__label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="login-input-group__wrapper">
              <span className="login-input-group__icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="4" y="8" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M6 8V5.5C6 3.84 7.34 2.5 9 2.5C10.66 2.5 12 3.84 12 5.5V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="9" cy="12.5" r="1" fill="currentColor" />
                </svg>
              </span>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className="login-input-group__input"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`login-card__submit ${loading ? 'login-card__submit--loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner" />
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Sign in link */}
        <div className="login-card__hint" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <span>Already have an account? </span>
          <a href="/login" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Sign in</a>
        </div>
      </div>
    </div>
  );
}
