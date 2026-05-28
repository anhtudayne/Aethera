import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeatured, fetchNewArrivals, fetchBestSellers, fetchCategories, fetchTopViewed } from '../store/slices/courseSlice';
import { getViewedCoursesService } from '../services/viewedService';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import CategoryCard from '../components/CategoryCard';
import CourseSection from '../components/CourseSection';
import Carousel from '../components/Carousel';
import CourseCard from '../components/CourseCard';
import Footer from '../components/Footer';

export default function HomePage() {
  const dispatch = useDispatch();
  const { featuredCourses, newArrivals, bestSellers, topViewed, categories, loading } = useSelector((state) => state.course);
  const [viewedCourses, setViewedCourses] = useState([]);
 
  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchNewArrivals());
    dispatch(fetchBestSellers());
    dispatch(fetchTopViewed());
    dispatch(fetchCategories());

    const fetchViewed = async () => {
      try {
        const response = await getViewedCoursesService();
        setViewedCourses(response.data.data || []);
      } catch (e) {
        console.error('Error fetching viewed courses:', e);
      }
    };
    fetchViewed();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroBanner />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
              📂 Danh mục khóa học
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sale / Featured */}
      <div className="bg-gradient-to-b from-red-50/50 to-gray-50">
        <CourseSection
          title="Khuyến mãi hot"
          emoji="🔥"
          courses={featuredCourses.filter((c) => c.salePrice && c.salePrice < c.price)}
          linkTo="/courses?sort=price_asc"
          linkText="Xem tất cả khuyến mãi"
        />
      </div>

      {/* New Arrivals */}
      <CourseSection
        title="Khóa học mới nhất"
        emoji="✨"
        courses={newArrivals}
        linkTo="/courses?sort=newest"
        linkText="Xem tất cả khóa học mới"
      />

      {/* Top Viewed Courses */}
      <div className="bg-gradient-to-b from-blue-50/50 to-gray-50">
        <Carousel
          title="Top 10 Khóa học xem nhiều nhất"
          emoji="👀"
          items={topViewed}
          renderItem={(course) => <CourseCard course={course} />}
        />
      </div>

      {/* Best Sellers */}
      <div className="bg-gradient-to-b from-amber-50/50 to-gray-50">
        <CourseSection
          title="Bán chạy nhất"
          emoji="🏆"
          courses={bestSellers}
          linkTo="/courses?sort=best_seller"
          linkText="Xem tất cả bán chạy"
        />
      </div>
 
      {/* Recently Viewed Courses */}
      {viewedCourses.length > 0 && (
        <div className="bg-gradient-to-b from-gray-50 to-white py-4">
          <CourseSection
            title="Khóa học đã xem gần đây"
            emoji="⏳"
            courses={viewedCourses}
          />
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl flex items-center gap-3">
            <div className="spinner" />
            <span className="text-sm text-gray-600">Đang tải...</span>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
