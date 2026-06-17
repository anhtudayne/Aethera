import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categoryApi } from '../../api/categoryApi';
import { formatPrice, extractArray } from '../../utils/helpers';
import './FilterSidebar.css';

const LEVELS = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  
  // Local state for price range
  const urlPrice = searchParams.get('maxPrice');
  const [maxPrice, setMaxPrice] = useState(parseInt(urlPrice || '5000000', 10));
  const [prevUrlPrice, setPrevUrlPrice] = useState(urlPrice);

  if (urlPrice !== prevUrlPrice) {
    setPrevUrlPrice(urlPrice);
    setMaxPrice(parseInt(urlPrice || '5000000', 10));
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        const data = extractArray(res);
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load categories for sidebar:', err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Always reset page on filter change
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleLevelChange = (level) => {
    updateParam('level', level);
  };

  const handleCategoryChange = (categoryId) => {
    updateParam('category', categoryId);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setMaxPrice(parseInt(value, 10));
  };

  const handlePriceMouseUp = () => {
    updateParam('maxPrice', maxPrice.toString());
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    const search = searchParams.get('search');
    if (search) params.set('search', search); // preserve search term
    setSearchParams(params);
    setMaxPrice(5000000);
  };

  const activeCategory = searchParams.get('category') || '';
  const activeLevel = searchParams.get('level') || 'all';

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h4 className="filter-title">Filters</h4>
        <button onClick={clearAllFilters} className="clear-filters-btn">
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="filter-group">
        <h5 className="filter-group-heading">Category</h5>
        <div className="filter-options">
          <label className="filter-option-label">
            <input
              type="radio"
              name="category"
              checked={activeCategory === ''}
              onChange={() => handleCategoryChange('all')}
              className="filter-radio"
            />
            <span className="filter-text">All Categories</span>
          </label>
          {Array.isArray(categories) && categories.map((cat) => (
            <label className="filter-option-label" key={cat.id}>
              <input
                type="radio"
                name="category"
                checked={activeCategory === cat.id.toString()}
                onChange={() => handleCategoryChange(cat.id.toString())}
                className="filter-radio"
              />
              <span className="filter-text">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Levels */}
      <div className="filter-group">
        <h5 className="filter-group-heading">Difficulty Level</h5>
        <div className="filter-options">
          {LEVELS.map((lvl) => (
            <label className="filter-option-label" key={lvl.value}>
              <input
                type="radio"
                name="level"
                checked={activeLevel === lvl.value}
                onChange={() => handleLevelChange(lvl.value)}
                className="filter-radio"
              />
              <span className="filter-text">{lvl.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Limit Slider */}
      <div className="filter-group">
        <h5 className="filter-group-heading">Maximum Price</h5>
        <div className="price-slider-info">
          <span>Up to:</span>
          <span className="price-badge-highlight">{maxPrice === 5000000 ? 'Any Price' : formatPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="5000000"
          step="100000"
          value={maxPrice}
          onChange={handlePriceChange}
          onMouseUp={handlePriceMouseUp}
          onTouchEnd={handlePriceMouseUp}
          className="filter-range-slider"
        />
        <div className="price-slider-labels">
          <span>0 ₫</span>
          <span>5.0M ₫</span>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
