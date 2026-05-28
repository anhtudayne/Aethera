import { useState, useEffect } from 'react';
import { getMyLoyaltyPoints } from '../services/rewardService';
import { getMyReviews } from '../services/reviewService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MyRewardsPage() {
    const [activeTab, setActiveTab] = useState('points');
    const [pointsData, setPointsData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [pointsRes, reviewsRes] = await Promise.all([
                    getMyLoyaltyPoints(),
                    getMyReviews(),
                ]);
                setPointsData(pointsRes.data);
                setReviews(reviewsRes.data);
            } catch (error) {
                console.error('Error fetching rewards:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Phần thưởng của tôi</h1>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            {/* Total Points */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="material-symbols-outlined text-2xl opacity-80">stars</span>
                                    <span className="text-sm font-medium opacity-80">Điểm tích lũy</span>
                                </div>
                                <div className="text-3xl font-extrabold mb-1">
                                    {pointsData?.totalPoints || 0}
                                </div>
                                <div className="text-sm opacity-75">
                                    điểm
                                </div>
                            </div>

                            {/* Equivalent VND */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="material-symbols-outlined text-2xl text-green-500">payments</span>
                                    <span className="text-sm font-medium text-gray-500">Giá trị quy đổi</span>
                                </div>
                                <div className="text-3xl font-extrabold text-gray-900 mb-1">
                                    {formatCurrency(pointsData?.equivalentVND || 0)}
                                </div>
                                <div className="text-sm text-gray-500">
                                    1 điểm = {formatCurrency(pointsData?.pointToVND || 1000)}
                                </div>
                            </div>

                            {/* Total Reviews */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="material-symbols-outlined text-2xl text-yellow-500">rate_review</span>
                                    <span className="text-sm font-medium text-gray-500">Đánh giá đã viết</span>
                                </div>
                                <div className="text-3xl font-extrabold text-gray-900 mb-1">
                                    {reviews.length}
                                </div>
                                <div className="text-sm text-gray-500">
                                    đánh giá
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 mb-6">
                            <button
                                onClick={() => setActiveTab('points')}
                                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'points'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">history</span>
                                    Lịch sử điểm
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'reviews'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">reviews</span>
                                    Đánh giá của tôi
                                </span>
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'points' ? (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                {pointsData?.history?.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">savings</span>
                                        <p>Chưa có giao dịch điểm nào.</p>
                                        <p className="text-sm mt-1">Hãy đánh giá khóa học để nhận điểm thưởng!</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {pointsData?.history?.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                        item.type === 'earn' 
                                                            ? 'bg-green-100' 
                                                            : 'bg-red-100'
                                                    }`}>
                                                        <span className={`material-symbols-outlined text-lg ${
                                                            item.type === 'earn'
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                        }`}>
                                                            {item.type === 'earn' ? 'add_circle' : 'remove_circle'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">{item.description}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(item.createdAt)}</p>
                                                    </div>
                                                </div>
                                                <div className={`font-bold text-lg ${
                                                    item.type === 'earn' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {item.type === 'earn' ? '+' : ''}{item.points}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.length === 0 ? (
                                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">rate_review</span>
                                        <p>Bạn chưa viết đánh giá nào.</p>
                                        <p className="text-sm mt-1">Mua và đánh giá khóa học để nhận điểm thưởng!</p>
                                    </div>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                            <div className="flex items-start gap-4">
                                                {review.course?.thumbnail && (
                                                    <img 
                                                        src={review.course.thumbnail.startsWith('http') ? review.course.thumbnail : `http://localhost:8089${review.course.thumbnail}`}
                                                        alt={review.course.name}
                                                        className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 mb-1">{review.course?.name}</h3>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="flex items-center gap-0.5">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <span 
                                                                    key={star} 
                                                                    className={`material-symbols-outlined text-sm ${
                                                                        review.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                                                                    }`}
                                                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                                                >
                                                                    star
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                                                    </div>
                                                    {review.comment && (
                                                        <p className="text-gray-600 text-sm">{review.comment}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
