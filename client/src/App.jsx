import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ImpactAssistant from './components/common/ImpactAssistant';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import CampaignsPage from './pages/public/CampaignsPage';
import CampaignDetailsPage from './pages/public/CampaignDetailsPage';
import NGOsPage from './pages/public/NGOsPage';
import HowItWorksPage from './pages/public/HowItWorksPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Role Dashboards
import NGODashboard from './pages/ngo/NGODashboard';
import CampaignStudio from './pages/ngo/CampaignStudio';
import NGOMilestonesPage from './pages/ngo/NGOMilestonesPage';
import DonorDashboard from './pages/donor/DonorDashboard';
import DonorImpactTracker from './pages/donor/DonorImpactTracker';
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs font-semibold text-slate-400">
        Authenticating session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/campaign/:id" element={<CampaignDetailsPage />} />
              <Route path="/ngos" element={<NGOsPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* NGO & AI Studio Routes */}
              <Route
                path="/ngo/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['NGO', 'ADMIN']}>
                    <NGODashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ngo/campaign-studio"
                element={
                  <ProtectedRoute allowedRoles={['NGO', 'ADMIN', 'DONOR']}>
                    <CampaignStudio />
                  </ProtectedRoute>
                }
              />
              <Route path="/ai-studio" element={<CampaignStudio />} />
              <Route path="/poster-studio" element={<CampaignStudio />} />
              <Route
                path="/ngo/milestones"
                element={
                  <ProtectedRoute allowedRoles={['NGO', 'ADMIN']}>
                    <NGOMilestonesPage />
                  </ProtectedRoute>
                }
              />

              {/* Donor Routes */}
              <Route
                path="/donor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donor/impact/:id"
                element={
                  <ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}>
                    <DonorImpactTracker />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <ImpactAssistant />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
