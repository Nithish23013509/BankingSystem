import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

export default function RegisterPage() {
  const { register, loading, error, isAuthenticated, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

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
    if (!form.email || !form.password || !form.confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    if (!emailRegex.test(form.email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    if (form.password.length < 4) {
      setFormError('Password must be at least 4 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    const result = await register({
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 800);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-violet-500/[0.07] rounded-full blur-3xl animate-float-1" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-sky-500/[0.06] rounded-full blur-3xl animate-float-2" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-3xl animate-float-3" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-amber-500/[0.03] rounded-full blur-3xl animate-float-4" />
        
        {/* Particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${15 + i * 15}%`,
              bottom: '-10px',
              animationDuration: `${6 + i * 2}s`,
              animationDelay: `${i * 1.5}s`,
              opacity: 0.3 + (i * 0.1),
              width: `${2 + i}px`,
              height: `${2 + i}px`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-sky-500 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-2xl animate-glow-pulse-violet">
            N
          </div>
          <h1 className="font-display text-3xl text-white font-bold">NexBank</h1>
          <p className="text-slate-500 mt-1">Create your account</p>
        </div>

        {/* Card */}
        <div className="glass-premium rounded-3xl p-8 animate-border-glow">
          <h2 className="text-xl font-semibold text-white mb-1">Get started</h2>
          <p className="text-slate-500 text-sm mb-6">Register for a new account</p>

          <form onSubmit={handleSubmit} className="space-y-4 stagger-children">
            {(formError || error) && (
              <Alert type="error" message={formError || error} onClose={() => setFormError('')} />
            )}

            {success && (
              <Alert type="success" message="Account created! Redirecting to dashboard..." />
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
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />

            <Button type="submit" loading={loading} disabled={success} className="w-full mt-2 btn-shimmer" size="lg">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-center text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
                Sign in
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
