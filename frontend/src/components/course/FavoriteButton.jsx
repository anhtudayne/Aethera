import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { favoriteApi } from '../../api/favoriteApi';
import useAuth from '../../hooks/useAuth';

const FavoriteButton = ({ courseId, className = '', size = 20 }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!isAuthenticated || !courseId) return;
      try {
        const res = await favoriteApi.check(courseId);
        // Backend check endpoint might return boolean or object like { isFavorite: boolean }
        const status = typeof res === 'boolean' ? res : (res?.isFavorite ?? res?.data?.isFavorite ?? false);
        setIsFavorite(status);
      } catch {
        // Silent error
      }
    };
    checkStatus();
  }, [courseId, isAuthenticated]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // prevent clicking card underneath

    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await favoriteApi.toggle(courseId);
      const nextStatus = typeof res === 'boolean' ? res : (res?.isFavorite ?? res?.data?.isFavorite ?? !isFavorite);
      setIsFavorite(nextStatus);
      
      if (nextStatus) {
        toast.success('Added to wishlist');
      } else {
        toast.success('Removed from wishlist');
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid var(--color-border-light)',
        color: isFavorite ? 'var(--color-error)' : 'var(--color-text-muted)',
        boxShadow: 'var(--shadow-1)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
      className={`favorite-btn ${className}`}
      aria-label="Toggle Favorite"
    >
      <Heart
        size={size}
        fill={isFavorite ? 'var(--color-error)' : 'transparent'}
        style={{ transition: 'transform 0.2s ease' }}
      />
    </button>
  );
};

export default FavoriteButton;
