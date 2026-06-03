import React, { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, Users, BarChart, Settings, Save, Send
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const AdminLayout = ({ children, title = 'Bảng điều khiển', subtitle = '', showHeaderActions = false, onPublish, isPublishing = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(() => {
      if (location.pathname.includes('/admin/courses')) return 'courses';
      if (location.pathname.includes('/admin/students')) return 'students';
      if (location.pathname.includes('/admin/revenue')) return 'revenue';
      if (location.pathname.includes('/admin/settings')) return 'settings';
      return 'dashboard';
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
      dispatch(logout());
      navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'courses', label: 'Quản lý Khóa học', icon: BookOpen, path: '/admin/courses' },
    { id: 'students', label: 'Học viên', icon: Users, path: '/admin/students' },
    { id: 'revenue', label: 'Doanh thu & Thống kê', icon: BarChart, path: '/admin/revenue' },
    { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/admin/settings' },
  ];

  const handleNavigation = (item) => {
      setActiveMenu(item.id);
      navigate(item.path);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex fixed h-full z-10 shadow-sm">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 cursor-pointer gap-2" onClick={() => navigate('/')}>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex-shrink-0">
            🎓 E-Learning
          </span>
          <span className="text-blue-600 text-sm font-semibold relative -top-1">Admin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200 mt-auto">
          <div className="flex items-center justify-between px-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors group">
            <div className="flex items-center">
              <img 
                src={user?.image || "https://i.pravatar.cc/150?img=11"} 
                alt="Instructor avatar" 
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-slate-500">Giảng viên (Pro)</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              title="Đăng xuất"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        
        {/* Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-10 shrink-0">
          <div>
            {subtitle && <div className="text-xs text-slate-500 font-medium mb-0.5">{subtitle}</div>}
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              {title}
            </h1>
          </div>
          
          {showHeaderActions && (
            <div className="flex items-center gap-3">
              <button className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <Save className="w-4 h-4 mr-2 text-slate-400" />
                Lưu nháp
              </button>
              <button 
                onClick={onPublish}
                disabled={isPublishing}
                className="flex items-center px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors shadow-blue-600/20 disabled:bg-blue-400"
              >
                <Send className="w-4 h-4 mr-2" />
                {isPublishing ? 'Đang xuất bản...' : 'Xuất bản'}
              </button>
            </div>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
           {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
