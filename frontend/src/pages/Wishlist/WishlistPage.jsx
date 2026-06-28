import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, HeartOff } from 'lucide-react';
import { favoriteApi } from '../../api/favoriteApi';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import './WishlistPage.css';

const WishlistPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await favoriteApi.getMyFavorites({ page: 1, limit: 50 });
        if (!cancelled) setCourses(res.data?.courses || res.data || res.courses || []);
      } catch {
        if (!cancelled) setCourses([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleRemove = async (courseId) => {
    try {
      await favoriteApi.toggle(courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId && c.courseId !== courseId));
    } catch {
      // silent
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  return (
    <div className="wishlist-page">
      <h2>Favorites list ❤️</h2>

      {loading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <span>Loading...</span>
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Chưa có khóa học yêu thích"
          description="Click the ❤️ icon on courses to add to your favorites list."
        />
      ) : (
        <div className="wishlist-grid">
          {courses.map((item) => {
            const course = item.Course || item.course || item;
            return (
              <div key={item.id || course.id} className="wishlist-card">
                {course.thumbnail && (
                  <img src={course.thumbnail} alt={course.name} className="wishlist-card-image" />
                )}
                <div className="wishlist-card-body">
                  <Link to={`/courses/${course.slug || course.id}`}>
                    <div className="wishlist-card-title">{course.name}</div>
                  </Link>
                  <div className="wishlist-card-instructor">
                    {course.instructor || 'Lecturer'}
                  </div>
                  <div className="wishlist-card-price">{formatPrice(course.price)}</div>
                  <div className="wishlist-card-actions">
                    <button className="remove-wish-btn" onClick={() => handleRemove(course.id)}>
                      <HeartOff size={14} /> Unfavourite
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
