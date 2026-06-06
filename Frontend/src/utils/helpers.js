export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount ?? 0);

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const formatAccountNumber = (id) => {
  const padded = String(id).padStart(10, '0');
  return `${padded.slice(0, 4)} ${padded.slice(4, 7)} ${padded.slice(7)}`;
};

export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

export const accountTypeColor = (type = '') => {
  const t = type.toLowerCase();
  if (t.includes('saving')) return 'text-emerald-400 bg-emerald-400/10';
  if (t.includes('check')) return 'text-sky-400 bg-sky-400/10';
  if (t.includes('current')) return 'text-violet-400 bg-violet-400/10';
  return 'text-amber-400 bg-amber-400/10';
};
