import { formatPrice } from '../../utils/helpers';

const PriceBadge = ({ price, discountedPrice, className = '' }) => {
  const hasDiscount = discountedPrice !== undefined && discountedPrice !== null && discountedPrice < price;
  const isFree = discountedPrice === 0 || (discountedPrice === undefined && price === 0);

  if (isFree) {
    return (
      <span className={`price-free ${className}`}>
        Miễn phí
      </span>
    );
  }

  const activePrice = hasDiscount ? discountedPrice : price;

  return (
    <div className={`price-badge-wrapper ${className}`}>
      <span className="price-current">
        {formatPrice(activePrice)}
      </span>
      {hasDiscount && (
        <span className="price-original">
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
};

export default PriceBadge;
