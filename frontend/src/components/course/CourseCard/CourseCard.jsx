import { Link } from 'react-router-dom';
import RatingStars from '../RatingStars';
import PriceBadge from '../PriceBadge';
import FavoriteButton from '../FavoriteButton';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  if (!course) return null;

  const {
    id,
    name,
    title,
    slug,
    price,
    salePrice,
    discountedPrice,
    averageRating = 0,
    ratingCount = 0,
    reviewsCount = 0,
    thumbnail,
    coverImageUrl,
    instructor,
    authorName,
    totalStudents = 0,
    isBestSeller,
    isPremium = true,
  } = course;

  const displayTitle = name || title;
  const displayAuthor = instructor || authorName || 'Aethera Instructor';
  const displayImage = thumbnail || coverImageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60';
  const displayPrice = price;
  const displayDiscounted = salePrice || discountedPrice;
  const displayRating = averageRating || course.rating || 0;
  const displayReviewsCount = reviewsCount || ratingCount || 0;
  const isCourseBestseller = isBestSeller || totalStudents > 100;

  return (
    <div className="course-card">
      {/* Thumbnail */}
      <div className="course-card-thumb-wrapper">
        <Link to={`/courses/${slug}`}>
          <img
            src={displayImage}
            alt={displayTitle}
            className="course-card-img"
            loading="lazy"
          />
        </Link>
        <div className="course-card-heart">
          <FavoriteButton courseId={id} size={16} />
        </div>
      </div>

      {/* Info Section */}
      <div className="course-card-info">
        <h3 className="course-card-title">
          <Link to={`/courses/${slug}`}>{displayTitle}</Link>
        </h3>
        
        <p className="course-card-author">{displayAuthor}</p>

        {/* Rating */}
        <div className="course-card-rating-row">
          <span className="rating-score">{Number(displayRating).toFixed(1)}</span>
          <RatingStars rating={displayRating} size={12} />
          <span className="rating-count">({displayReviewsCount.toLocaleString()})</span>
        </div>

        {/* Price & Details */}
        <div className="course-card-price-row">
          <PriceBadge price={displayPrice} discountedPrice={displayDiscounted} />
        </div>

        {/* Badges */}
        {(isCourseBestseller || isPremium) && (
          <div className="course-card-badges">
            {isCourseBestseller && (
              <span className="badge-bestseller">Best seller</span>
            )}
            {isPremium && (
              <span className="badge-premium">Premium</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
