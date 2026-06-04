import { createContext, useContext, useState, useCallback, useRef } from 'react';

// ─── Context ─────────────────────────────────────────────────────────────────
const NotificationContext = createContext(null);

// ─── Helpers ─────────────────────────────────────────────────────────────────
let notificationIdCounter = 0;
const AUTO_DISMISS_MS = 4000;

// ─── Provider ────────────────────────────────────────────────────────────────
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const timersRef = useRef({});

  /**
   * Add a notification that auto-dismisses after 4 seconds.
   * @param {string} message  - The notification text.
   * @param {'success'|'error'|'warning'|'info'} [type='info'] - Notification type.
   * @returns {number} The notification id.
   */
  const addNotification = useCallback((message, type = 'info') => {
    const id = ++notificationIdCounter;

    const notification = {
      id,
      message,
      type,
      createdAt: Date.now(),
    };

    setNotifications((prev) => [...prev, notification]);

    // Schedule auto-dismiss
    timersRef.current[id] = setTimeout(() => {
      removeNotification(id);
    }, AUTO_DISMISS_MS);

    return id;
  }, []);

  /**
   * Remove a notification by id and clear its auto-dismiss timer.
   * @param {number} id
   */
  const removeNotification = useCallback((id) => {
    // Clear any pending timer
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }

    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// ─── Custom Hook ─────────────────────────────────────────────────────────────
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a <NotificationProvider>'
    );
  }
  return context;
}

export default NotificationContext;
