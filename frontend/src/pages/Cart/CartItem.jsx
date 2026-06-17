import { Link } from 'react-router-dom';
import { Trash2, Star, BookOpen } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

const CartItem = ({ item, onRemove }) => {
  const { id, course } = item;
  const { name, slug, price, salePrice, instructor, thumbnail, rating, level, totalLessons } = course || {};

  // Determine final price (salePrice or price)
  const hasDiscount = salePrice !== undefined && salePrice !== null && salePrice < price;

  return (
    <div className="cart-item-card">
      <Link to={`/courses/${slug}`} className="cart-item-image-link">
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=60'}
          alt={name}
          className="cart-item-thumbnail"
        />
      </Link>

      <div className="cart-item-details">
        <div className="cart-item-header">
          <span className="cart-item-category-tag">{level || 'All Levels'}</span>
          <button 
            className="cart-item-remove-btn" 
            onClick={() => onRemove(id)}
            title="Remove from cart"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <Link to={`/courses/${slug}`} className="cart-item-title-link">
          <h4 className="cart-item-title">{name}</h4>
        </Link>

        <p className="cart-item-instructor">By {instructor || 'Aethera Instructor'}</p>

        <div className="cart-item-meta">
          {rating !== undefined && rating !== null && (
            <div className="cart-item-rating">
              <Star size={14} className="star-icon" fill="currentColor" />
              <span>{parseFloat(rating).toFixed(1)}</span>
            </div>
          )}
          
          {totalLessons > 0 && (
            <div className="cart-item-lessons">
              <BookOpen size={14} className="lessons-icon" />
              <span>{totalLessons} lessons</span>
            </div>
          )}
        </div>

        <div className="cart-item-pricing">
          {hasDiscount ? (
            <>
              <span className="cart-item-sale-price">{formatPrice(salePrice)}</span>
              <span className="cart-item-original-price">{formatPrice(price)}</span>
            </>
          ) : (
            <span className="cart-item-price">{formatPrice(price)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
