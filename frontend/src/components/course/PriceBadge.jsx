import { formatPrice } from '../../utils/helpers';

const PriceBadge = ({ price, discountedPrice }) => {
  const hasDiscount = discountedPrice !== undefined && discountedPrice !== null && discountedPrice < price;
  const isFree = discountedPrice === 0 || (discountedPrice === undefined && price === 0);

  if (isFree) {
    return (
      <span 
        style={{ 
          color: 'var(--color-success)', 
          fontWeight: 700, 
          fontSize: '1.05rem',
          fontFamily: 'var(--font-heading)'
        }}
      >
        Free
      </span>
    );
  }

  const activePrice = hasDiscount ? discountedPrice : price;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '8px' }}>
      <span 
        style={{ 
          color: 'var(--color-text-primary)', 
          fontWeight: 700, 
          fontSize: '1.05rem',
          fontFamily: 'var(--font-heading)'
        }}
      >
        {formatPrice(activePrice)}
      </span>
      {hasDiscount && (
        <span 
          style={{ 
            color: 'var(--color-text-muted)', 
            textDecoration: 'line-through', 
            fontSize: '0.85rem' 
          }}
        >
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
};

export default PriceBadge;
