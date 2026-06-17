import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseApi } from '../../api/courseApi';
import { extractArray } from '../../utils/helpers';
import FilterSidebar from './FilterSidebar';
import SortDropdown from './SortDropdown';
import Pagination from './Pagination';
import CourseCard from '../../components/course/CourseCard/CourseCard';
import CourseCardSkeleton from '../../components/course/CourseCardSkeleton';
import './CourseListingPage.css';

const CourseListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const urlSearch = searchParams.get('search') || '';
  const [searchVal, setSearchVal] = useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);

  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchVal(urlSearch);
  }

  // Debounced search mechanism (300ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const currentParam = searchParams.get('search') || '';
      if (searchVal.trim() !== currentParam) {
        const params = new URLSearchParams(searchParams);
        if (searchVal.trim()) {
          params.set('search', searchVal.trim());
        } else {
          params.delete('search');
        }
        params.set('page', '1'); // Reset to page 1 on new search query
        setSearchParams(params);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchVal, searchParams, setSearchParams]);

  // Synchronize params & fetch courses
  useEffect(() => {
    const fetchFilteredCourses = async () => {
      setLoading(true);
      try {
        const page = searchParams.get('page') || '1';
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        const level = searchParams.get('level') || '';
        const maxPrice = searchParams.get('maxPrice') || '';
        const sort = searchParams.get('sort') || 'newest';

        const params = {
          page,
          limit: 9, // 9 courses per page (3x3 grid)
          search,
          categories: category,
          levels: level,
          max_price: maxPrice,
          sort,
        };

        const res = await courseApi.getAll(params);
        
        // Handle varying response envelopes
        const courseData = extractArray(res);
        const pages = res?.pagination?.totalPages || res?.data?.pagination?.totalPages || res?.totalPages || res?.data?.totalPages || 1;
        const total = res?.pagination?.totalItems || res?.data?.pagination?.totalItems || res?.totalCount || res?.data?.totalCount || courseData.length;

        setCourses(courseData);
        setTotalPages(pages);
        setTotalCount(total);
      } catch (err) {
        console.error('Failed to load courses on listing page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredCourses();
  }, [searchParams]);

  const searchKeyword = searchParams.get('search');

  return (
    <div className="container listing-page-container">
      {/* Title / Search Term Display */}
      <div className="listing-header">
        <div>
          <h2 className="listing-page-title">
            {searchKeyword ? `Search Results for "${searchKeyword}"` : 'All Courses'}
          </h2>
          <p className="listing-subtitle">{totalCount} available programs</p>
        </div>
        <div className="listing-header-actions">
          <div className="listing-search-wrapper">
            <input
              type="text"
              placeholder="Search for courses..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="listing-search-input"
            />
          </div>
          <SortDropdown />
        </div>
      </div>

      <div className="listing-body-grid">
        {/* Left column: Filters */}
        <div className="listing-filter-col">
          <FilterSidebar />
        </div>

        {/* Right column: Grid list */}
        <div className="listing-courses-col">
          {loading ? (
            <div className="listing-course-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <>
              <div className="listing-course-grid">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              <Pagination totalPages={totalPages} />
            </>
          ) : (
            <div className="no-courses-placeholder">
              <div className="placeholder-details">
                <span className="placeholder-icon">🔍</span>
                <h3>No courses found</h3>
                <p>Try modifying your filter settings or checking other categories.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseListingPage;
