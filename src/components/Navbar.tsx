import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, User, LogOut, Briefcase, MessageSquare, Sun, Moon, Zap } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  return (
    <nav className="glass sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                className="relative w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-accent-500 to-primary-600 animate-gradient-shift bg-[length:200%_200%]" />
                <Zap className="w-5 h-5 text-white relative z-10" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
              <span className="text-xl font-bold text-gradient">SkillConnect</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <motion.button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl glass-button group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-surface-600 dark:text-surface-300" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400" />
                )}
              </motion.div>
            </motion.button>
            {user ? (
              <>
                <Link
                  to={`/${profile?.role}/dashboard`}
                  className="text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/5 dark:hover:bg-white/5"
                >
                  Dashboard
                </Link>
                <Link
                  to="/chat"
                  className="relative p-2.5 rounded-xl text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 hover:bg-white/5 dark:hover:bg-white/5"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full animate-pulse" />
                </Link>
                <Link
                  to={`/${profile?.role}/profile`}
                  className="flex items-center space-x-3 px-3 py-1.5 rounded-xl hover:bg-white/5 dark:hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary-500/30 group-hover:ring-primary-500/60 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <span className="text-surface-700 dark:text-surface-300 font-medium">{profile?.full_name?.split(' ')[0]}</span>
                </Link>
                <motion.button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-surface-500 dark:text-surface-400 hover:text-rose-500 dark:hover:text-rose-400 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-rose-500/10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden lg:inline">Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium rounded-xl transition-all duration-300 hover:bg-white/5"
                >
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/signup"
                    className="premium-button px-6 py-2.5"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl glass-button"
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-surface-600" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </motion.button>
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl glass-button"
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-surface-600 dark:text-surface-300" /> : <Menu className="w-6 h-6 text-surface-600 dark:text-surface-300" />}
            </motion.button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass border-t border-white/10 dark:border-surface-800/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {user ? (
                <>
                  <Link
                    to={`/${profile?.role}/dashboard`}
                    className="block px-4 py-3 text-surface-600 dark:text-surface-300 rounded-xl hover:bg-white/5 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/chat"
                    className="block px-4 py-3 text-surface-600 dark:text-surface-300 rounded-xl hover:bg-white/5 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Messages
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 text-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-surface-600 dark:text-surface-300 rounded-xl hover:bg-white/5 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl text-center font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
