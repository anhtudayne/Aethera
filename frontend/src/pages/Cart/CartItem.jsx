import { Link } from 'react-router-dom';
import { Trash2, Star, BookOpen } from 'lucide-react';
import PriceBadge from '../../components/course/PriceBadge';

const CartItem = ({ item, onRemove, isSelected, onToggleSelect }) => {
  const { id, course } = item;
  const { name, slug, price, salePrice, instructor, thumbnail, rating, level, totalLessons } = course || {};

  // Map to format that PriceBadge expects
  const displayPrice = price ? Number(price) : 0;
  const displayDiscounted = salePrice ? Number(salePrice) : null;

  return (
    <div className={`cart-item-card-neo ${isSelected ? 'item-selected' : ''}`}>
      <div className="cart-item-checkbox-wrapper-neo">
        <input 
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="cart-checkbox-neo"
        />
      </div>

      <Link to={`/courses/${slug}`} className="cart-item-image-link-neo">
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=60'}
          alt={name}
          className="cart-item-thumbnail-neo"
        />
      </Link>

      <div className="cart-item-details-neo">
        <div className="cart-item-header-neo">
          <span className="cart-item-category-tag-neo">{level || 'All Levels'}</span>
          <button 
            className="cart-item-remove-btn-neo" 
            onClick={() => onRemove(id)}
            title="Remove from cart"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <Link to={`/courses/${slug}`} className="cart-item-title-link-neo">
          <h4 className="cart-item-title-neo">{name}</h4>
        </Link>

        <p className="cart-item-instructor-neo">By {instructor || 'Aethera Instructor'}</p>

        <div className="cart-item-meta-neo">
          {rating !== undefined && rating !== null && (
            <div className="cart-item-rating-neo">
              <Star size={13} className="star-icon-neo" fill="currentColor" />
              <span>{parseFloat(rating).toFixed(1)}</span>
            </div>
          )}
          
          {totalLessons > 0 && (
            <div className="cart-item-lessons-neo">
              <BookOpen size={13} className="lessons-icon-neo" />
              <span>{totalLessons} lessons</span>
            </div>
          )}
        </div>

        <div className="cart-item-pricing-neo">
          <PriceBadge price={displayPrice} discountedPrice={displayDiscounted} />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
