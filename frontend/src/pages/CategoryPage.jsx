import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategoryCourses, clearCategoryCourses } from '../store/slices/courseSlice';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import Footer from '../components/Footer';

export default function CategoryPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { categoryCourses, categoryInfo, categoryPagination, categoryLoading } = useSelector((state) => state.course);
  const loadingRef = useRef(false);

  // Sync loading state to ref (tránh stale closure trong scroll handler)
  useEffect(() => { loadingRef.current = categoryLoading; }, [categoryLoading]);

  // Reset & load trang 1 khi slug thay đổi
  useEffect(() => {
    dispatch(clearCategoryCourses());
    dispatch(fetchCategoryCourses({ slug, page: 1, limit: 6 }));
    return () => dispatch(clearCategoryCourses());
  }, [dispatch, slug]);

  const hasMore = categoryPagination.page < categoryPagination.totalPages;

  // Infinite Scroll: scroll event listener
  useEffect(() => {
    if (categoryLoading || !hasMore || categoryCourses.length === 0) return;

    const handleScroll = () => {
      if (loadingRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      // Khi user cuộn đến cách bottom 300px → load thêm
      if (scrollTop + clientHeight >= scrollHeight - 300) {
        dispatch(fetchCategoryCourses({ slug, page: categoryPagination.page + 1, limit: 6 }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch, slug, categoryLoading, hasMore, categoryCourses.length, categoryPagination.page, categoryPagination.totalPages]);

  const showCount = categoryCourses.length;
  const totalCount = categoryPagination.total;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">🏠 Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{categoryInfo?.name || slug}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            📂 {categoryInfo?.name || 'Đang tải...'}
          </h1>
          {totalCount > 0 && (
            <p className="text-gray-500">
              Hiển thị <span className="font-semibold text-gray-700">{showCount}</span> / <span className="font-semibold text-gray-700">{totalCount}</span> khóa học
            </p>
          )}
        </div>

        {/* Course Grid */}
        {categoryCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : !categoryLoading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-500 font-medium">Chưa có khóa học nào trong danh mục này</p>
            <Link to="/" className="mt-4 inline-block text-primary font-semibold hover:underline">
              ← Quay về trang chủ
            </Link>
          </div>
        ) : null}

        {/* Loading Spinner */}
        {categoryLoading && (
          <div className="flex justify-center py-10">
            <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-lg">
              <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm text-gray-600 font-medium">Đang tải thêm khóa học...</span>
            </div>
          </div>
        )}

        {/* End of list */}
        {!hasMore && categoryCourses.length > 0 && !categoryLoading && (
          <div className="text-center py-10">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2.5 rounded-full text-sm font-medium">
              ✅ Đã hiển thị tất cả {totalCount} khóa học
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
