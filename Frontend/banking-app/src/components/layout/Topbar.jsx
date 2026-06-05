import { useLocation } from 'react-router-dom';

const titles = {
  '/dashboard': 'Dashboard',
  '/accounts': 'All Accounts',
  '/accounts/create': 'Create Account',
  '/deposit': 'Deposit Funds',
  '/withdraw': 'Withdraw Funds',
  '/transfer': 'Transfer Funds',
};

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = Object.entries(titles).find(([path]) => pathname.startsWith(path))?.[1] || 'Banking System';
  const now = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="h-16 border-b border-white/5 flex items-center px-6 gap-4 flex-shrink-0">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex-1">
        <h1 className="text-white font-semibold text-lg">{title}</h1>
        <p className="text-slate-600 text-xs hidden sm:block">{now}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
          <span className="text-emerald-400 text-xs font-medium">Live</span>
        </div>
      </div>
    </header>
  );
}
