import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, 
  Palette, 
  TrendingUp, 
  Volume2, 
  Camera, 
  Megaphone, 
  Brain,
  Layers,
  BookOpen
} from 'lucide-react';
import { categoryApi } from '../../api/categoryApi';
import { extractArray } from '../../utils/helpers';

const ICON_MAP = {
  'development': Code,
  'programming': Code,
  'it & software': Layers,
  'design': Palette,
  'business': TrendingUp,
  'marketing': Megaphone,
  'photography': Camera,
  'music': Volume2,
  'personal development': Brain,
};

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        const data = extractArray(res);
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const getCategoryIcon = (name = '') => {
    const key = name.toLowerCase();
    return ICON_MAP[key] || BookOpen;
  };

  return (
    <section className="home-section bg-light">
      <div className="container">
        <h2 className="section-title section-title-center">
          Browse Top Categories
        </h2>

        {loading ? (
          <div className="category-grid-container">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="category-item-card" style={{ height: '160px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(90deg, #F1F5F9 25%, #F8FAFC 50%, #F1F5F9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite linear' }} />
                <div style={{ width: '60%', height: '14px', background: 'linear-gradient(90deg, #F1F5F9 25%, #F8FAFC 50%, #F1F5F9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite linear', borderRadius: 'var(--radius-xs)' }} />
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="category-grid-container">
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.name);
              return (
                <Link
                  key={cat.id}
                  to={`/courses/category/${cat.slug}`}
                  className="category-item-card"
                >
                  <div className="category-card-icon-box">
                    <Icon size={26} />
                  </div>
                  <h3 className="category-card-title-text">
                    {cat.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', color: 'var(--color-text-muted)' }}>
            No categories found.
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;
