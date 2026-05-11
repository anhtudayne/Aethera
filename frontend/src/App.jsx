import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import EditProfilePage from './pages/EditProfilePage';

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

      {/* Placeholder for other team members */}
      <Route path="/forgot-password" element={<div className="min-h-screen flex items-center justify-center text-gray-400">Trang Quên mật khẩu — sẽ do bạn khác implement</div>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
