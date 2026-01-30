import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppStore } from './store/AppContext';
import Login from './components/Login';
import Signup from './components/Signup';
import DashboardLayout from './components/DashboardLayout';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode; allowedRoles?: string[] }) => {
  const { user } = useAppStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Route Director based on Role
const DashboardRedirector = () => {
  const { user } = useAppStore();
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'student': return <StudentDashboard />;
    case 'admin': return <AdminDashboard />;
    case 'staff': return <StaffDashboard />;
    default: return <Navigate to="/login" replace />;
  }
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <DashboardRedirector />
          </DashboardLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </HashRouter>
  );
};

export default App;