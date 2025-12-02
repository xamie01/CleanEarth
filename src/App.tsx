import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UserDashboard } from './pages/user/UserDashboard';
import { CollectorDashboard } from './pages/collector/CollectorDashboard';

function ProtectedRoute({
  children,
  requiredType,
}: {
  children: React.ReactNode;
  requiredType?: 'user' | 'collector';
}) {
  const { user, userType, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredType && userType !== requiredType) {
    return <Navigate to={userType === 'user' ? '/user/dashboard' : '/collector/dashboard'} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, userType, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={userType === 'user' ? '/user/dashboard' : '/collector/dashboard'} replace />
          ) : (
            <Landing />
          )
        }
      />
      <Route
        path="/login"
        element={user ? <Navigate to={userType === 'user' ? '/user/dashboard' : '/collector/dashboard'} replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to={userType === 'user' ? '/user/dashboard' : '/collector/dashboard'} replace /> : <Register />}
      />

      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute requiredType="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/collector/dashboard"
        element={
          <ProtectedRoute requiredType="collector">
            <CollectorDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
