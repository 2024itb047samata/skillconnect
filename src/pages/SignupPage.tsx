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
    <div className="min-h-screen bg-gray-100 dark:bg-surface-950 flex items-center justify-center py-12 px-4 relative overflow-hidden transition-colors">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-200 dark:bg-hero-gradient dark:opacity-30 transition-colors" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-200/50 dark:bg-primary-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-200/50 dark:bg-accent-500/20 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-[#12122a] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-xl dark:shadow-none">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <motion.div
                className="relative w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-accent-500 to-primary-600" />
                <Zap className="w-5 h-5 text-white relative z-10" />
              </motion.div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">SkillConnect</span>
            </Link>
            <motion.button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-gray-700" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </motion.button>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h1>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-rose-500/10 border border-red-200 dark:border-rose-500/30 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-rose-400" />
              <span className="text-sm text-red-600 dark:text-rose-300">{error}</span>
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
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 shadow-md dark:shadow-glow'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-transparent'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <r.icon className={`w-6 h-6 mx-auto mb-2 ${role === r.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`} />
                  <span className={`font-medium ${role === r.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>{r.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-[#0a0a14] border border-gray-300 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-[#0a0a14] border border-gray-300 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-[#0a0a14] border border-gray-300 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-[#0a0a14] border border-gray-300 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-[#0a0a14] border border-gray-300 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm Password"
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-[#0a0a14] border border-gray-300 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
            <p className="text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
