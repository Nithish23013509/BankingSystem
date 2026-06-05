import { useState } from 'react';
import { withdraw } from '../api/bankingService';
import { useApi } from '../hooks/useApi';
import TransactionForm from '../components/common/TransactionForm';

export default function WithdrawPage() {
  const { loading, error, execute } = useApi(withdraw);
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
      title="Withdraw"
      description="Withdraw funds from an account"
      accentColor="amber"
      icon="↑"
      fields={['from', 'amount']}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
    />
  );
}
