import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🎓 E-Learning
          </h1>

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-700">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-400">{user.role === 'admin' ? 'Quản trị viên' : 'Học viên'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                {user.firstName?.charAt(0)}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors font-medium"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
