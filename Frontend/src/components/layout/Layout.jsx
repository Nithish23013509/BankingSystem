import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../../styles/layout.css';

function Layout() {
  const { user, logout } = useAuth();
  const { notifications } = useNotification();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="layout">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        user={user}
        onLogout={logout}
      />

      {/* Mobile Overlay */}
      <div
        className={`layout__overlay ${
          sidebarOpen ? 'layout__overlay--active' : ''
        }`}
        onClick={handleCloseSidebar}
        aria-hidden="true"
      />

      {/* Main Content Wrapper */}
      <div className="layout__main-wrapper">
        <Navbar
          onToggleSidebar={handleToggleSidebar}
          user={user}
          onLogout={logout}
          notificationCount={notifications.length}
        />

        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
