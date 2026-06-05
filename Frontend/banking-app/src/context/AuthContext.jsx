import { createContext, useContext, useState, useCallback } from 'react';
import { login as loginApi } from '../api/bankingService';

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
      // Backend now returns JSON: { token, username }
      const jwt = data.token;
      const userInfo = { username: data.username || credentials.username };
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

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
