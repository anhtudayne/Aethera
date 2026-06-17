import { Calendar, Users, Globe } from 'lucide-react';
import RatingStars from '../../components/course/RatingStars';
import { formatDate } from '../../utils/helpers';

const CourseHero = ({ course }) => {
  if (!course) return null;

  const {
    title,
    subtitle,
    averageRating = 0,
    reviewsCount = 0,
    totalStudents = 0,
    authorName = 'Instructor',
    updatedAt,
    level = 'All Levels'
  } = course;

  return (
    <div className="course-detail-hero">
      <div className="container">
        <span className="course-hero-badge">{level}</span>
        <h1 className="course-hero-title">{title}</h1>
        {subtitle && <p className="course-hero-subtitle">{subtitle}</p>}
        
        {/* Rating and Info */}
        <div className="course-hero-meta">
          <div className="meta-rating">
            <span className="rating-num">{Number(averageRating).toFixed(1)}</span>
            <RatingStars rating={averageRating} size={16} />
            <span className="reviews-num">({reviewsCount} ratings)</span>
          </div>

          <div className="meta-divider">|</div>

          <div className="meta-item">
            <Users size={16} />
            <span>{totalStudents.toLocaleString()} students enrolled</span>
          </div>

          <div className="meta-divider">|</div>

          <div className="meta-item">
            <span>Created by <strong style={{ color: 'var(--color-text-primary)' }}>{authorName}</strong></span>
          </div>
        </div>

        <div className="course-hero-submeta">
          <div className="meta-item">
            <Calendar size={16} />
            <span>Last updated {formatDate(updatedAt, 'MM/yyyy')}</span>
          </div>
          <div className="meta-item">
            <Globe size={16} />
            <span>English / Vietnamese</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHero;
