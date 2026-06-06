import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAccounts } from '../api/bankingService';
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

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: accounts, loading, execute } = useApi(getAllAccounts);

  useEffect(() => { execute(); }, []);

  const list = accounts || [];
  const totalBalance = list.reduce((s, a) => s + (a.balance || 0), 0);
  const avgBalance = list.length ? totalBalance / list.length : 0;
  const recent = [...list].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome */}
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-white">
          Good morning, <span className="text-gradient">{user?.username || 'Admin'}</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">Here's your banking overview for today</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Balance" value={formatCurrency(totalBalance)} icon={WalletIcon} color="sky" sub="Across all accounts" />
            <StatCard label="Total Accounts" value={list.length} icon={UsersIcon} color="violet" sub="Active accounts" />
            <StatCard label="Avg Balance" value={formatCurrency(avgBalance)} icon={TrendIcon} color="emerald" sub="Per account" />
            <StatCard label="Total Assets" value={formatCurrency(totalBalance)} icon={BankIcon} color="amber" sub="Under management" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent accounts table */}
        <div className="xl:col-span-2">
          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-white font-semibold">Recent Accounts</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/accounts')}>View all →</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Account Holder', 'Type', 'Balance', 'Created'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-600 text-sm">Loading...</td></tr>
                  ) : recent.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-600 text-sm">No accounts found</td></tr>
                  ) : (
                    recent.map((acct) => (
                      <tr
                        key={acct.id}
                        onClick={() => navigate(`/accounts/${acct.id}`)}
                        className="hover:bg-white/3 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400/20 to-violet-400/20 border border-white/10 flex items-center justify-center text-xs font-bold text-sky-400">
                              {(acct.holderName || 'U')[0].toUpperCase()}
                            </div>
                            <span className="text-slate-300 text-sm font-medium">{acct.holderName || `Account #${acct.id}`}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${accountTypeColor(acct.accountType || '')}`}>
                            {acct.accountType || 'Standard'}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-mono text-sm text-emerald-400">{formatCurrency(acct.balance)}</td>
                        <td className="px-6 py-3 text-slate-500 text-sm">{formatDate(acct.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Create New Account', to: '/accounts/create', icon: '+', color: 'text-sky-400 bg-sky-400/10' },
                { label: 'Make a Deposit', to: '/deposit', icon: '↓', color: 'text-emerald-400 bg-emerald-400/10' },
                { label: 'Withdraw Funds', to: '/withdraw', icon: '↑', color: 'text-amber-400 bg-amber-400/10' },
                { label: 'Transfer Money', to: '/transfer', icon: '⇄', color: 'text-violet-400 bg-violet-400/10' },
              ].map((action) => (
                <button
                  key={action.to}
                  onClick={() => navigate(action.to)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${action.color}`}>
                    {action.icon}
                  </span>
                  <span className="text-slate-300 text-sm">{action.label}</span>
                  <span className="ml-auto text-slate-600">›</span>
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
