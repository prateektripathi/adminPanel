import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { DataProvider } from './contexts/DataContext.jsx';
import { NotificationProvider } from './contexts/NotificationContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UserManagement from './pages/UserManagement.jsx';
import StaffManagement from './pages/StaffManagement.jsx';
import ProductManagement from './pages/ProductManagement.jsx';
import PaymentsOrders from './pages/PaymentsOrders.jsx';
import Reports from './pages/Reports.jsx';
import BucketManagement from './pages/BucketManagement.jsx';
import CustomerSupport from './components/Support/CustomerSupport.jsx'; // ✅ new import

import Layout from './components/Layout/Layout.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoutes.jsx';

import './index.css';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['admin', 'staff']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StaffManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={['admin', 'staff']}>
              <ProductManagement />
            </ProtectedRoute>
          }
        />

        <Route path="/payments" element={<PaymentsOrders />} />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['admin', 'staff']}>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route path="/buckets" element={<BucketManagement />} />

        {/* ✅ New Customer Support route */}
        <Route
          path="/support"
          element={
            <ProtectedRoute allowedRoles={['admin', 'staff', 'user']}>
              <CustomerSupport />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <ThemeProvider>
              <div className="min-h-screen bg-gray-50">
                <AppRoutes />
              </div>
            </ThemeProvider>
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
