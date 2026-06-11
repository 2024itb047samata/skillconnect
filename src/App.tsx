import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SearchWorkersPage from './pages/SearchWorkersPage';
import WorkerProfilePage from './pages/WorkerProfilePage';
import ChatPage from './pages/ChatPage';
import CustomerDashboard from './pages/customer/Dashboard';
import PostJobPage from './pages/customer/PostJobPage';
import CustomerBookingsPage from './pages/customer/BookingsPage';
import WorkerDashboard from './pages/worker/Dashboard';
import WorkerProfileEdit from './pages/worker/ProfileEdit';
import AdminDashboard from './pages/admin/Dashboard';
import SOSPage from './pages/worker/SOSPage';
import EmergencyPage from './pages/EmergencyPage';
import ContractorDashboard from './pages/contractor/Dashboard';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, profile, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a14]">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) return <Navigate to={`/${profile.role}/dashboard`} replace />;
  return <>{children}</>;
}

function App() {
  const { user, profile, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a14]">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return (
    <div className="min-h-screen bg-[#0a0a14] transition-colors duration-300">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={user ? <Navigate to={`/${profile?.role || 'customer'}/dashboard`} replace /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to={`/${profile?.role || 'customer'}/dashboard`} replace /> : <SignupPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/search" element={<ProtectedRoute><SearchWorkersPage /></ProtectedRoute>} />
          <Route path="/worker/:workerId" element={<ProtectedRoute><WorkerProfilePage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/chat/:chatWithId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['customer', 'admin']}><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/customer/post-job" element={<ProtectedRoute allowedRoles={['customer', 'admin']}><PostJobPage /></ProtectedRoute>} />
          <Route path="/customer/bookings" element={<ProtectedRoute allowedRoles={['customer', 'admin']}><CustomerBookingsPage /></ProtectedRoute>} />
          <Route path="/customer/jobs" element={<ProtectedRoute allowedRoles={['customer', 'admin']}><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/customer/profile" element={<ProtectedRoute allowedRoles={['customer', 'admin']}><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/worker/dashboard" element={<ProtectedRoute allowedRoles={['worker', 'admin']}><WorkerDashboard /></ProtectedRoute>} />
          <Route path="/worker/profile" element={<ProtectedRoute allowedRoles={['worker', 'admin']}><WorkerProfileEdit /></ProtectedRoute>} />
          <Route path="/worker/bookings" element={<ProtectedRoute allowedRoles={['worker', 'admin']}><CustomerBookingsPage /></ProtectedRoute>} />
          <Route path="/worker/jobs" element={<ProtectedRoute allowedRoles={['worker', 'admin']}><WorkerDashboard /></ProtectedRoute>} />
          <Route path="/worker/reviews" element={<ProtectedRoute allowedRoles={['worker', 'admin']}><WorkerDashboard /></ProtectedRoute>} />
          <Route path="/worker/sos" element={<ProtectedRoute allowedRoles={['worker', 'admin']}><SOSPage /></ProtectedRoute>} />
          <Route path="/contractor/dashboard" element={<ProtectedRoute allowedRoles={['contractor', 'admin']}><ContractorDashboard /></ProtectedRoute>} />
          <Route path="/contractor/team" element={<ProtectedRoute allowedRoles={['contractor', 'admin']}><ContractorDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={user ? <Navigate to={`/${profile?.role || 'customer'}/dashboard`} replace /> : <Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
