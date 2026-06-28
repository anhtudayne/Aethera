import { useState, useEffect } from 'react';
import { courseApi } from '../../api/courseApi';
import { extractArray } from '../../utils/helpers';
import CourseCarousel from '../../components/course/CourseCarousel';
import CourseCardSkeleton from '../../components/course/CourseCardSkeleton';

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await courseApi.getFeatured(8);
        const data = extractArray(res);
        setCourses(data);
      } catch (err) {
        console.error('Failed to load featured courses:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <section className="home-section bg-white pt-12 pb-2">
      <div className="container max-w-[1340px] mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-8">
          What to learn next
        </h1>
        
        <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">
          Trending courses
        </h2>

        {loading ? (
          <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ flex: '0 0 280px' }}>
                <CourseCardSkeleton />
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="mb-2">
            <CourseCarousel courses={courses} />
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', color: 'var(--color-text-muted)' }}>
            No trending courses found.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;
