import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccount, getAllUsers } from '../api/bankingService';
import { useApi } from '../hooks/useApi';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';

const ACCOUNT_TYPES = ['Savings', 'Checking', 'Current', 'Fixed Deposit', 'Business'];

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const { loading, error, execute } = useApi(createAccount);
  const { data: users, execute: fetchUsers } = useApi(getAllUsers);
  const [form, setForm] = useState({ holderName: '', accountNumber: '', accountType: '', balance: '', email: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => { fetchUsers(); }, []);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.holderName.trim()) errs.holderName = 'Account holder name is required';
    if (!form.accountNumber.trim()) errs.accountNumber = 'Account number is required';
    if (!form.accountType) errs.accountType = 'Please select an account type';
    if (!form.balance || isNaN(Number(form.balance))) errs.balance = 'Enter a valid initial balance';
    if (Number(form.balance) < 0) errs.balance = 'Balance cannot be negative';
    return errs;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFormErrors((fe) => ({ ...fe, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    const payload = {
      holderName: form.holderName.trim(),
      accountNumber: form.accountNumber.trim(),
      accountType: form.accountType,
      balance: parseFloat(form.balance),
      email: form.email || null,
    };

    const result = await execute(payload);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/accounts'), 1500);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Create New Account</h2>
        <p className="text-slate-500 text-sm mt-1">Fill in the details below to open a new bank account</p>
      </div>

      {success && <Alert type="success" message="Account created successfully! Redirecting..." />}
      {error && <Alert type="error" message={error} />}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Account Holder Name"
            name="holderName"
            type="text"
            placeholder="e.g. John Doe"
            value={form.holderName}
            onChange={handleChange}
            error={formErrors.holderName}
            autoFocus
          />

          <Input
            label="Account Number"
            name="accountNumber"
            type="text"
            placeholder="e.g. ACC-001"
            value={form.accountNumber}
            onChange={handleChange}
            error={formErrors.accountNumber}
          />

          {/* Assign to User */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-400">Assign to User (Email)</label>
            <div className="relative">
              <select
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all duration-200 py-2.5 pl-4 pr-10 text-sm appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">— No user (unassigned) —</option>
                {(users || []).filter(u => u.role !== 'ADMIN').map((u) => (
                  <option key={u.id} value={u.email} className="bg-slate-900">{u.email}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▾</div>
            </div>
            <p className="text-xs text-slate-600">Select a registered user to link this account to them</p>
          </div>

          {/* Account Type */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-400">Account Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ACCOUNT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { setForm((f) => ({ ...f, accountType: type })); setFormErrors((fe) => ({ ...fe, accountType: '' })); }}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all duration-150 ${
                    form.accountType === type
                      ? 'bg-sky-500/20 border-sky-500/50 text-sky-400'
                      : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            {formErrors.accountType && <p className="text-xs text-red-400">{formErrors.accountType}</p>}
          </div>

          <Input
            label="Initial Balance"
            name="balance"
            type="number"
            placeholder="0.00"
            value={form.balance}
            onChange={handleChange}
            error={formErrors.balance}
            prefix="$"
            min="0"
            step="0.01"
          />

          {/* Preview */}
          {(form.holderName || form.accountType || form.balance) && (
            <div className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Account Preview</p>
              {form.email && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Assigned To</span>
                  <span className="text-sky-400">{form.email}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Holder</span>
                <span className="text-slate-200">{form.holderName || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Account #</span>
                <span className="text-slate-200 font-mono">{form.accountNumber || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Type</span>
                <span className="text-slate-200">{form.accountType || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Opening Balance</span>
                <span className="text-emerald-400 font-mono">{form.balance ? `$${parseFloat(form.balance).toFixed(2)}` : '—'}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/accounts')} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={loading} disabled={success} className="flex-2">
              Create Account
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
