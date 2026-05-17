import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import SkeletonCourseCard from '../components/SkeletonCourseCard';
import { getCoursesService, getCategoriesService } from '../services/courseService';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'best_seller', label: 'Bán chạy nhất' },
  { value: 'rating_desc', label: 'Đánh giá cao nhất' },
  { value: 'price_asc', label: 'Giá thấp đến cao' },
  { value: 'price_desc', label: 'Giá cao đến thấp' },
];

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  // Local state for debounced inputs
  const [localPrices, setLocalPrices] = useState({
    min: searchParams.get('min_price') || '',
    max: searchParams.get('max_price') || ''
  });

  const topRef = useRef(null);

  // Fetch Categories
  useEffect(() => {
    getCategoriesService().then(res => {
      if (res.data?.data) setCategories(res.data.data);
    }).catch(err => console.error(err));
  }, []);

  // Sync Local Prices to URL with Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentMin = searchParams.get('min_price') || '';
      const currentMax = searchParams.get('max_price') || '';
      
      if (localPrices.min !== currentMin || localPrices.max !== currentMax) {
        updateParams({ 
          min_price: localPrices.min, 
          max_price: localPrices.max, 
          page: 1 // Reset page when filter changes
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [localPrices.min, localPrices.max]);

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries(searchParams.entries());
        const res = await getCoursesService({
          ...params,
          limit: 12
        });
        if (res.data?.data) {
          setCourses(res.data.data);
          setPagination(res.data.pagination);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khóa học', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [searchParams]);

  const updateParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        updated.delete(key);
      } else {
        updated.set(key, value);
      }
    });
    setSearchParams(updated);
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCheckboxChange = (key, value) => {
    const currentValues = searchParams.get(key) ? searchParams.get(key).split(',') : [];
    let newValues;
    if (currentValues.includes(value.toString())) {
      newValues = currentValues.filter(v => v !== value.toString());
    } else {
      newValues = [...currentValues, value.toString()];
    }
    updateParams({ [key]: newValues.join(','), page: 1 });
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setLocalPrices({ min: '', max: '' });
  };

  const activeCategories = searchParams.get('categories') ? searchParams.get('categories').split(',') : [];
  const activeLevels = searchParams.get('levels') ? searchParams.get('levels').split(',') : [];
  const currentSort = searchParams.get('sort') || 'newest';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" ref={topRef}>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        <FilterSidebar 
          categories={categories}
          activeCategories={activeCategories}
          activeLevels={activeLevels}
          localPrices={localPrices}
          setLocalPrices={setLocalPrices}
          handleCheckboxChange={handleCheckboxChange}
          clearAllFilters={clearAllFilters}
          hasActiveFilters={activeCategories.length > 0 || activeLevels.length > 0 || localPrices.min || localPrices.max || searchParams.get('search')}
        />

        {/* Main Content */}
        <div className="flex-grow flex flex-col min-w-0">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-800">
                {searchParams.get('search') ? `Kết quả cho "${searchParams.get('search')}"` : 'Tất cả khóa học'}
              </h1>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-gray-500 hidden sm:inline">Sắp xếp:</span>
              <select 
                className="w-full sm:w-48 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
                value={currentSort}
                onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>


          {/* Course Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCourseCard key={i} />)}
            </div>
          ) : courses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              <Pagination 
                pagination={pagination}
                handlePageChange={handlePageChange}
              />
            </>
          ) : (
            <EmptyState clearAllFilters={clearAllFilters} />
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
