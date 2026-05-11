import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import EditProfilePage from './pages/EditProfilePage';

import ForgotPasswordPage from './pages/ForgotPasswordPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/user/profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
