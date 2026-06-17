import { useState, useEffect } from 'react';
import { courseApi } from '../../api/courseApi';
import { extractArray } from '../../utils/helpers';
import CourseCard from '../../components/course/CourseCard/CourseCard';
import CourseCardSkeleton from '../../components/course/CourseCardSkeleton';

const RelatedCourses = ({ courseId }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!courseId) return;
      try {
        const res = await courseApi.getRelated(courseId, 3);
        const data = extractArray(res);
        setCourses(data);
      } catch (err) {
        console.error('Failed to load related courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [courseId]);

  if (!courseId || (!loading && !courses.length)) return null;

  return (
    <div style={{ marginTop: '48px', borderTop: '1px solid var(--color-border)', paddingTop: '40px' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>
        Students also bought
      </h3>
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedCourses;
