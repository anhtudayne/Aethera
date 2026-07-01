import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import RatingStars from '../RatingStars';
import PriceBadge from '../PriceBadge';
import FavoriteButton from '../FavoriteButton';
import useCart from '../../../hooks/useCart';
import useAuth from '../../../hooks/useAuth';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  // Define hooks at the top level
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPlacement, setPopoverPlacement] = useState('right');
  const [addingToCart, setAddingToCart] = useState(false);
  const cardRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const { items, addToCart } = useCart();
  const { isAuthenticated, enrolledCourseIds } = useAuth();
  const navigate = useNavigate();

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
    shortDescription,
    whatYouWillLearn,
    level,
    duration,
    updatedAt,
    createdAt,
  } = course;

  const displayTitle = name || title;
  const displayAuthor = instructor || authorName || 'Aethera Instructor';
  const displayImage = thumbnail || coverImageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60';
  const displayPrice = price;
  const displayDiscounted = salePrice || discountedPrice;
  const displayRating = averageRating || course.rating || 0;
  const displayReviewsCount = reviewsCount || ratingCount || 0;
  const isCourseBestseller = isBestSeller || totalStudents > 100;

  const isAlreadyInCart = items.some((item) => item.courseId === id);
  const isEnrolled = isAuthenticated && enrolledCourseIds && enrolledCourseIds.includes(id);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const spaceOnRight = window.innerWidth - rect.right;
        // If there's less than 340px space on the right, display on the left
        if (spaceOnRight < 340) {
          setPopoverPlacement('left');
        } else {
          setPopoverPlacement('right');
        }
        setShowPopover(true);
      }
    }, 400); // 400ms delay to prevent popping up on fast mouse moves
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setShowPopover(false);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isEnrolled) {
      navigate(`/learn/${slug}`);
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to add courses to your cart.');
      navigate('/login');
      return;
    }

    if (isAlreadyInCart) {
      navigate('/cart');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(id).unwrap();
      toast.success('Course added to cart successfully!');
    } catch (err) {
      toast.error(err?.message || 'Failed to add course to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  // Safe parse whatYouWillLearn JSON
  let learningPoints = [];
  try {
    if (whatYouWillLearn) {
      if (typeof whatYouWillLearn === 'string') {
        learningPoints = JSON.parse(whatYouWillLearn);
      } else if (Array.isArray(whatYouWillLearn)) {
        learningPoints = whatYouWillLearn;
      }
    }
  } catch (error) {
    console.error('Error parsing whatYouWillLearn:', error);
  }

  const updatedDate = new Date(updatedAt || createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const courseLinkPath = isEnrolled ? `/learn/${slug}` : `/courses/${slug}`;

  return (
    <div
      ref={cardRef}
      className="course-card-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="course-card">
        {/* Thumbnail */}
        <div className="course-card-thumb-wrapper">
          <Link to={courseLinkPath}>
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
            <Link to={courseLinkPath}>{displayTitle}</Link>
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

      {/* Hover popover */}
      {showPopover && (
        <div className={`course-popover popover-${popoverPlacement}`}>
          <div className="popover-inner">
            <h4 className="popover-title">{displayTitle}</h4>

            <div className="popover-badges-row">
              {isCourseBestseller && <span className="badge-bestseller text-[9px] py-0.5 px-1.5 font-bold uppercase tracking-wider rounded">Best seller</span>}
              {isPremium && <span className="badge-premium text-[9px] py-0.5 px-1.5 font-bold uppercase tracking-wider rounded">Premium</span>}
              <span className="popover-updated-date">Updated {updatedDate}</span>
            </div>

            <div className="popover-details-row">
              <span>{duration || '12h 30m'} total hours</span>
              <span className="popover-dot">•</span>
              <span>{level ? level.charAt(0).toUpperCase() + level.slice(1) : 'All Levels'}</span>
              <span className="popover-dot">•</span>
              <span>Subtitles</span>
            </div>

            {shortDescription && (
              <p className="popover-description-text">{shortDescription}</p>
            )}

            {learningPoints.length > 0 && (
              <div className="popover-learn-section">
                <span className="popover-section-label">What you'll learn:</span>
                <ul>
                  {learningPoints.slice(0, 3).map((point, index) => (
                    <li key={index}>
                      <Check className="check-icon" size={14} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="popover-actions">
              <button
                onClick={handleAddToCart}
                className={`popover-add-to-cart-btn ${isEnrolled ? 'enrolled' : isAlreadyInCart ? 'in-cart' : ''}`}
                disabled={addingToCart}
              >
                {isEnrolled ? 'Go to course' : isAlreadyInCart ? 'Go to cart' : addingToCart ? 'Adding...' : 'Add to cart'}
              </button>
              <div className="popover-heart-btn">
                <FavoriteButton courseId={id} size={18} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
