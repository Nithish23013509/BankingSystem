import { useState } from 'react';
import { transfer } from '../api/bankingService';
import { useApi } from '../hooks/useApi';
import TransactionForm from '../components/common/TransactionForm';

export default function TransferPage() {
  const { loading, error, execute } = useApi(transfer);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async ({ fromId, toId, amount }) => {
    const result = await execute(fromId, toId, amount);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <TransactionForm
      title="Transfer"
      description="Move funds between two accounts"
      accentColor="violet"
      icon="⇄"
      fields={['from', 'to', 'amount']}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
    />
  );
}
