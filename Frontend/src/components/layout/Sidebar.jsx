import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

const allNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '⊞', roles: ['ADMIN', 'USER'] },
  { to: '/accounts', label: 'Accounts', icon: '◫', roles: ['ADMIN'] },
  { to: '/users', label: 'Users', icon: '👥', roles: ['ADMIN'] },
  { to: '/accounts/create', label: 'New Account', icon: '+', roles: ['ADMIN'] },
  { to: '/deposit', label: 'Deposit', icon: '↓', roles: ['ADMIN', 'USER'] },
  { to: '/withdraw', label: 'Withdraw', icon: '↑', roles: ['ADMIN', 'USER'] },
  { to: '/transfer', label: 'Transfer', icon: '⇄', roles: ['ADMIN', 'USER'] },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, role, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40 flex flex-col
        bg-slate-950 border-r border-white/5
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-lg animate-glow-pulse">
              N
            </div>
            <div>
              <p className="font-display text-white font-bold text-lg leading-none">NexBank</p>
              <p className="text-slate-600 text-xs mt-0.5">Management System</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-slate-700 text-xs font-semibold uppercase tracking-widest px-3 mb-3">Navigation</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${isActive
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20 glow-blue'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                }
              `}
            >
              <span className="text-base w-5 text-center flex-shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-sky-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {(user?.email || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-slate-300 text-sm font-medium truncate">{user?.email || 'User'}</p>
                <span className={`
                  text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider
                  ${isAdmin
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    : 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                  }
                `}>
                  {role}
                </span>
              </div>
              <p className="text-slate-600 text-xs truncate">{isAdmin ? 'Administrator' : 'User Account'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
          >
            <span className="text-base">→</span>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
