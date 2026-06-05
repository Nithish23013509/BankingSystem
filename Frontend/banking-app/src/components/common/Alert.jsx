const styles = {
  error: 'bg-red-500/10 border-red-500/30 text-red-400',
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  info: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
};

const icons = {
  error: '✕',
  success: '✓',
  info: 'ℹ',
  warning: '⚠',
};

export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm animate-fade-in ${styles[type]}`}>
      <span className="text-base font-bold">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity ml-auto">✕</button>
      )}
    </div>
  );
}
