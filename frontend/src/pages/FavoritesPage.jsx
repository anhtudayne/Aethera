import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchFavorites } from '../store/slices/favoriteSlice';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import Footer from '../components/Footer';

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.favorite);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">🏠 Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Khóa học yêu thích</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            ❤️ Khóa học yêu thích
          </h1>
          {items.length > 0 && (
            <p className="text-gray-500">
              Bạn có <span className="font-semibold text-gray-700">{items.length}</span> khóa học trong danh sách yêu thích
            </p>
          )}
        </div>

        {/* Content */}
        {loading && items.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 font-medium">
            Lỗi: {error}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-lg mx-auto mt-6">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Danh sách yêu thích trống</h3>
            <p className="text-gray-500 mb-6 text-sm">Hãy khám phá các khóa học hấp dẫn của chúng tôi và thêm chúng vào danh sách yêu thích nhé!</p>
            <Link to="/courses" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md">
              Khám phá khóa học
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
