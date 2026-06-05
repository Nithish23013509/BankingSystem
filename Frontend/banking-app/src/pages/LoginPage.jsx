import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

export default function LoginPage() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setFormError('Please fill in all fields');
      return;
    }
    const result = await login(form);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-2xl shadow-sky-500/20">
            N
          </div>
          <h1 className="font-display text-3xl text-white font-bold">NexBank</h1>
          <p className="text-slate-500 mt-1">Banking Management System</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-xl font-semibold text-white mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-6">Sign in to your admin account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(formError || error) && (
              <Alert type="error" message={formError || error} onClose={() => setFormError('')} />
            )}

            <Input
              label="Username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Sign in to Dashboard
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-center text-slate-600 text-xs">
              Secured with JWT authentication · NexBank v1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
