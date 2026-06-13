import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Public Pages
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicStatsPage from './pages/PublicStatsPage';

// Protected Dashboard Layout and Pages
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import LinksPage from './pages/dashboard/LinksPage';
import LinkDetailPage from './pages/dashboard/LinkDetailPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import CreateLinkPage from './pages/dashboard/CreateLinkPage';
import QRCodesPage from './pages/dashboard/QRCodesPage';
import BulkUploadPage from './pages/dashboard/BulkUploadPage';
import SettingsPage from './pages/dashboard/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'toast-custom',
          duration: 3000,
          style: {
            background: 'var(--color-bg-dark)',
            color: 'white',
          },
        }} 
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/s/:shortCode/stats" element={<PublicStatsPage />} />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/home" replace />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="links" element={<LinksPage />} />
          <Route path="links/:id" element={<LinkDetailPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="create" element={<CreateLinkPage />} />
          <Route path="qr-codes" element={<QRCodesPage />} />
          <Route path="bulk-upload" element={<BulkUploadPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
