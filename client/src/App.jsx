// src/App.jsx
import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import PrivateRoute from '@/context/PrivateRoute';
import LoginPage from '@/Modules/Auth/Login';
import ForgotPassword from '@/Modules/Auth/ForgotPassword';
import VerifyOTP from '@/Modules/Auth/VerifyOTP';
import ResetPassword from '@/Modules/Auth/ResetPassword';
import { adminRoutes } from '@/routes/AdminRoutes';
import { voterRoutes } from '@/routes/VoterRoutes';
import Page from './Modules/Pages/main-dashboard/page';
import Register from './Modules/Auth/Register';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PrivateRoute allowedRole="public"><LoginPage /></PrivateRoute>} />
        <Route path="/register" element={<PrivateRoute allowedRole="public"><Register /></PrivateRoute>} />
        <Route path="/login" element={<PrivateRoute allowedRole="public"><LoginPage /></PrivateRoute>} />
        <Route path="/forgot-password" element={<PrivateRoute allowedRole="public"><ForgotPassword /></PrivateRoute>} />
        <Route path="/verify-otp" element={<PrivateRoute allowedRole="public"><VerifyOTP /></PrivateRoute>} />
        <Route path="/reset-password" element={<PrivateRoute allowedRole="public"><ResetPassword /></PrivateRoute>} />
        {/* Protected Routes with Sidebar Layout */}
        <Route element={<Page />}>
          {adminRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          {voterRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;