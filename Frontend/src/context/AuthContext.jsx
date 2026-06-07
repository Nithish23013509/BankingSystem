import { createContext, useContext, useState, useCallback } from 'react';
import { login as loginApi, register as registerApi } from '../api/bankingService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); }
    catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await loginApi(credentials);
      const jwt = data.token;
      const userInfo = {
        email: data.email || credentials.email,
        role: data.role || 'USER',
      };
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(userInfo));
      setToken(jwt);
      setUser(userInfo);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Invalid credentials';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await registerApi(credentials);
      // Auto-login after registration
      if (data.token) {
        const jwt = data.token;
        const userInfo = {
          email: data.email || credentials.email,
          role: data.role || 'USER',
        };
        localStorage.setItem('token', jwt);
        localStorage.setItem('user', JSON.stringify(userInfo));
        setToken(jwt);
        setUser(userInfo);
      }
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Registration failed';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const isAuthenticated = !!token;
  const role = user?.role || 'USER';
  const isAdmin = role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      user, token, loading, error, role, isAdmin,
      login, register, logout, clearError, isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
