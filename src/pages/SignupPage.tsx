import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, User, Phone, MapPin, Briefcase, UserCog, Sun, Moon, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'worker' ? 'worker' : 'customer';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState<'customer' | 'worker'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const { error } = await signUp(email, password, fullName, role, phone, location);
    if (error) { setError(error.message || 'Failed to create account'); setLoading(false); return; }
    alert('Account created! Please check your email to verify.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-hero-gradient opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-500/20 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="glass-card p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <motion.div
                className="relative w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-accent-500 to-primary-600 animate-gradient-shift bg-[length:200%_200%]" />
                <Zap className="w-5 h-5 text-white relative z-10" />
              </motion.div>
              <span className="text-xl font-bold text-gradient">SkillConnect</span>
            </Link>
            <motion.button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl glass-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-surface-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </motion.button>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">Create an account</h1>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span className="text-sm text-rose-300">{error}</span>
            </motion.div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'customer', icon: Briefcase, label: 'Hire Workers' },
                { id: 'worker', icon: UserCog, label: 'Work as Pro' },
              ].map((r) => (
                <motion.button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as 'customer' | 'worker')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    role === r.id
                      ? 'border-primary-500 bg-primary-500/10 shadow-glow'
                      : 'border-surface-700 hover:border-surface-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <r.icon className={`w-6 h-6 mx-auto mb-2 ${role === r.id ? 'text-primary-400' : 'text-surface-500'}`} />
                  <span className={`font-medium ${role === r.id ? 'text-primary-400' : 'text-surface-400'}`}>{r.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Full Name"
                className="input-premium pl-12"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="input-premium pl-12"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="input-premium pl-12"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="input-premium pl-12"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="input-premium pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm Password"
                className="input-premium pl-12"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full premium-button py-4 text-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-surface-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
