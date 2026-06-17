import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { courseApi } from '../../api/courseApi';
import { extractArray } from '../../utils/helpers';
import CourseCard from '../../components/course/CourseCard/CourseCard';
import CourseCardSkeleton from '../../components/course/CourseCardSkeleton';
import Pagination from '../Courses/Pagination';
import { ROUTES } from '../../utils/constants';
import './CategoryPage.css';

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Read current page from URL params
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    const fetchCategoryCourses = async () => {
      setLoading(true);
      try {
        const res = await courseApi.getByCategory(slug, { page, limit: 9 });
        
        // Handle varying response envelopes
        const courseList = extractArray(res);
        const name = res?.categoryName || res?.data?.categoryName || slug.replace(/-/g, ' ');
        const total = res?.pagination?.totalItems || res?.data?.pagination?.totalItems || res?.totalCount || res?.data?.totalCount || courseList.length;
        const pages = res?.pagination?.totalPages || res?.data?.pagination?.totalPages || res?.totalPages || res?.data?.totalPages || 1;

        setCourses(courseList);
        setCategoryName(name);
        setTotalCount(total);
        setTotalPages(pages);
      } catch (err) {
        console.error('Failed to load category courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryCourses();
  }, [slug, page]);

  return (
    <div className="container category-page-container">
      {/* Breadcrumbs */}
      <nav className="category-breadcrumbs">
        <Link to={ROUTES.HOME}>Home</Link>
        <ChevronRight size={14} />
        <Link to={ROUTES.COURSES}>Courses</Link>
        <ChevronRight size={14} />
        <span className="current-crumb">{categoryName}</span>
      </nav>

      {/* Header banner */}
      <div className="category-header">
        <h1 className="category-title">{categoryName}</h1>
        <p className="category-subtitle">{totalCount} premium programs found</p>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="category-course-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <>
          <div className="category-course-grid">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <Pagination totalPages={totalPages} />
        </>
      ) : (
        <div className="category-empty-placeholder">
          <span>📚</span>
          <h3>No courses in this category</h3>
          <p>We are currently designing courses in this area. Check back later!</p>
          <Link to={ROUTES.COURSES} style={{ marginTop: '20px', display: 'inline-block' }}>
            <button className="category-back-btn">Explore All Courses</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
