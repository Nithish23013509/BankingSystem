import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAccountById, updateAccount } from '../api/bankingService';
import { useApi } from '../hooks/useApi';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/Loading';

const ACCOUNT_TYPES = ['Savings', 'Checking', 'Current', 'Fixed Deposit', 'Business'];

export default function EditAccountPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: account, loading: fetching, execute: fetchAccount } = useApi(getAccountById);
  const { loading: saving, error, execute: execUpdate } = useApi(updateAccount);
  const [form, setForm] = useState({ holderName: '', accountNumber: '', accountType: '', balance: '' });
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => { fetchAccount(id); }, [id]);

  useEffect(() => {
    if (account) {
      setForm({
        holderName: account.holderName || '',
        accountNumber: account.accountNumber || '',
        accountType: account.accountType || '',
        balance: String(account.balance ?? ''),
      });
    }
  }, [account]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFormErrors((fe) => ({ ...fe, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.holderName.trim()) errs.holderName = 'Name is required';
    if (!form.accountNumber.trim()) errs.accountNumber = 'Account number is required';
    if (!form.accountType) errs.accountType = 'Select an account type';
    if (!form.balance || isNaN(Number(form.balance)) || Number(form.balance) < 0) errs.balance = 'Enter a valid balance';
    return errs;
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
    };
    const result = await execUpdate(id, payload);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate(`/accounts/${id}`), 1500);
    }
  };

  if (fetching) return <LoadingSpinner text="Loading account..." />;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(`/accounts/${id}`)} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">← Back</button>
        <div>
          <h2 className="text-2xl font-bold text-white">Edit Account</h2>
          <p className="text-slate-500 text-sm mt-0.5">Update account #{String(id).padStart(4, '0')} details</p>
        </div>
      </div>

      {success && <Alert type="success" message="Account updated! Redirecting..." />}
      {error && <Alert type="error" message={error} />}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Account Holder Name"
            name="holderName"
            value={form.holderName}
            onChange={handleChange}
            error={formErrors.holderName}
            placeholder="Full name"
          />

          <Input
            label="Account Number"
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            error={formErrors.accountNumber}
            placeholder="e.g. ACC-001"
          />

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
            label="Balance"
            name="balance"
            type="number"
            value={form.balance}
            onChange={handleChange}
            error={formErrors.balance}
            prefix="$"
            min="0"
            step="0.01"
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate(`/accounts/${id}`)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} disabled={success} className="flex-1">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
