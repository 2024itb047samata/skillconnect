import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, User, LogOut, Briefcase, MessageSquare, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg"><Briefcase className="w-6 h-6 text-white" /></div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">SkillConnect</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            {user ? (
              <>
                <Link to={`/${profile?.role}/dashboard`} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg transition-colors">Dashboard</Link>
                <Link to="/chat" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg"><MessageSquare className="w-5 h-5" /></Link>
                <Link to={`/${profile?.role}/profile`} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center"><User className="w-4 h-4 text-white" /></div>
                  <span>{profile?.full_name}</span>
                </Link>
                <button onClick={handleSignOut} className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-red-600 px-3 py-2 rounded-lg"><LogOut className="w-5 h-5" /><span>Logout</span></button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Login</Link>
                <Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all">Sign Up</Link>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-600 dark:text-gray-300">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-gray-300 p-2">{isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <div className="px-4 py-4 space-y-2">
            {user ? (
              <>
                <Link to={`/${profile?.role}/dashboard`} className="block px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link to="/chat" className="block px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg" onClick={() => setIsMenuOpen(false)}>Messages</Link>
                <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-red-600 rounded-lg">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="block px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
