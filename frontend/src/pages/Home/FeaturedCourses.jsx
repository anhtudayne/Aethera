import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
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
    <section className="home-section bg-white">
      <div className="container">
        <div className="section-header-col">
          <div className="section-badge">
            <Sparkles size={16} />
            <span>Highlights</span>
          </div>
          <h2 className="section-title" style={{ marginBottom: '32px' }}>
            Featured Programs
          </h2>
        </div>

        {loading ? (
          <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ flex: '0 0 280px' }}>
                <CourseCardSkeleton />
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <CourseCarousel courses={courses} />
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', color: 'var(--color-text-muted)' }}>
            No featured courses found.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;
