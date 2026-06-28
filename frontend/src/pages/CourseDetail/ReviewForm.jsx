import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { reviewApi } from '../../api/reviewApi';
import { toast } from 'sonner';

const ReviewForm = ({ courseId, onReviewSuccess, initialReview = null, onCancelEdit = null }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating || 0);
      setComment(initialReview.comment || '');
    }
  }, [initialReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select the number of rating stars');
      return;
    }

    setSubmitting(true);
    try {
      if (initialReview && initialReview.id) {
        await reviewApi.update(initialReview.id, { rating, comment });
        toast.success('Review update successful!');
      } else {
        await reviewApi.create({ courseId, rating, comment });
        toast.success('Successful review submission!');
      }
      onReviewSuccess(); 
    } catch (error) {
      toast.error(error?.response?.data?.message || 'An error occurred while saving the review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form-container" style={{ 
      padding: '24px', 
      backgroundColor: 'var(--color-bg-secondary)', 
      borderRadius: 'var(--radius-lg)', 
      marginTop: '24px', 
      marginBottom: '24px' 
    }}>
      <h4 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>
        {initialReview ? 'Edit your review' : 'What do you think about this course?'}
      </h4>
      
      <form onSubmit={handleSubmit}>
        {/* Star Selection */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={28}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              fill={(hoverRating || rating) >= star ? '#F59E0B' : 'transparent'}
              color={(hoverRating || rating) >= star ? '#F59E0B' : '#CBD5E1'}
            />
          ))}
          <span style={{ marginLeft: '8px', color: 'var(--color-text-muted)', lineHeight: '28px' }}>
            {rating > 0 ? `${rating} stars` : 'Select number of stars'}
          </span>
        </div>

        {/* Comment Textarea */}
        <div style={{ marginBottom: '16px' }}>
          <textarea
            placeholder="Share your experience about this course (optional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={submitting}
            rows={3}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="submit" 
            disabled={submitting || rating === 0}
            className="btn-primary-style"
            style={{ flex: 1 }}
          >
            {submitting ? 'Saving...' : (initialReview ? 'Update' : 'Submit review')}
          </button>
          
          {initialReview && onCancelEdit && (
            <button 
              type="button" 
              onClick={onCancelEdit}
              className="btn-secondary-style"
              disabled={submitting}
              style={{ flex: 1 }}
            >
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
