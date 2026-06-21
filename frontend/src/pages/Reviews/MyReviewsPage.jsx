import { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { reviewApi } from '../../api/reviewApi';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import './MyReviewsPage.css';

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await reviewApi.getMyReviews();
        setReviews(res.data || []);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={16} fill={i < rating ? '#F59E0B' : 'none'} className={i < rating ? 'star-filled' : 'star-empty'} />
    ));
  };

  return (
    <div className="reviews-page">
      <h2>Đánh giá của tôi ⭐</h2>

      {loading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <span>Đang tải...</span>
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Chưa có đánh giá nào"
          description="Hãy đánh giá các khóa học bạn đã hoàn thành để giúp người khác!"
        />
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-card-header">
                <div className="review-course-title">
                  {review.courseName || review.course?.name || 'Khóa học'}
                </div>
                <div className="review-rating">{renderStars(review.rating)}</div>
              </div>
              {review.comment && <p className="review-comment">{review.comment}</p>}
              <div className="review-date">
                {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;
