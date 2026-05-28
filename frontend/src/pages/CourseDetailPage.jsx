import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseBySlugService, getRelatedCoursesService, incrementViewCountService } from '../services/courseService';
import { addViewedCourseService } from '../services/viewedService';
import { toggleFavorite } from '../store/slices/favoriteSlice';
import { addToCart, fetchCartCount } from '../store/slices/cartSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import ReviewSection from '../components/ReviewSection';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { favoriteIds } = useSelector((state) => state.favorite);
  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartError, setCartError] = useState(null);

  const isFavorite = course ? favoriteIds.includes(course.id) : false;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCourseBySlugService(slug);
        const courseData = response.data.data;
        setCourse(courseData);
        
        if (courseData && courseData.id) {
          try {
            await incrementViewCountService(courseData.id);
            await addViewedCourseService(courseData.id);
          } catch (e) {
            console.error('Error handling course view logs:', e);
          }
          const relatedResponse = await getRelatedCoursesService(courseData.id);
          setRelatedCourses(relatedResponse.data.data);
        }
      } catch (err) {
        setError('Không thể tải thông tin khóa học. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-gray-800">
        <h2 className="text-3xl font-bold mb-4">{error || 'Không tìm thấy khóa học'}</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-semibold underline">Quay lại trang chủ</Link>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-block px-3 py-1 bg-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider">
              {course.category?.name || 'Khóa học'}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              {course.name}
            </h1>
            <p className="text-lg text-slate-300">
              {course.description || 'Khám phá khóa học tuyệt vời này và nâng cao kỹ năng của bạn.'}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-400 text-lg">star</span>
                <span className="font-semibold text-white">{course.rating}</span>
                <span>({course.reviewsCount || 0} đánh giá)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-lg">payments</span>
                <span><span className="text-white font-semibold">{course.buyersCount || 0}</span> học viên đã mua</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">person</span>
                <span>Giảng viên: <span className="text-white font-medium">{course.instructor}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">language</span>
                <span>{course.language}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3 bg-white rounded-xl shadow-2xl p-6 text-gray-900 sticky top-10">
            <div className="aspect-video bg-gray-200 rounded-lg mb-6 overflow-hidden relative">
              <img 
                src={course.thumbnail || 'https://via.placeholder.com/600x400?text=Course+Thumbnail'} 
                alt={course.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-indigo-600 text-3xl">play_arrow</span>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(course.salePrice || course.price)}
                </span>
                {course.salePrice && course.salePrice < course.price && (
                  <span className="text-lg text-gray-400 line-through mb-1">
                    {formatPrice(course.price)}
                  </span>
                )}
              </div>
              <button className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-md">
                Đăng ký học ngay
              </button>
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    setCartError(null);
                    const result = await dispatch(addToCart(course.id));
                    if (result.meta.requestStatus === 'fulfilled') {
                      setAddedToCart(true);
                      dispatch(fetchCartCount());
                      setTimeout(() => setAddedToCart(false), 2500);
                    } else {
                      setCartError(result.payload?.message || 'Lỗi thêm vào giỏ hàng');
                    }
                  }}
                  disabled={addedToCart}
                  className={`flex-1 py-3 px-4 font-bold rounded-lg transition-colors shadow-md ${
                    addedToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {addedToCart ? '✅ Đã thêm vào giỏ hàng' : 'Thêm vào giỏ hàng'}
                </button>
                <button
                  onClick={() => dispatch(toggleFavorite(course.id))}
                  className={`px-4 rounded-lg border-2 transition-all flex items-center justify-center ${
                    isFavorite
                      ? 'border-red-500 bg-red-50 text-red-500 hover:bg-red-100'
                      : 'border-gray-300 bg-white text-gray-500 hover:text-red-500 hover:border-red-300'
                  }`}
                  title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}>
                    favorite
                  </span>
                </button>
              </div>
              {cartError && <p className="text-xs text-red-500 text-center mt-1">{cartError}</p>}
              <p className="text-xs text-center text-gray-500">Hoàn tiền trong 30 ngày. Đảm bảo chất lượng.</p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3">Khóa học này bao gồm:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-gray-400 text-sm">schedule</span> Thời lượng: {course.duration || 'Đang cập nhật'}</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-gray-400 text-sm">library_books</span> Bài học: {course.totalLessons || 0}</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-gray-400 text-sm">leaderboard</span> Trình độ: {course.level}</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-gray-400 text-sm">all_inclusive</span> Quyền truy cập trọn đời</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-gray-400 text-sm">military_tech</span> Chứng chỉ hoàn thành</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col md:flex-row gap-10">
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mô tả khóa học</h2>
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p>{course.description}</p>
              <p className="mt-4">Khóa học này được thiết kế dành cho mọi đối tượng, cung cấp kiến thức nền tảng và nâng cao giúp bạn tự tin áp dụng vào thực tế. Với phương pháp giảng dạy trực quan, thực hành liên tục, bạn sẽ dễ dàng làm chủ các kỹ năng cần thiết.</p>
            </div>
          </div>
        </div>
        
        {/* Empty space to align with the sticky sidebar on desktop */}
        <div className="hidden md:block md:w-1/3"></div>
      </div>
      
      {/* Review Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <ReviewSection courseId={course.id} />
      </div>

      {/* Related Courses Section */}
      {relatedCourses.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Các khóa học liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedCourses.map(related => (
              <Link to={`/course/${related.slug}`} key={related.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden flex flex-col">
                <div className="h-40 overflow-hidden">
                  <img src={related.thumbnail || 'https://via.placeholder.com/300x200'} alt={related.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{related.name}</h3>
                  <div className="text-sm text-gray-500 mb-2">{related.instructor}</div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-indigo-600">{formatPrice(related.salePrice || related.price)}</span>
                    <div className="flex items-center gap-1 text-sm text-yellow-500">
                      <span className="material-icons text-sm">star</span>
                      <span>{related.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
