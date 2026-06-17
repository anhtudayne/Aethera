import { Link } from 'react-router-dom';
import RatingStars from '../RatingStars';
import PriceBadge from '../PriceBadge';
import FavoriteButton from '../FavoriteButton';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  if (!course) return null;

  const {
    id,
    title,
    slug,
    price,
    discountedPrice,
    averageRating = 0,
    reviewsCount = 0,
    coverImageUrl,
    authorName = 'Aethera Instructor',
    level = 'All Levels',
    totalStudents = 0,
    isBestseller = totalStudents > 100, // sample bestseller logic
  } = course;

  return (
    <div className="course-card">
      {/* Thumbnail */}
      <div className="course-card-thumb-wrapper">
        <Link to={`/courses/${slug}`}>
          <img
            src={coverImageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60'}
            alt={title}
            className="course-card-img"
            loading="lazy"
          />
        </Link>
        
        {/* Absolute elements */}
        <div className="course-card-heart">
          <FavoriteButton courseId={id} size={16} />
        </div>

        {isBestseller && (
          <span className="course-card-badge bestseller-badge">Bestseller</span>
        )}
      </div>

      {/* Info Section */}
      <div className="course-card-info">
        <span className="course-card-level">{level}</span>
        
        <h3 className="course-card-title">
          <Link to={`/courses/${slug}`}>{title}</Link>
        </h3>
        
        <p className="course-card-author">By {authorName}</p>

        {/* Rating */}
        <div className="course-card-rating-row">
          <span className="rating-score">{Number(averageRating).toFixed(1)}</span>
          <RatingStars rating={averageRating} size={14} />
          <span className="rating-count">({reviewsCount})</span>
        </div>

        <hr className="course-card-divider" />

        {/* Price & Details */}
        <div className="course-card-footer">
          <PriceBadge price={price} discountedPrice={discountedPrice} />
          {totalStudents > 0 && (
            <span className="course-card-students">
              {totalStudents.toLocaleString()} students
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
