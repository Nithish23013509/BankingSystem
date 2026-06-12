import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyAccounts } from '../api/bankingService';
import { useApi } from '../hooks/useApi';
import Card from '../components/common/Card';
import { CardSkeleton } from '../components/common/Loading';
import { formatCurrency, accountTypeColor } from '../utils/helpers';

export default function MyAccountsPage() {
  const navigate = useNavigate();
  const { data: accounts, loading, execute } = useApi(getMyAccounts);

  useEffect(() => { execute(); }, []);

  const list = accounts || [];

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">My Accounts</h2>
        <p className="text-slate-500 text-sm mt-1">All bank accounts linked to you</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : list.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg mb-2">No accounts linked to you</p>
            <p className="text-slate-600 text-sm">Contact your administrator to create and assign an account to your email.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((acct) => (
            <Card
              key={acct.id}
              className="cursor-pointer hover:border-white/10 transition-all duration-200 group"
              onClick={() => navigate(`/accounts/${acct.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400/20 to-violet-400/20 border border-white/10 flex items-center justify-center text-sm font-bold text-sky-400">
                  {(acct.holderName || 'U')[0].toUpperCase()}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-lg ${accountTypeColor(acct.accountType || '')}`}>
                  {acct.accountType || 'Standard'}
                </span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-0.5">{acct.holderName || `Account #${acct.id}`}</h3>
              <p className="text-slate-600 text-xs font-mono mb-3">#{String(acct.accountNumber || acct.id).padStart(4, '0')}</p>
              <p className="text-emerald-400 font-mono text-lg font-bold">{formatCurrency(acct.balance)}</p>
              <div className="mt-3 pt-3 border-t border-white/5">
                <span className="text-slate-600 text-xs">
                  Status: <span className="text-emerald-400">{acct.status || 'ACTIVE'}</span>
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
