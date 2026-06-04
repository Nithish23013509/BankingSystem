import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/layout.css';

const routeTitles = {
  '/dashboard': { title: 'Dashboard', breadcrumb: 'Overview' },
  '/accounts': { title: 'Accounts', breadcrumb: 'All Accounts' },
  '/accounts/create': { title: 'Create Account', breadcrumb: 'New Account' },
  '/deposit': { title: 'Deposit', breadcrumb: 'Make a Deposit' },
  '/withdraw': { title: 'Withdraw', breadcrumb: 'Make a Withdrawal' },
  '/transfer': { title: 'Transfer', breadcrumb: 'Fund Transfer' },
};

function Navbar({ onToggleSidebar, user, onLogout, notificationCount = 0 }) {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const currentRoute = routeTitles[location.pathname] || {
    title: 'VaultBank',
    breadcrumb: '',
  };

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
  const initials = fullName
    ? fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'VB';

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      {/* Left Side */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          className="navbar__hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <div className="navbar__hamburger-lines">
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
          </div>
        </button>

        <div className="navbar__left">
          <h1 className="navbar__title">{currentRoute.title}</h1>
          <div className="navbar__breadcrumb">
            <span>Home</span>
            <span className="navbar__breadcrumb-separator">›</span>
            <span className="navbar__breadcrumb-current">
              {currentRoute.breadcrumb}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="navbar__right">
        {/* Search */}
        <div className="navbar__search">
          <span className="navbar__search-icon">🔍</span>
          <input
            type="text"
            className="navbar__search-input"
            placeholder="Search accounts, transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Notification Bell */}
        <button className="navbar__notification" aria-label="Notifications">
          🔔
          {notificationCount > 0 && (
            <span className="navbar__notification-badge">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* User Dropdown */}
        <div className="navbar__user" ref={dropdownRef}>
          <button
            className="navbar__user-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <div className="navbar__user-avatar">{initials}</div>
            <span className="navbar__user-name">
              {fullName || 'Guest'}
            </span>
            <span className="navbar__user-chevron">▼</span>
          </button>

          <div
            className={`navbar__dropdown ${
              dropdownOpen ? 'navbar__dropdown--open' : ''
            }`}
          >
            <button className="navbar__dropdown-item">
              <span>👤</span> Profile
            </button>
            <button className="navbar__dropdown-item">
              <span>⚙️</span> Settings
            </button>
            <div className="navbar__dropdown-separator" />
            <button
              className="navbar__dropdown-item navbar__dropdown-item--danger"
              onClick={() => {
                setDropdownOpen(false);
                onLogout?.();
              }}
            >
              <span>⏻</span> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
