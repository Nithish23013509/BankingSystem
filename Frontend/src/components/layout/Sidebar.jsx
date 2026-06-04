import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/layout.css';

const navItems = [
  { label: 'Main Menu', type: 'label' },
  { path: '/dashboard', icon: '📊', text: 'Dashboard' },
  { path: '/accounts', icon: '💳', text: 'Accounts' },
  { path: '/accounts/create', icon: '➕', text: 'Create Account' },
  { label: 'Transactions', type: 'label' },
  { path: '/deposit', icon: '💰', text: 'Deposit' },
  { path: '/withdraw', icon: '🏧', text: 'Withdraw' },
  { path: '/transfer', icon: '🔄', text: 'Transfer' },
];

function Sidebar({ isOpen, onClose, user, onLogout }) {
  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
  const initials = fullName
    ? fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'VB';

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">◈</div>
        <span className="sidebar__logo-text">VaultBank</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {navItems.map((item, index) => {
          if (item.type === 'label') {
            return (
              <div key={`label-${index}`} className="sidebar__nav-label">
                {item.label}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar__nav-link${isActive ? ' sidebar__nav-link--active' : ''}`
              }
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              <span className="sidebar__nav-text">{item.text}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="sidebar__profile">
        <div className="sidebar__avatar">{initials}</div>
        <div className="sidebar__user-info">
          <div className="sidebar__user-name">{fullName || 'Guest User'}</div>
          <div className="sidebar__user-role">{user?.role || 'Customer'}</div>
        </div>
        <button
          className="sidebar__logout-btn"
          onClick={onLogout}
          title="Logout"
          aria-label="Logout"
        >
          ⏻
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
