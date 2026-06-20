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
    isPremium = true, // mockup
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
    <div className="course-card group">
      {/* Thumbnail */}
      <div className="course-card-thumb-wrapper">
        <Link to={`/courses/${slug}`}>
          <img
            src={displayImage}
            alt={displayTitle}
            className="course-card-img group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>
        
        {/* Absolute elements */}
        <div className="course-card-heart opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FavoriteButton courseId={id} size={18} />
        </div>
      </div>

      {/* Info Section */}
      <div className="course-card-info">
        <h3 className="course-card-title line-clamp-2 min-h-[3rem] font-bold text-gray-900 leading-tight mb-1">
          <Link to={`/courses/${slug}`}>{displayTitle}</Link>
        </h3>
        
        <p className="course-card-author text-xs text-gray-500 mb-1 truncate">{displayAuthor}</p>

        {/* Rating */}
        <div className="course-card-rating-row flex items-center gap-1.5 mb-2">
          <span className="rating-score text-sm font-bold text-[#b4690e]">{Number(displayRating).toFixed(1)}</span>
          <RatingStars rating={displayRating} size={14} />
          <span className="rating-count text-xs text-gray-500">({displayReviewsCount.toLocaleString()})</span>
        </div>

        {/* Price & Details */}
        <div className="course-card-price-row mb-3">
          <PriceBadge price={displayPrice} discountedPrice={displayDiscounted} />
        </div>

        {/* Badges */}
        <div className="course-card-badges flex items-center gap-2 mt-auto">
          {isPremium && (
            <span className="badge-premium bg-[#eceb98] text-[#3d3c0a] font-bold text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wide">
              Premium
            </span>
          )}
          {isCourseBestseller && (
            <span className="badge-bestseller bg-[#eceb98] text-[#3d3c0a] font-bold text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wide">
              Bestseller
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
