import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title, subtitle, footerText, footerLink, footerLinkText }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-secondary to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center px-12 text-white">
          <div className="animate-slide-in">
            <h1 className="text-5xl font-extrabold mb-4">🎓</h1>
            <h2 className="text-4xl font-bold mb-4">E-Learning Platform</h2>
            <p className="text-lg text-white/80 leading-relaxed max-w-md">
              Nền tảng học trực tuyến hiện đại. Đăng ký ngay để trải nghiệm hàng ngàn khóa học chất lượng cao.
            </p>
            <div className="mt-8 flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1">✓ Miễn phí đăng ký</span>
              <span className="flex items-center gap-1">✓ Bảo mật cao</span>
              <span className="flex items-center gap-1">✓ 24/7 hỗ trợ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-gray-50">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              🎓 E-Learning
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>

            {children}
          </div>

          {footerText && (
            <p className="text-center text-sm text-gray-500 mt-6">
              {footerText}{' '}
              <Link to={footerLink} className="text-primary font-semibold hover:text-primary-dark transition-colors">
                {footerLinkText}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
