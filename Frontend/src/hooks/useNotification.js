import { useNotification as useNotificationContext } from '../context/NotificationContext';

export function useNotification() {
  const { addNotification, removeNotification, notifications } = useNotificationContext();
  
  return {
    addNotification,
    removeNotification,
    notifications,
    showSuccess: (message) => addNotification(message, 'success'),
    showError: (message) => addNotification(message, 'error'),
    showWarning: (message) => addNotification(message, 'warning'),
    showInfo: (message) => addNotification(message, 'info'),
  };
}

export default useNotification;
