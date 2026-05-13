import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';

export default function CourseSection({ title, emoji, courses, linkTo, linkText = 'Xem tất cả' }) {
  if (!courses || courses.length === 0) return null;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {emoji && <span className="mr-2">{emoji}</span>}
            {title}
          </h2>
          {linkTo && (
            <Link to={linkTo} className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
              {linkText} →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        {linkTo && (
          <div className="mt-6 text-center sm:hidden">
            <Link to={linkTo} className="text-sm font-semibold text-primary">{linkText} →</Link>
          </div>
        )}
      </div>
    </section>
  );
}
