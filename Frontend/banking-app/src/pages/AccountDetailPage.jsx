import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAccountById, deleteAccount } from '../api/bankingService';
import { useApi } from '../hooks/useApi';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/Loading';
import { formatCurrency, formatDate, formatAccountNumber, accountTypeColor } from '../utils/helpers';

function DetailRow({ label, value, mono = false }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className={`text-slate-200 text-sm font-medium text-right ${mono ? 'font-mono' : ''}`}>{value ?? '—'}</span>
    </div>
  );
}

export default function AccountDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: account, loading, error, execute } = useApi(getAccountById);
  const { loading: deleting, execute: execDelete } = useApi(deleteAccount);

  useEffect(() => { execute(id); }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this account permanently?')) return;
    const result = await execDelete(id);
    if (result.success) navigate('/accounts');
  };

  if (loading) return <LoadingSpinner text="Loading account details..." />;
  if (error) return (
    <div className="max-w-2xl">
      <Alert type="error" message={error} />
      <Button onClick={() => navigate('/accounts')} variant="secondary" className="mt-4">← Back to Accounts</Button>
    </div>
  );
  if (!account) return null;

  const acct = account;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button onClick={() => navigate('/accounts')} className="text-slate-500 hover:text-slate-300 text-sm transition-colors flex items-center gap-1.5">
          ← Back
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">{acct.holderName || `Account #${id}`}</h2>
          <p className="text-slate-500 text-sm font-mono mt-0.5">{formatAccountNumber(id)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate(`/accounts/${id}/edit`)}>Edit</Button>
          <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      {/* Balance hero */}
      <div className="glass rounded-2xl p-6 border border-emerald-500/10 glow-green relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <p className="text-slate-500 text-sm mb-1">Current Balance</p>
        <p className="text-4xl font-bold font-mono text-emerald-400">{formatCurrency(acct.balance)}</p>
        <div className="flex items-center gap-3 mt-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${accountTypeColor(acct.accountType || '')}`}>
            {acct.accountType || 'Standard'}
          </span>
          <span className="text-slate-600 text-xs">Account ID: #{String(id).padStart(4, '0')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account info */}
        <Card>
          <h3 className="text-white font-semibold mb-2">Account Information</h3>
          <div>
            <DetailRow label="Account ID" value={`#${String(id).padStart(4, '0')}`} mono />
            <DetailRow label="Account Number" value={formatAccountNumber(id)} mono />
            <DetailRow label="Holder Name" value={acct.holderName} />
            <DetailRow label="Account Type" value={acct.accountType} />
            <DetailRow label="Status" value={
              <span className="text-emerald-400 bg-emerald-400/10 text-xs px-2 py-0.5 rounded-lg">Active</span>
            } />
            <DetailRow label="Created" value={formatDate(acct.createdAt)} />
          </div>
        </Card>

        {/* Quick actions */}
        <Card>
          <h3 className="text-white font-semibold mb-4">Transactions</h3>
          <div className="space-y-2">
            {[
              { label: 'Deposit Funds', to: `/deposit`, icon: '↓', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20' },
              { label: 'Withdraw Funds', to: `/withdraw`, icon: '↑', color: 'text-amber-400 bg-amber-400/10 border-amber-500/20' },
              { label: 'Transfer Money', to: `/transfer`, icon: '⇄', color: 'text-violet-400 bg-violet-400/10 border-violet-500/20' },
            ].map((action) => (
              <button
                key={action.to}
                onClick={() => navigate(action.to, { state: { accountId: id } })}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left border border-transparent hover:border-white/5"
              >
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 border ${action.color}`}>
                  {action.icon}
                </span>
                <span className="text-slate-300 text-sm font-medium">{action.label}</span>
                <span className="ml-auto text-slate-600 text-xs">›</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
