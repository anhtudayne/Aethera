import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">🎓 E-Learning</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Nền tảng học trực tuyến hàng đầu Việt Nam. Nơi kết nối giảng viên chất lượng và học viên đam mê tri thức.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Trang chủ</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors">Khóa học</Link></li>
              <li><Link to="/courses?sort=best_seller" className="hover:text-white transition-colors">Bán chạy</Link></li>
              <li><Link to="/courses?sort=newest" className="hover:text-white transition-colors">Mới nhất</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Nhóm 08</h4>
            <ul className="space-y-2 text-sm">
              <li>Nguyễn Thuận Phú — 23110285</li>
              <li>Vũ Anh Quốc — 23110296</li>
              <li>Võ Văn Tú — 23110359</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-gray-500">
            © 2024 E-Learning Platform — Nhóm 08. Bài tập 02 & 04.
          </p>
        </div>
      </div>
    </footer>
  );
}
