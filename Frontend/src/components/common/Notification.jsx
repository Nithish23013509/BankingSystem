import { useNotification } from '../../context/NotificationContext';
import '../../styles/common.css';

const typeIcons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export default function Notification() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container" aria-live="polite">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`notification notification--${n.type}`}
          role="alert"
        >
          <span className="notification__icon">{typeIcons[n.type] || 'ℹ'}</span>
          <div className="notification__body">
            <div className="notification__message">{n.message}</div>
          </div>
          <button
            className="notification__close"
            onClick={() => removeNotification(n.id)}
            aria-label="Close notification"
          >
            ✕
          </button>
          <div
            className="notification__progress"
            style={{ animationDuration: '4000ms' }}
          />
        </div>
      ))}
    </div>
  );
}
