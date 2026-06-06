import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAccounts, deleteAccount } from '../api/bankingService';
import { useApi } from '../hooks/useApi';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { CardSkeleton } from '../components/common/Loading';
import { formatCurrency, accountTypeColor } from '../utils/helpers';

export default function AccountsPage() {
  const navigate = useNavigate();
  const { data: accounts, loading, execute } = useApi(getAllAccounts);
  const { loading: deleting, execute: execDelete } = useApi(deleteAccount);

  useEffect(() => { execute(); }, []);

  const list = accounts || [];

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this account permanently?')) return;
    const result = await execDelete(id);
    if (result.success) execute(); // refresh list
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">All Accounts</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your bank accounts</p>
        </div>
        <Button onClick={() => navigate('/accounts/create')}>+ New Account</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : list.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg mb-2">No accounts found</p>
            <p className="text-slate-600 text-sm mb-4">Get started by creating your first account</p>
            <Button onClick={() => navigate('/accounts/create')}>Create Account</Button>
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
              <p className="text-slate-600 text-xs font-mono mb-3">#{String(acct.id).padStart(4, '0')}</p>
              <p className="text-emerald-400 font-mono text-lg font-bold">{formatCurrency(acct.balance)}</p>
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); navigate(`/accounts/${acct.id}/edit`); }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  loading={deleting}
                  onClick={(e) => { e.stopPropagation(); handleDelete(acct.id); }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}