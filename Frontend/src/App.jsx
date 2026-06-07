import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './components/layout/ProtectedLayout';
import AdminRoute from './components/layout/AdminRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/AccountsPage';
import UsersPage from './pages/UsersPage';
import CreateAccountPage from './pages/CreateAccountPage';
import AccountDetailPage from './pages/AccountDetailPage';
import EditAccountPage from './pages/EditAccountPage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import TransferPage from './pages/TransferPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected — all share the sidebar layout */}
          <Route element={<ProtectedLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Admin-only routes */}
            <Route path="/accounts" element={<AdminRoute><AccountsPage /></AdminRoute>} />
            <Route path="/users" element={<AdminRoute><UsersPage /></AdminRoute>} />
            <Route path="/accounts/create" element={<AdminRoute><CreateAccountPage /></AdminRoute>} />
            <Route path="/accounts/:id/edit" element={<AdminRoute><EditAccountPage /></AdminRoute>} />

            {/* Admin + User routes */}
            <Route path="/accounts/:id" element={<AccountDetailPage />} />
            <Route path="/deposit" element={<DepositPage />} />
            <Route path="/withdraw" element={<WithdrawPage />} />
            <Route path="/transfer" element={<TransferPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
