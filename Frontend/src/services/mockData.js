// ── Mock Accounts ──
const accounts = [
  {
    id: 'acc_001',
    type: 'Checking',
    accountNumber: '****4521',
    holderName: 'James Anderson',
    balance: 24850.75,
    status: 'Active',
    currency: 'USD',
  },
  {
    id: 'acc_002',
    type: 'Savings',
    accountNumber: '****7893',
    holderName: 'James Anderson',
    balance: 102340.5,
    status: 'Active',
    currency: 'USD',
  },
  {
    id: 'acc_003',
    type: 'Business',
    accountNumber: '****3312',
    holderName: 'James Anderson',
    balance: 57420.0,
    status: 'Active',
    currency: 'USD',
  },
  {
    id: 'acc_004',
    type: 'Investment',
    accountNumber: '****9087',
    holderName: 'James Anderson',
    balance: 230100.0,
    status: 'Active',
    currency: 'USD',
  },
  {
    id: 'acc_005',
    type: 'Credit',
    accountNumber: '****6654',
    holderName: 'James Anderson',
    balance: -3250.25,
    status: 'Active',
    currency: 'USD',
  },
];

// ── Mock Transactions ──
const transactions = [
  {
    id: 'txn_001',
    type: 'Deposit',
    description: 'Salary Payment - TechCorp Inc.',
    amount: 8500.0,
    date: '2026-06-02',
    status: 'Completed',
    accountId: 'acc_001',
  },
  {
    id: 'txn_002',
    type: 'Withdrawal',
    description: 'ATM Withdrawal - Downtown Branch',
    amount: -500.0,
    date: '2026-06-02',
    status: 'Completed',
    accountId: 'acc_001',
  },
  {
    id: 'txn_003',
    type: 'Transfer',
    description: 'Transfer to Savings Account',
    amount: -2000.0,
    date: '2026-06-01',
    status: 'Completed',
    accountId: 'acc_001',
  },
  {
    id: 'txn_004',
    type: 'Deposit',
    description: 'Freelance Payment - Design Project',
    amount: 3200.0,
    date: '2026-06-01',
    status: 'Completed',
    accountId: 'acc_002',
  },
  {
    id: 'txn_005',
    type: 'Withdrawal',
    description: 'Online Purchase - Amazon',
    amount: -149.99,
    date: '2026-05-31',
    status: 'Completed',
    accountId: 'acc_001',
  },
  {
    id: 'txn_006',
    type: 'Transfer',
    description: 'Investment Fund Transfer',
    amount: -5000.0,
    date: '2026-05-30',
    status: 'Pending',
    accountId: 'acc_002',
  },
  {
    id: 'txn_007',
    type: 'Deposit',
    description: 'Dividend Payment - Stock Portfolio',
    amount: 1250.0,
    date: '2026-05-29',
    status: 'Completed',
    accountId: 'acc_004',
  },
  {
    id: 'txn_008',
    type: 'Withdrawal',
    description: 'Utility Bill - Electric Company',
    amount: -285.5,
    date: '2026-05-28',
    status: 'Completed',
    accountId: 'acc_001',
  },
  {
    id: 'txn_009',
    type: 'Deposit',
    description: 'Refund - Subscription Service',
    amount: 45.0,
    date: '2026-05-27',
    status: 'Completed',
    accountId: 'acc_001',
  },
  {
    id: 'txn_010',
    type: 'Withdrawal',
    description: 'Restaurant - The Grand Kitchen',
    amount: -92.3,
    date: '2026-05-26',
    status: 'Completed',
    accountId: 'acc_003',
  },
];

// ── Dashboard Stats ──
const dashboardStats = {
  totalBalance: {
    value: 411461.0,
    trend: '+12.5%',
    trendDirection: 'up',
    label: 'Total Balance',
    prefix: '$',
  },
  totalAccounts: {
    value: 5,
    trend: '+1',
    trendDirection: 'up',
    label: 'Total Accounts',
    prefix: '',
  },
  monthlyIncome: {
    value: 12995.0,
    trend: '+8.2%',
    trendDirection: 'up',
    label: 'Monthly Income',
    prefix: '$',
  },
  monthlyExpenses: {
    value: 8027.79,
    trend: '+3.1%',
    trendDirection: 'down',
    label: 'Monthly Expenses',
    prefix: '$',
  },
};

// ── Simulated async API calls ──

function delay(ms = 800) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchAccounts() {
  await delay(900);
  return [...accounts];
}

export async function fetchTransactions(limit) {
  await delay(700);
  const txns = [...transactions];
  return limit ? txns.slice(0, limit) : txns;
}

export async function fetchDashboardStats() {
  await delay(600);
  return { ...dashboardStats };
}

export async function fetchAccountById(id) {
  await delay(500);
  return accounts.find((a) => a.id === id) || null;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
