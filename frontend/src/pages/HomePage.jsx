import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';

export default function HomePage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary mb-4">
                <span className="text-4xl">🎓</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                Xin chào, {user?.firstName} {user?.lastName}!
              </h1>
              <p className="text-gray-500 mt-2">Chào mừng bạn đến với E-Learning Platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/10 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-700 mb-1">📧 Email</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl p-6 border border-secondary/10 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-700 mb-1">🏷️ Vai trò</h3>
                <p className="text-sm text-gray-500">{user?.role === 'admin' ? 'Quản trị viên' : 'Học viên'}</p>
              </div>
              <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-6 border border-accent/10 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-700 mb-1">📚 Trạng thái</h3>
                <p className="text-sm text-gray-500">Đang hoạt động</p>
              </div>
            </div>

            <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-400 text-center">
                Trang này là placeholder. Các bạn khác sẽ implement trang Profile, Forgot Password tại đây.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
