import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700 text-white">
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-10 left-10 w-80 h-80 bg-yellow-400 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left animate-slide-in">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium mb-4 backdrop-blur-sm">
              🎉 Giảm đến 50% — Tuần lễ học tập
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              Nâng tầm kiến thức,<br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                mở rộng tương lai
              </span>
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-lg">
              Hơn 500+ khóa học chất lượng từ các giảng viên hàng đầu. Học mọi lúc, mọi nơi với E-Learning Platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all hover:shadow-lg hover:shadow-white/20 active:scale-[0.98]"
              >
                🚀 Khám phá khóa học
              </Link>
              <Link
                to="/courses?sort=best_seller"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
              >
                🏆 Bán chạy nhất
              </Link>
            </div>

            <div className="flex items-center gap-8 mt-10 justify-center md:justify-start text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-300">500+</p>
                <p className="text-white/50">Khóa học</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-300">50K+</p>
                <p className="text-white/50">Học viên</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-300">4.8⭐</p>
                <p className="text-white/50">Đánh giá</p>
              </div>
            </div>
          </div>

          <div className="flex-1 animate-fade-in hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
              alt="E-Learning"
              className="w-full max-w-md mx-auto rounded-2xl shadow-2xl shadow-black/30"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
