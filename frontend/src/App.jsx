import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Single Login Page
import LoginPage from './pages/LoginPage';

// Dashboards
import UserDashboardPage from './pages/UserDashboardPage';
import DashboardPage from './pages/DashboardPage';

// First-time biometric enrollment page
import BiometricEnrollmentPage from './pages/BiometricEnrollmentPage';

// Analysis Pages
import ImageAnalysisPage from './pages/ImageAnalysisPage';
import VideoAnalysisPage from './pages/VideoAnalysisPage';
import AudioAnalysisPage from './pages/AudioAnalysisPage';

// Operative per-session biometric gate
import BiometricEnrollment from './components/BiometricEnrollment';

// ── Loading Screen ────────────────────────────────────────────────────────────
const LoadingScreen = () => (
  <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-2 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin mx-auto mb-4" />
      <p className="text-cyber-cyan font-mono text-xs tracking-widest uppercase animate-pulse">
        INITIALIZING SECURE SYSTEMS...
      </p>
    </div>
  </div>
);

// ── Route Guards ─────────────────────────────────────────────────────────────

// Public/common user route guard — requires per-session liveness verification
const CommonRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== 'common') return <Navigate to="/" replace />;

  // Enforce first-time enrollment
  if (!user.biometrics_enrolled) {
    return <Navigate to="/enroll" replace />;
  }

  // Each new browser session requires biometric liveness check
  if (sessionStorage.getItem('biometrics_verified') !== 'true') {
    return (
      <BiometricEnrollment
        username={user.username}
        onComplete={() => {
          sessionStorage.setItem('biometrics_verified', 'true');
          window.location.reload();
        }}
      />
    );
  }
  return children;
};

// Operative route guard — requires per-session liveness verification
const OperativeRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== 'operative') return <Navigate to="/" replace />;

  // Enforce first-time enrollment
  if (!user.biometrics_enrolled) {
    return <Navigate to="/enroll" replace />;
  }

  // Each new browser session requires biometric liveness check
  if (sessionStorage.getItem('biometrics_verified') !== 'true') {
    return (
      <BiometricEnrollment
        username={user.username}
        onComplete={() => {
          sessionStorage.setItem('biometrics_verified', 'true');
          window.location.reload();
        }}
      />
    );
  }
  return children;
};

// Enrollment gate — only for users who haven't completed first-time enrollment
// Enrolled users are redirected straight to their dashboard
const EnrollmentGate = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/" replace />;  // no session → login first
  if (user.biometrics_enrolled) {
    const dest = user.role === 'operative' ? '/operative/dashboard' : '/user/dashboard';
    return <Navigate to={dest} replace />;
  }
  return children;
};

// ── App Routes ────────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    {/* ── ENTRY POINT: Universal Login / Signup ── */}
    <Route path="/" element={<LoginPage />} />

    {/* ── FIRST-TIME BIOMETRIC ENROLLMENT ── */}
    <Route
      path="/enroll"
      element={
        <EnrollmentGate>
          <BiometricEnrollmentPage />
        </EnrollmentGate>
      }
    />

    {/* Legacy login redirects */}
    <Route path="/login"    element={<Navigate to="/" replace />} />
    <Route path="/login/*"  element={<Navigate to="/" replace />} />

    {/* ── COMMON / PUBLIC USER ROUTES ── */}
    <Route path="/user/dashboard" element={<CommonRoute><UserDashboardPage /></CommonRoute>} />
    <Route path="/user/image"     element={<CommonRoute><ImageAnalysisPage /></CommonRoute>} />
    <Route path="/user/video"     element={<CommonRoute><VideoAnalysisPage /></CommonRoute>} />
    <Route path="/user/audio"     element={<CommonRoute><AudioAnalysisPage /></CommonRoute>} />

    {/* ── FORENSIC OPERATIVE ROUTES ── */}
    <Route path="/operative/dashboard" element={<OperativeRoute><DashboardPage /></OperativeRoute>} />
    <Route path="/operative/image"     element={<OperativeRoute><ImageAnalysisPage /></OperativeRoute>} />
    <Route path="/operative/video"     element={<OperativeRoute><VideoAnalysisPage /></OperativeRoute>} />
    <Route path="/operative/audio"     element={<OperativeRoute><AudioAnalysisPage /></OperativeRoute>} />

    {/* Legacy path redirects */}
    <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
    <Route path="/image"     element={<Navigate to="/user/image"     replace />} />
    <Route path="/video"     element={<Navigate to="/user/video"     replace />} />
    <Route path="/audio"     element={<Navigate to="/user/audio"     replace />} />

    {/* Catch-all fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
