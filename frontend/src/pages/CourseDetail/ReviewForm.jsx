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
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    setSubmitting(true);
    try {
      if (initialReview && initialReview.id) {
        await reviewApi.update(initialReview.id, { rating, comment });
        toast.success('Cập nhật đánh giá thành công!');
      } else {
        await reviewApi.create({ courseId, rating, comment });
        toast.success('Gửi đánh giá thành công!');
      }
      onReviewSuccess(); 
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi lưu đánh giá');
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
        {initialReview ? 'Chỉnh sửa đánh giá của bạn' : 'Bạn nghĩ sao về khóa học này?'}
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
            {rating > 0 ? `${rating} sao` : 'Chọn số sao'}
          </span>
        </div>

        {/* Comment Textarea */}
        <div style={{ marginBottom: '16px' }}>
          <textarea
            placeholder="Chia sẻ trải nghiệm của bạn về khóa học này (không bắt buộc)..."
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
            {submitting ? 'Đang lưu...' : (initialReview ? 'Cập nhật' : 'Gửi đánh giá')}
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
