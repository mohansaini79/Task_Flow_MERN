import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, User, CheckSquare2, Sparkles, Clock, BarChart3 } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const FEATURES = [
  { icon: Sparkles, label: 'AI-Enhanced Tasks',   color: 'text-violet-400 bg-violet-400/10' },
  { icon: Clock,    label: 'Real-Time Timers',     color: 'text-emerald-400 bg-emerald-400/10' },
  { icon: BarChart3,label: 'Daily Productivity',   color: 'text-blue-400 bg-blue-400/10' },
];

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    const newErrors = validate();
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      toast.success('Welcome to TaskFlow! 🎉');
      navigate('/dashboard');
    } else {
      const msg = result.message || 'Registration failed. Please try again.';
      setGeneralError(msg);
      toast.error(msg);
      if (result.errors) {
        const fieldErrors = {};
        result.errors.forEach(({ field, message }) => { fieldErrors[field] = message; });
        setErrors(fieldErrors);
      }
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (generalError) setGeneralError('');
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col lg:flex-row">

      {/* ── Left panel (desktop) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark-950 via-violet-950/20 to-dark-900 p-12 flex-col justify-between border-r border-dark-700/40 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-primary-600/8 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow">
            <CheckSquare2 className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <span className="text-xl font-bold text-dark-100">TaskFlow</span>
        </div>

        {/* Hero */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-dark-100 leading-tight">
              Start tracking your<br />
              <span className="text-gradient">time smarter</span>
            </h2>
            <p className="text-dark-400 mt-3 text-base leading-relaxed max-w-sm">
              Join thousands using AI to manage tasks and track every productive minute of their day.
            </p>
          </div>

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

        <div className="relative z-10">
          <p className="text-xs text-dark-600 italic">"Done is better than perfect."</p>
          <p className="text-xs text-dark-700 mt-1">— Sheryl Sandberg</p>
        </div>
      </div>

      {/* ── Right panel / form ── */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-violet-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-primary-600/6 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 items-center justify-center mb-3 shadow-glow-lg">
              <CheckSquare2 className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-gradient">TaskFlow</h1>
            <p className="text-dark-500 text-sm mt-1">Create your free account</p>
          </div>

          {/* Card */}
          <div className="glass p-6 sm:p-8 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-dark-100">Create account</h2>
              <p className="text-dark-500 text-sm mt-1">Start tracking your productivity today</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* General backend error */}
              {generalError && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-1.5" />
                  <p className="text-sm text-rose-400 leading-relaxed">{generalError}</p>
                </div>
              )}
              {/* Name */}
              <div>
                <label htmlFor="register-name" className="label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" strokeWidth={2} />
                  <input
                    id="register-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="John Doe"
                    className={`input pl-9 ${errors.name ? 'input-error' : ''}`}
                    autoComplete="name"
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="register-email" className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" strokeWidth={2} />
                  <input
                    id="register-email"
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
                <label htmlFor="register-password" className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" strokeWidth={2} />
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="At least 6 characters"
                    className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
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

              {/* Password strength hint */}
              {form.password && (
                <div className="flex gap-1">
                  {[1,2,3,4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        form.password.length >= i * 2
                          ? form.password.length >= 8 ? 'bg-emerald-500' : 'bg-amber-500'
                          : 'bg-dark-700'
                      }`}
                    />
                  ))}
                </div>
              )}

              <button
                type="submit"
                id="register-submit-btn"
                className="btn-primary btn-lg w-full mt-2"
                disabled={loading}
              >
                {loading
                  ? <><LoadingSpinner size="sm" /><span>Creating account...</span></>
                  : 'Create Account'
                }
              </button>
            </form>

            <p className="text-center text-sm text-dark-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
