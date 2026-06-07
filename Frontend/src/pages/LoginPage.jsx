import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

export default function LoginPage() {
  const { login, loading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError?.();
  }, [clearError]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setFormError('Please fill in all fields');
      return;
    }
    const result = await login(form);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-sky-500/[0.07] rounded-full blur-3xl animate-float-1" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-violet-500/[0.06] rounded-full blur-3xl animate-float-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/[0.03] rounded-full blur-3xl animate-float-3" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-emerald-500/[0.04] rounded-full blur-3xl animate-float-4" />

        {/* Particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${10 + i * 12}%`,
              bottom: '-10px',
              animationDuration: `${5 + i * 1.5}s`,
              animationDelay: `${i * 1.2}s`,
              opacity: 0.2 + (i * 0.08),
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo with glow */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-2xl animate-glow-pulse-blue animate-gradient" style={{ backgroundSize: '200% 200%' }}>
            N
          </div>
          <h1 className="font-display text-3xl text-white font-bold">NexBank</h1>
          <p className="text-slate-500 mt-1">Banking Management System</p>
        </div>

        {/* Card with premium glass */}
        <div className="glass-premium rounded-3xl p-8 animate-border-glow">
          <h2 className="text-xl font-semibold text-white mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4 stagger-children">
            {(formError || error) && (
              <Alert type="error" message={formError || error} onClose={() => setFormError('')} />
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
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

            <Button type="submit" loading={loading} className="w-full mt-2 btn-shimmer" size="lg">
              Sign in to Dashboard
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-center text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-700 text-xs mt-6">
          Secured with JWT authentication · NexBank v1.0
        </p>
      </div>
    </div>
  );
}
