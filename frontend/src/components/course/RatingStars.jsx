import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating = 0, size = 16 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25 && rating % 1 < 0.75;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star
          key={i}
          size={size}
          fill="var(--color-star)"
          color="var(--color-star)"
        />
      );
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(
        <StarHalf
          key={i}
          size={size}
          fill="var(--color-star)"
          color="var(--color-star)"
        />
      );
    } else {
      stars.push(
        <Star
          key={i}
          size={size}
          color="var(--color-border)"
          fill="transparent"
        />
      );
    }
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {stars}
    </div>
  );
};

export default RatingStars;
