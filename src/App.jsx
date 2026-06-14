// src/App.jsx
// Main app component with routing and route protection
// Handles: page navigation, role-based access control, splash screen

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';

// Pages
import LoginPage from './pages/LoginPage';
import StudentPage from './pages/StudentPage';
import StaffPage from './pages/StaffPage';
import AdminPage from './pages/AdminPage';
import TechnicianPage from './pages/TechnicianPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import SplashScreen from './components/SplashScreen';

// ═════════════════════════════════════════════════════════════
// PROTECTED ROUTE - Role-based Access Control
// ═════════════════════════════════════════════════════════════

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useApp();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== requiredRole) return <Navigate to="/login" replace />;
  return children;
};

// ═════════════════════════════════════════════════════════════
// APP LAYOUT - Wrapper for authenticated pages
// ═════════════════════════════════════════════════════════════

const AppLayout = () => {
  const { user, notification } = useApp();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEF0F8' }}>
      {user && <Navbar />}
      {notification && <Notification />}

      <Routes>
        {/* ─── PUBLIC ROUTES ─────────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />

        {/* ─── STUDENT ROUTES ────────────────────────────────── */}
        <Route
          path="/student"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentPage />
            </ProtectedRoute>
          }
        />

        {/* ─── ADMIN ROUTES ──────────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* ─── TECHNICIAN ROUTES ────────────────────────────── */}
        <Route
          path="/technician"
          element={
            <ProtectedRoute requiredRole="technician">
              <TechnicianPage />
            </ProtectedRoute>
          }
        />

        {/* ─── STAFF ROUTES ──────────────────────────────────── */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffPage />
            </ProtectedRoute>
          }
        />

        {/* ─── CATCH-ALL ROUTES ──────────────────────────────── */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// ROOT APP — with Splash Screen
// ═════════════════════════════════════════════════════════════

const App = () => {
  // ─── Splash screen state ──────────────────────────────────
  // Shows splash for 3 seconds then hides it
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      {/* Show splash screen on first load */}
      {showSplash && <SplashScreen />}

      {/* Main app — always rendered but hidden behind splash */}
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;