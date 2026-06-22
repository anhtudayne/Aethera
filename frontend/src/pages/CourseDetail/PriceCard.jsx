import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import PriceBadge from '../../components/course/PriceBadge';
import FavoriteButton from '../../components/course/FavoriteButton';
import { courseApi } from '../../api/courseApi';
import axiosClient from '../../api/axiosClient';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { ROUTES } from '../../utils/constants';

const PriceCard = ({ course, onOpenPreview }) => {
  const { id, price, discountedPrice, coverImageUrl, slug } = course || {};
  const { isAuthenticated } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  const [enrolled, setEnrolled] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!slug) return;
      try {
        // Check if user has enrolled/purchased
        if (isAuthenticated) {
          const enrollRes = await courseApi.checkEnrollment(slug);
          const isEnrolled = typeof enrollRes === 'boolean' ? enrollRes : (enrollRes?.enrolled ?? enrollRes?.data?.enrolled ?? false);
          setEnrolled(isEnrolled);

          // If not enrolled, check if it's already in their cart
          if (!isEnrolled) {
            const cartRes = await axiosClient.get('/cart');
            const cartItems = cartRes?.items || cartRes?.data?.items || cartRes || [];
            const found = Array.isArray(cartItems) && cartItems.some(item => (
              item.courseId === id || 
              item.course?.id === id || 
              item.id === id
            ));
            setIsInCart(found);
          }
        }
      } catch {
        // Silent error
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, [slug, id, isAuthenticated]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Save current page path in redirect query
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setActionLoading(true);
    try {
      await axiosClient.post('/cart', { courseId: id });
      setIsInCart(true);
      refreshCart();
      toast.success('Course added to cart successfully');
    } catch (err) {
      toast.error(err?.message || 'Failed to add course to cart');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setActionLoading(true);
    try {
      if (!isInCart) {
        try {
          await axiosClient.post('/cart', { courseId: id });
          setIsInCart(true);
          refreshCart();
        } catch (postErr) {
          const errMsg = postErr?.message || postErr?.response?.data?.message || '';
          const isAlreadyInCart = errMsg.includes('có trong giỏ hàng') || errMsg.includes('already in cart');
          if (!isAlreadyInCart) {
            throw postErr;
          }
        }
      }
      navigate(ROUTES.CHECKOUT);
    } catch (err) {
      toast.error(err?.message || 'Failed to process checkout');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="course-detail-price-card">
      <div className="price-card-image-wrapper" onClick={onOpenPreview}>
        <img
          src={coverImageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60'}
          alt={course?.title}
          className="price-card-img"
        />
        <div className="price-card-play-overlay">
          <div className="play-button-ring">
            <Play size={24} fill="currentColor" />
          </div>
          <span className="preview-video-text">Preview this course</span>
        </div>
      </div>

      <div className="price-card-content">
        <div className="price-card-pricing">
          <PriceBadge price={price} discountedPrice={discountedPrice} />
        </div>

        {/* CTA Buttons */}
        <div className="price-card-actions">
          {loading ? (
            <div style={{ height: '48px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', animation: 'shimmer 1.5s infinite linear' }}></div>
          ) : enrolled ? (
            <Link to={`/learn/${slug}`} style={{ width: '100%', display: 'block' }}>
              <button className="price-card-btn btn-primary-style" style={{ width: '100%' }}>
                Continue Learning
              </button>
            </Link>
          ) : (
            <>
              {isInCart ? (
                <Link to={ROUTES.CART} style={{ width: '100%', display: 'block' }}>
                  <button className="price-card-btn btn-primary-style" style={{ width: '100%' }}>
                    Go to Cart
                  </button>
                </Link>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={actionLoading}
                  className="price-card-btn btn-primary-style"
                  style={{ width: '100%' }}
                >
                  Add to Cart
                </button>
              )}

              <button
                onClick={handleBuyNow}
                disabled={actionLoading}
                className="price-card-btn btn-secondary-style"
                style={{ width: '100%' }}
              >
                Buy Now
              </button>
            </>
          )}

          {!enrolled && (
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <FavoriteButton courseId={id} size={18} />
              <button 
                onClick={onOpenPreview}
                className="price-card-btn btn-ghost-style"
                style={{ flexGrow: 1 }}
              >
                Free Preview
              </button>
            </div>
          )}
        </div>

        {/* Guarantee details */}
        <div className="price-card-guarantees">
          <div className="guarantee-item">
            <ShieldCheck size={16} className="outcome-icon" />
            <span>Full lifetime access to video materials</span>
          </div>
          <div className="guarantee-item">
            <ShieldCheck size={16} className="outcome-icon" />
            <span>Interactive workspace note-taking</span>
          </div>
          <div className="guarantee-item">
            <ShieldCheck size={16} className="outcome-icon" />
            <span>Premium downloadable certificate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
