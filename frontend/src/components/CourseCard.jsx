import { Link } from 'react-router-dom';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-xs ${i < full ? 'text-yellow-400' : i === full && half ? 'text-yellow-300' : 'text-gray-300'}`}>
          ★
        </span>
      ))}
      <span className="text-xs text-gray-500 ml-1 font-medium">{rating}</span>
    </div>
  );
}

export default function CourseCard({ course }) {
  const hasDiscount = course.salePrice && course.salePrice < course.price;
  const discountPercent = hasDiscount ? Math.round((1 - course.salePrice / course.price) * 100) : 0;

  return (
    <Link to={`/course/${course.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img
            src={course.thumbnail || course.images?.[0]?.imageUrl || 'https://via.placeholder.com/400x225'}
            alt={course.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasDiscount && (
              <span className="px-2.5 py-1 rounded-lg bg-red-500 text-white text-xs font-bold">
                -{discountPercent}%
              </span>
            )}
            {course.isNewArrival && (
              <span className="px-2.5 py-1 rounded-lg bg-blue-500 text-white text-xs font-bold">
                ✨ Mới
              </span>
            )}
            {course.isBestSeller && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-xs font-bold">
                🔥 Bán chạy
              </span>
            )}
          </div>
          <div className="absolute bottom-3 right-3">
            <span className="px-2 py-1 rounded-lg bg-black/60 text-white text-xs backdrop-blur-sm">
              {course.duration}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors mb-1.5 leading-snug">
            {course.name}
          </h3>
          <p className="text-xs text-gray-400 mb-2">{course.instructor}</p>

          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={parseFloat(course.rating) || 0} />
            <span className="text-xs text-gray-400">({course.totalStudents?.toLocaleString()} học viên)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-primary">
                {formatPrice(hasDiscount ? course.salePrice : course.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(course.price)}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">{course.totalLessons} bài</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
