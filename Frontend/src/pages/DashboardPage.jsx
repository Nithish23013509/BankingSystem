import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAccounts, getMyAccounts } from '../api/bankingService';
import { useApi } from '../hooks/useApi';
import StatCard from '../components/common/StatCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { CardSkeleton } from '../components/common/Loading';
import { formatCurrency, formatDate, accountTypeColor } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

function BankIcon({ size = 20, className }) {
  return <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l9-3 9 3M3 6v14a1 1 0 001 1h5v-5h4v5h5a1 1 0 001-1V6M3 6h18" /></svg>;
}
function UsersIcon({ size = 20, className }) {
  return <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
function TrendIcon({ size = 20, className }) {
  return <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
}
function WalletIcon({ size = 20, className }) {
  return <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
}

// ─── Admin Dashboard ──────────────────────────────────────────────
function AdminDashboard({ user, accounts, loading, navigate }) {
  const list = accounts || [];
  const totalBalance = list.reduce((s, a) => s + (a.balance || 0), 0);
  const avgBalance = list.length ? totalBalance / list.length : 0;
  const recent = [...list].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome */}
      <div className="animate-slide-up">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Good morning, <span className="text-gradient">{user?.email || 'Admin'}</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">Here's your banking overview for today</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Balance" value={formatCurrency(totalBalance)} icon={WalletIcon} color="sky" sub="Across all accounts" delay={0} />
            <StatCard label="Total Accounts" value={list.length} icon={UsersIcon} color="violet" sub="Active accounts" delay={1} />
            <StatCard label="Avg Balance" value={formatCurrency(avgBalance)} icon={TrendIcon} color="emerald" sub="Per account" delay={2} />
            <StatCard label="Total Assets" value={formatCurrency(totalBalance)} icon={BankIcon} color="amber" sub="Under management" delay={3} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent accounts table */}
        <div className="xl:col-span-2">
          <Card className="p-0 overflow-hidden" glow>
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-white font-semibold">Recent Accounts</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/accounts')}>View all →</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Account Holder', 'Type', 'Balance', 'Created'].map((h) => (
                      <th key={h} className={`text-left px-4 sm:px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap ${(h === 'Created' || h === 'Type') ? 'hidden sm:table-cell' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-600 text-sm">Loading...</td></tr>
                  ) : recent.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-600 text-sm">No accounts found</td></tr>
                  ) : (
                    recent.map((acct, idx) => (
                      <tr
                        key={acct.id}
                        onClick={() => navigate(`/accounts/${acct.id}`)}
                        className="hover:bg-white/[0.03] cursor-pointer transition-all duration-200 animate-fade-in"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400/20 to-violet-400/20 border border-white/10 flex items-center justify-center text-xs font-bold text-sky-400">
                              {(acct.holderName || 'U')[0].toUpperCase()}
                            </div>
                            <span className="text-slate-300 text-sm font-medium">{acct.holderName || `Account #${acct.id}`}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 whitespace-nowrap hidden sm:table-cell">
                          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${accountTypeColor(acct.accountType || '')}`}>
                            {acct.accountType || 'Standard'}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 font-mono text-sm text-emerald-400 whitespace-nowrap">{formatCurrency(acct.balance)}</td>
                        <td className="px-4 sm:px-6 py-3 text-slate-500 text-sm whitespace-nowrap hidden sm:table-cell">{formatDate(acct.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="space-y-4 stagger-children">
          <Card glow>
            <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Create New Account', to: '/accounts/create', icon: '+', color: 'text-sky-400 bg-sky-400/10' },
                { label: 'Manage Users', to: '/users', icon: '👥', color: 'text-pink-400 bg-pink-400/10' },
                { label: 'Make a Deposit', to: '/deposit', icon: '↓', color: 'text-emerald-400 bg-emerald-400/10' },
                { label: 'Withdraw Funds', to: '/withdraw', icon: '↑', color: 'text-amber-400 bg-amber-400/10' },
                { label: 'Transfer Money', to: '/transfer', icon: '⇄', color: 'text-violet-400 bg-violet-400/10' },
              ].map((action) => (
                <button
                  key={action.to}
                  onClick={() => navigate(action.to)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 text-left group"
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                    {action.icon}
                  </span>
                  <span className="text-slate-300 text-sm">{action.label}</span>
                  <span className="ml-auto text-slate-600 group-hover:translate-x-1 transition-transform duration-200">›</span>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-white font-semibold mb-3">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Total Accounts</span>
                <span className="text-white font-mono font-semibold">{list.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Total Funds</span>
                <span className="text-emerald-400 font-mono font-semibold">{formatCurrency(totalBalance)}</span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Avg Balance</span>
                <span className="text-sky-400 font-mono font-semibold">{formatCurrency(avgBalance)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── User Dashboard ───────────────────────────────────────────────
function UserDashboard({ user, accounts, loading, navigate }) {
  const list = accounts || [];
  const totalBalance = list.reduce((s, a) => s + (a.balance || 0), 0);
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Welcome */}
      <div className="animate-slide-up">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Welcome, <span className="text-gradient">{user?.email || 'User'}</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">Here's your account overview</p>
      </div>

      {/* Stats */}
      {!loading && list.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
          <StatCard label="My Accounts" value={list.length} icon={BankIcon} color="sky" sub="Linked to you" delay={0} />
          <StatCard label="Total Balance" value={formatCurrency(totalBalance)} icon={WalletIcon} color="emerald" sub="Across all accounts" delay={1} />
          <StatCard label="Avg Balance" value={formatCurrency(list.length ? totalBalance / list.length : 0)} icon={TrendIcon} color="violet" sub="Per account" delay={2} />
        </div>
      )}

      {/* My Accounts */}
      <Card glow>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">My Accounts</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/my-accounts')}>View all →</Button>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-lg mb-2">No accounts linked yet</p>
            <p className="text-slate-600 text-sm">Contact your administrator to create and assign an account to you.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((acct, idx) => (
              <div
                key={acct.id}
                onClick={() => navigate(`/accounts/${acct.id}`)}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-all duration-200 animate-fade-in border border-white/5"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400/20 to-violet-400/20 border border-white/10 flex items-center justify-center text-sm font-bold text-sky-400">
                  {(acct.holderName || 'U')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm font-medium">{acct.holderName || `Account #${acct.id}`}</p>
                  <p className="text-slate-600 text-xs font-mono">#{String(acct.accountNumber || acct.id).padStart(4, '0')}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-emerald-400 font-mono text-sm font-semibold">{formatCurrency(acct.balance)}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${accountTypeColor(acct.accountType || '')}` }>
                    {acct.accountType || 'Standard'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
        {[
          {
            label: 'Deposit',
            desc: 'Add funds to an account',
            to: '/deposit',
            icon: '↓',
            gradient: 'from-emerald-500/20 to-emerald-600/10',
            text: 'text-emerald-400',
            border: 'border-emerald-500/20',
            glow: 'hover:shadow-emerald-500/10',
          },
          {
            label: 'Withdraw',
            desc: 'Take out funds',
            to: '/withdraw',
            icon: '↑',
            gradient: 'from-amber-500/20 to-amber-600/10',
            text: 'text-amber-400',
            border: 'border-amber-500/20',
            glow: 'hover:shadow-amber-500/10',
          },
          {
            label: 'Transfer',
            desc: 'Move funds between accounts',
            to: '/transfer',
            icon: '⇄',
            gradient: 'from-violet-500/20 to-violet-600/10',
            text: 'text-violet-400',
            border: 'border-violet-500/20',
            glow: 'hover:shadow-violet-500/10',
          },
        ].map((action) => (
          <button
            key={action.to}
            onClick={() => navigate(action.to)}
            className={`glass rounded-2xl p-4 sm:p-6 border ${action.border} text-left group 
              hover:scale-[1.02] transition-all duration-300 card-3d hover:shadow-2xl ${action.glow}`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-xl font-bold ${action.text} mb-4 group-hover:scale-110 transition-transform duration-300`}>
              {action.icon}
            </div>
            <h4 className={`font-semibold text-lg ${action.text} mb-1`}>{action.label}</h4>
            <p className="text-slate-500 text-sm">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard Page (switches based on role) ──────────────────────
export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { data: adminAccounts, loading: adminLoading, execute: fetchAdminAccounts } = useApi(getAllAccounts);
  const { data: userAccounts, loading: userLoading, execute: fetchUserAccounts } = useApi(getMyAccounts);

  useEffect(() => {
    if (isAdmin) fetchAdminAccounts();
    else fetchUserAccounts();
  }, [isAdmin]);

  if (isAdmin) {
    return <AdminDashboard user={user} accounts={adminAccounts} loading={adminLoading} navigate={navigate} />;
  }

  return <UserDashboard user={user} accounts={userAccounts} loading={userLoading} navigate={navigate} />;
}
