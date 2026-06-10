// src/App.jsx
// Main app component with routing and route protection
// Handles: page navigation, role-based access control

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

// ═════════════════════════════════════════════════════════════
// PROTECTED ROUTE - Role-based Access Control
// ═════════════════════════════════════════════════════════════

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useApp();

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to login
  if (user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  // All checks passed → render page
  return children;
};

// ═════════════════════════════════════════════════════════════
// APP LAYOUT - Wrapper for authenticated pages
// ═════════════════════════════════════════════════════════════

const AppLayout = () => {
  const { user, notification } = useApp();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEF0F8' }}>
      {/* Show navbar only when logged in */}
      {user && <Navbar />}

      {/* Show notifications globally */}
      {notification && <Notification />}

      {/* Page content */}
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

        {/* ─── STAFF ROUTES ──────────────────────────────── */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffPage />
            </ProtectedRoute>
          }
        />

        {/* ─── CATCH-ALL ROUTES ──────────────────────────────– */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// ROOT APP
// ═════════════════════════════════════════════════════════════

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;