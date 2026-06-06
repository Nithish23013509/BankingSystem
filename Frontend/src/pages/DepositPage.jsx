import { useState } from 'react';
import { deposit } from '../api/bankingService';
import { useApi } from '../hooks/useApi';
import TransactionForm from '../components/common/TransactionForm';

export default function DepositPage() {
  const { loading, error, execute } = useApi(deposit);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async ({ fromId, amount }) => {
    const result = await execute(fromId, amount);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <TransactionForm
      title="Deposit"
      description="Add funds to an existing account"
      accentColor="emerald"
      icon="↓"
      fields={['from', 'amount']}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
    />
  );
}
