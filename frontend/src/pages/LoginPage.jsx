import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, CheckSquare2, Sparkles, Clock, BarChart3 } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const FEATURES = [
  { icon: Sparkles, label: 'AI Enhanced Tasks', color: 'text-violet-400 bg-violet-400/10' },
  { icon: Clock,    label: 'Real-Time Tracking', color: 'text-emerald-400 bg-emerald-400/10' },
  { icon: BarChart3,label: 'Daily Analytics',    color: 'text-blue-400 bg-blue-400/10' },
];

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Login failed');
      setErrors({ general: result.message });
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field] || errors.general) setErrors({});
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col lg:flex-row">

      {/* ── Left panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark-950 via-primary-950/30 to-dark-900 p-12 flex-col justify-between border-r border-dark-700/40 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow">
            <CheckSquare2 className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <span className="text-xl font-bold text-dark-100">TaskFlow</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-dark-100 leading-tight">
              Supercharge your<br />
              <span className="text-gradient">productivity</span>
            </h2>
            <p className="text-dark-400 mt-3 text-base leading-relaxed max-w-sm">
              AI-enhanced tasks, real-time time tracking, and daily productivity insights — all in one place.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-4 h-4" strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-dark-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <p className="text-xs text-dark-600 italic">
            "The secret of getting ahead is getting started."
          </p>
          <p className="text-xs text-dark-700 mt-1">— Mark Twain</p>
        </div>
      </div>

      {/* ── Right panel / main form ── */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
        {/* Mobile background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-600/6 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 items-center justify-center mb-3 shadow-glow-lg">
              <CheckSquare2 className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-gradient">TaskFlow</h1>
            <p className="text-dark-500 text-sm mt-1">AI-powered productivity</p>
          </div>

          {/* Card */}
          <div className="glass p-6 sm:p-8 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-dark-100">Welcome back</h2>
              <p className="text-dark-500 text-sm mt-1">Sign in to your account</p>
            </div>

            {/* General error */}
            {errors.general && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" strokeWidth={2} />
                  <input
                    id="login-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="you@example.com"
                    className={`input pl-9 ${errors.email ? 'input-error' : ''}`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" strokeWidth={2} />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Your password"
                    className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    id="toggle-password-visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" strokeWidth={2} />
                      : <Eye className="w-4 h-4" strokeWidth={2} />
                    }
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password}</p>}
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                className="btn-primary btn-lg w-full mt-2"
                disabled={loading}
              >
                {loading
                  ? <><LoadingSpinner size="sm" /><span>Signing in...</span></>
                  : 'Sign In'
                }
              </button>
            </form>

            <p className="text-center text-sm text-dark-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
