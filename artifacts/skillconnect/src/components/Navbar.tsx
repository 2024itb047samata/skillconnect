import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, User, LogOut, MessageSquare, Sun, Moon, Zap, ChevronLeft, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const showBackButton = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#0a0a14]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <motion.button
                onClick={() => navigate(-1)}
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
            )}

            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                className="relative w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500" />
                <Zap className="w-5 h-5 text-white relative z-10" />
              </motion.div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">SkillConnect</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <motion.button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </motion.button>

            {user ? (
              <>
                <Link
                  to={`/${profile?.role}/dashboard`}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5 font-medium"
                >
                  Dashboard
                </Link>

                {profile?.role === 'worker' && (
                  <Link
                    to="/worker/sos"
                    className="relative p-2.5 rounded-xl text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-all hover:bg-red-50 dark:hover:bg-red-500/10"
                    title="SOS / Safety"
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </Link>
                )}

                <Link
                  to="/chat"
                  className="relative p-2.5 rounded-xl text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full" />
                </Link>

                <Link
                  to={`/${profile?.role}/profile`}
                  className="flex items-center space-x-3 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary-200 dark:ring-primary-500/30 group-hover:ring-primary-400 dark:group-hover:ring-primary-500/60 transition-all bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">{profile?.full_name?.split(' ')[0]}</span>
                </Link>

                <motion.button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-rose-400 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-red-50 dark:hover:bg-rose-500/10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden lg:inline">Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 bg-white dark:bg-white text-primary-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-sm border border-gray-200 dark:border-0"
                  >
                    Login
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/signup"
                    className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-xl transition-all"
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
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10"
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </motion.button>

            {!user && (
              <Link
                to="/login"
                className="px-4 py-2 bg-white dark:bg-white text-primary-600 font-bold rounded-xl border border-gray-200 dark:border-0 shadow-sm"
              >
                Login
              </Link>
            )}

            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10"
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-900 dark:text-white" /> : <Menu className="w-6 h-6 text-gray-900 dark:text-white" />}
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
            className="md:hidden bg-white dark:bg-[#0a0a14] border-t border-gray-200 dark:border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {user ? (
                <>
                  <Link
                    to={`/${profile?.role}/dashboard`}
                    className="block px-4 py-3 text-gray-900 dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  {profile?.role === 'worker' && (
                    <Link
                      to="/worker/sos"
                      className="block px-4 py-3 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <AlertTriangle className="w-4 h-4 inline mr-2" />
                      SOS / Safety
                    </Link>
                  )}

                  <Link
                    to="/chat"
                    className="block px-4 py-3 text-gray-900 dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Messages
                  </Link>

                  <button
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 text-red-500 dark:text-rose-400 rounded-xl hover:bg-red-50 dark:hover:bg-rose-500/10 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-gray-900 dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl text-center font-semibold"
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
