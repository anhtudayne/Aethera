import { useState, useEffect, useCallback } from 'react';
import { getCourseReviews, checkCanReview, createReview } from '../services/reviewService';

function StarRating({ rating, onRate, interactive = false, size = 'text-xl' }) {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    className={`${size} transition-all duration-150 ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                    onMouseEnter={() => interactive && setHoverRating(star)}
                    onMouseLeave={() => interactive && setHoverRating(0)}
                    onClick={() => interactive && onRate && onRate(star)}
                >
                    <span className={`material-symbols-outlined ${
                        (hoverRating || rating) >= star 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                    }`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                    </span>
                </button>
            ))}
        </div>
    );
}

function RatingBar({ star, count, total }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="w-8 text-right text-gray-600 font-medium">{star}★</span>
            <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="w-8 text-gray-500">{count}</span>
        </div>
    );
}

export default function ReviewSection({ courseId }) {
    const [reviews, setReviews] = useState([]);
    const [pagination, setPagination] = useState({});
    const [ratingDistribution, setRatingDistribution] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    const [loading, setLoading] = useState(true);
    const [canReview, setCanReview] = useState(false);
    const [reviewReason, setReviewReason] = useState('');

    // Form state
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(null);

    const fetchReviews = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const response = await getCourseReviews(courseId, page);
            setReviews(response.data.reviews);
            setPagination(response.data.pagination);
            setRatingDistribution(response.data.ratingDistribution);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    const fetchCanReview = useCallback(async () => {
        try {
            const response = await checkCanReview(courseId);
            setCanReview(response.data.canReview);
            setReviewReason(response.data.reason || '');
        } catch (error) {
            console.error('Error checking can review:', error);
        }
    }, [courseId]);

    useEffect(() => {
        if (courseId) {
            fetchReviews();
            fetchCanReview();
        }
    }, [courseId, fetchReviews, fetchCanReview]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setSubmitError('Vui lòng chọn số sao đánh giá.');
            return;
        }

        setSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(null);

        try {
            const response = await createReview({ courseId, rating, comment });
            setSubmitSuccess(response.data);
            setCanReview(false);
            setRating(0);
            setComment('');
            // Refresh reviews
            fetchReviews();
        } catch (error) {
            setSubmitError(error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá.');
        } finally {
            setSubmitting(false);
        }
    };

    const totalReviews = Object.values(ratingDistribution).reduce((sum, c) => sum + c, 0);
    const avgRating = totalReviews > 0 
        ? Object.entries(ratingDistribution).reduce((sum, [star, count]) => sum + (star * count), 0) / totalReviews
        : 0;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá từ học viên</h2>

            {/* Rating Summary */}
            <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-100">
                {/* Overall Rating */}
                <div className="flex flex-col items-center justify-center min-w-[160px]">
                    <div className="text-5xl font-extrabold text-gray-900 mb-1">
                        {avgRating.toFixed(1)}
                    </div>
                    <StarRating rating={Math.round(avgRating)} size="text-lg" />
                    <div className="text-sm text-gray-500 mt-1">
                        {totalReviews} đánh giá
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <RatingBar 
                            key={star} 
                            star={star} 
                            count={ratingDistribution[star]} 
                            total={totalReviews} 
                        />
                    ))}
                </div>
            </div>

            {/* Submit Success Message */}
            {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🎉</span>
                        <div>
                            <p className="font-semibold text-green-800">Cảm ơn bạn đã đánh giá!</p>
                            <p className="text-green-700 text-sm mt-1">
                                Bạn đã nhận được <span className="font-bold">{submitSuccess.pointsEarned} điểm</span> tích lũy 
                                (tương đương <span className="font-bold">{(submitSuccess.pointsEarned * 1000).toLocaleString('vi-VN')}đ</span>).
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Form */}
            {canReview && (
                <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4">Viết đánh giá của bạn</h3>
                    
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-2">Đánh giá sao *</label>
                        <StarRating rating={rating} onRate={setRating} interactive size="text-3xl" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-2">Bình luận</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm học tập của bạn..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all"
                        />
                    </div>

                    {submitError && (
                        <p className="text-sm text-red-500 mb-3">{submitError}</p>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={submitting || rating === 0}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {submitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                                    Đang gửi...
                                </span>
                            ) : 'Gửi đánh giá'}
                        </button>
                        <span className="text-xs text-gray-500">
                            🎁 Nhận 10 điểm tích lũy khi đánh giá
                        </span>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">rate_review</span>
                    <p>Chưa có đánh giá nào cho khóa học này.</p>
                    {!canReview && reviewReason && (
                        <p className="text-sm mt-1">{reviewReason}</p>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="flex gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {review.user?.image ? (
                                    <img 
                                        src={review.user.image.startsWith('http') ? review.user.image : `http://localhost:8089${review.user.image}`}
                                        alt={`${review.user.firstName} ${review.user.lastName}`}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <span className="text-indigo-600 font-semibold text-sm">
                                            {review.user?.firstName?.charAt(0) || '?'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-medium text-gray-900">
                                        {review.user?.lastName} {review.user?.firstName}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {formatDate(review.createdAt)}
                                    </span>
                                </div>
                                <StarRating rating={review.rating} size="text-sm" />
                                {review.comment && (
                                    <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                                        {review.comment}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center gap-2 pt-4">
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => fetchReviews(page)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        page === pagination.currentPage
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
