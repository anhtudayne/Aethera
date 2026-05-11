import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center animate-fade-in">
        <h1 className="text-8xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-xl text-gray-600 mt-4 mb-8">Trang bạn tìm không tồn tại</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
