import { formatPrice } from '../../utils/helpers';

const OrderReviewItem = ({ item }) => {
  const { course } = item || {};
  const { name, price, salePrice, instructor, thumbnail } = course || {};

  const hasDiscount = salePrice !== undefined && salePrice !== null && salePrice < price;
  const displayPrice = hasDiscount ? salePrice : price;

  return (
    <div className="order-review-item">
      <img
        src={thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=60'}
        alt={name}
        className="review-item-thumbnail"
      />
      
      <div className="review-item-details">
        <h5 className="review-item-name">{name}</h5>
        <span className="review-item-instructor">By {instructor || 'Aethera Instructor'}</span>
      </div>

      <div className="review-item-pricing">
        <span className="review-item-price">{formatPrice(displayPrice)}</span>
      </div>
    </div>
  );
};

export default OrderReviewItem;
