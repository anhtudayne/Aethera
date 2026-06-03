import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import EditProfilePage from './pages/EditProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CoursesPage from './pages/CoursesPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import MyRewardsPage from './pages/MyRewardsPage';
import FavoritesPage from './pages/FavoritesPage';
import NotificationsPage from './pages/NotificationsPage';

import LearningPage from './pages/LearningPage';

import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import CourseEditorPage from './pages/admin/CourseEditorPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/user/profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
      <Route path="/user/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
      <Route path="/user/rewards" element={<ProtectedRoute><MyRewardsPage /></ProtectedRoute>} />
      <Route path="/user/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
      <Route path="/user/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      
      {/* Admin routes */}
      <Route path="/admin/profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
      <Route path="/admin/courses" element={<ProtectedRoute><AdminCoursesPage /></ProtectedRoute>} />
      <Route path="/admin/courses/:slug/edit" element={<ProtectedRoute><CourseEditorPage /></ProtectedRoute>} />
      {/* Fallback admin routes to admin courses page for now */}
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminCoursesPage /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute><AdminCoursesPage /></ProtectedRoute>} />
      <Route path="/admin/revenue" element={<ProtectedRoute><AdminCoursesPage /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><AdminCoursesPage /></ProtectedRoute>} />

      <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
      <Route path="/course/:slug" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
      <Route path="/course/:slug/learn" element={<ProtectedRoute><LearningPage /></ProtectedRoute>} />
      <Route path="/category/:slug" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
