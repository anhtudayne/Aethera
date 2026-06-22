import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { reviewApi } from '../../api/reviewApi';
import RatingStars from '../../components/course/RatingStars';
import { formatDate, getInitials } from '../../utils/helpers';
import ReviewForm from './ReviewForm';
import useAuth from '../../hooks/useAuth';

const ReviewsList = ({ courseId, averageRating = 0, reviewsCount = 0, isEnrolled }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [distribution, setDistribution] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  
  // Can review states
  const [canReview, setCanReview] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    const fetchCanReview = async () => {
      if (!isEnrolled || !courseId) return;
      try {
        const res = await reviewApi.checkCanReview(courseId);
        const canReviewStatus = res?.data?.canReview ?? res?.canReview;
        setCanReview(canReviewStatus);
      } catch (err) {
        console.error('Failed to check can review status:', err);
      }
    };
    fetchCanReview();
  }, [courseId, isEnrolled, refreshTrigger]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!courseId) return;
      setLoading(true);
      try {
        const res = await reviewApi.getByCourseId(courseId, { page, limit: 5 });
        const list = res?.data?.reviews || res?.reviews || [];
        const pages = res?.data?.pagination?.totalPages || res?.pagination?.totalPages || res?.totalPages || 1;
        setReviews(Array.isArray(list) ? list : []);
        setTotalPages(pages);

        // Fetch actual rating distribution from backend
        const dist = res?.data?.ratingDistribution || res?.ratingDistribution;
        if (dist) {
          // Normalize string keys or format
          const formattedDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          Object.keys(dist).forEach(key => {
            formattedDist[key] = parseInt(dist[key], 10) || 0;
          });
          setDistribution(formattedDist);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [courseId, page, refreshTrigger]);

  if (!courseId) return null;

  // Calculate dynamic percentages based on actual distribution
  const totalReviewsInDist = Object.values(distribution).reduce((acc, val) => acc + val, 0);
  const displayTotalReviews = totalReviewsInDist > 0 ? totalReviewsInDist : reviewsCount;
  
  // Dynamically calculate the average rating from the distribution
  const sumOfRatings = 
    (distribution[5] * 5) + 
    (distribution[4] * 4) + 
    (distribution[3] * 3) + 
    (distribution[2] * 2) + 
    (distribution[1] * 1);
  const dynamicAverageRating = totalReviewsInDist > 0 ? sumOfRatings / totalReviewsInDist : 0;

  return (
    <div className="reviews-section-wrapper">
      <h3 className="detail-section-title">
        Student Reviews ({displayTotalReviews})
      </h3>

      {/* Ratings Summary Card */}
      <div className="reviews-summary-card">
        <div className="rating-average-box">
          <span className="rating-average-num">
            {Number(dynamicAverageRating).toFixed(1)}
          </span>
          <div style={{ margin: '8px 0 4px 0' }}>
            <RatingStars rating={dynamicAverageRating} size={16} />
          </div>
          <span className="rating-average-label">
            Course Rating
          </span>
        </div>

        {/* Dynamic breakdown bar for star rating classification */}
        <div className="reviews-distribution-list">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars] || 0;
            const percentage = displayTotalReviews > 0 ? Math.round((count / displayTotalReviews) * 100) : 0;
            
            return (
              <div key={stars} className="distribution-row">
                <span className="dist-stars-label">{stars} stars</span>
                <div className="dist-bar-track">
                  <div className="dist-bar-fill" style={{ width: `${percentage}%` }} />
                </div>
                <span className="dist-percent-value">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Form for Enrolled Users */}
      {isEnrolled && canReview && !editingReview && (
        <ReviewForm 
          courseId={courseId} 
          onReviewSuccess={() => {
            setRefreshTrigger(prev => prev + 1);
            setCanReview(false);
          }} 
        />
      )}

      {/* Edit Review Form */}
      {editingReview && (
        <ReviewForm 
          courseId={courseId} 
          initialReview={editingReview}
          onReviewSuccess={() => {
            setRefreshTrigger(prev => prev + 1);
            setEditingReview(null);
          }} 
          onCancelEdit={() => setEditingReview(null)}
        />
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="reviews-list-container">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="review-item-card">
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(90deg, #F1F5F9 25%, #F8FAFC 50%, #F1F5F9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite linear' }} />
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ width: '120px', height: '14px', background: 'linear-gradient(90deg, #F1F5F9 25%, #F8FAFC 50%, #F1F5F9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite linear', borderRadius: 'var(--radius-xs)' }} />
                <div style={{ width: '80%', height: '12px', background: 'linear-gradient(90deg, #F1F5F9 25%, #F8FAFC 50%, #F1F5F9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite linear', borderRadius: 'var(--radius-xs)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="reviews-list-container">
          {reviews.map((rev) => {
            const userName = rev.userName || rev.user?.fullName || (rev.user?.firstName ? `${rev.user.firstName} ${rev.user.lastName || ''}` : 'Aethera Student');
            const userAvatar = rev.userAvatar || rev.user?.image;
            
            return (
              <div key={rev.id} className="review-item-card">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={userName} 
                    className="review-avatar-img" 
                  />
                ) : (
                  <div className="review-avatar-placeholder">
                    {getInitials(userName)}
                  </div>
                )}

                <div className="review-main-content">
                  <div className="review-user-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 className="review-username-text">
                        {userName}
                      </h4>
                      <span className="review-date-text">
                        {formatDate(rev.createdAt)}
                      </span>
                    </div>
                    {user && user.id === rev.userId && !editingReview && (
                      <button 
                        onClick={() => setEditingReview(rev)}
                        style={{ fontSize: '0.85rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Sửa đánh giá
                      </button>
                    )}
                  </div>

                  <div className="review-rating-stars">
                    <RatingStars rating={rev.rating} size={14} />
                  </div>

                  <p className="review-comment-body">
                    {rev.comment}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Reviews Pagination controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="pagination-nav-btn"
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontSize: '0.9rem', alignSelf: 'center', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="pagination-nav-btn"
                aria-label="Next page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ReviewsList;
