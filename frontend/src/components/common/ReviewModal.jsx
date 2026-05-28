import { useState } from 'react';
import { createReview } from '../../services/reviewService';

function StarRating({ rating, onRate, interactive = false }) {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    className={`text-3xl transition-all duration-150 ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
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

export default function ReviewModal({ course, onClose, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Vui lòng chọn số sao đánh giá.');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const response = await createReview({
                courseId: course.id,
                rating,
                comment,
            });
            setSuccess(response.data);
            onSuccess && onSuccess(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* Modal */}
            <div 
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">Đánh giá khóa học</h3>
                        <button 
                            onClick={onClose}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {success ? (
                    /* Success State */
                    <div className="p-6 text-center">
                        <div className="text-5xl mb-4">🎉</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Cảm ơn bạn!</h3>
                        <p className="text-gray-600 mb-4">Đánh giá của bạn đã được ghi nhận.</p>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                            <p className="text-green-800 font-medium">
                                +{success.pointsEarned} điểm tích lũy
                            </p>
                            <p className="text-green-600 text-sm mt-1">
                                Tương đương {(success.pointsEarned * 1000).toLocaleString('vi-VN')}đ cho lần mua sau
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                ) : (
                    /* Review Form */
                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Course Info */}
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <img 
                                src={course.thumbnail?.startsWith('http') ? course.thumbnail : `http://localhost:8089${course.thumbnail}`}
                                alt={course.name}
                                className="w-16 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">{course.name}</h4>
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đánh giá của bạn *
                            </label>
                            <div className="flex justify-center">
                                <StarRating rating={rating} onRate={setRating} interactive />
                            </div>
                            {rating > 0 && (
                                <p className="text-center text-sm text-gray-500 mt-2">
                                    {['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'][rating]}
                                </p>
                            )}
                        </div>

                        {/* Comment */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bình luận
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Chia sẻ trải nghiệm học tập của bạn..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all text-sm"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 mb-4">{error}</p>
                        )}

                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                🎁 Nhận 10 điểm tích lũy
                            </span>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || rating === 0}
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm"
                                >
                                    {submitting ? (
                                        <span className="flex items-center gap-2">
                                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                                            Đang gửi...
                                        </span>
                                    ) : 'Gửi đánh giá'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
