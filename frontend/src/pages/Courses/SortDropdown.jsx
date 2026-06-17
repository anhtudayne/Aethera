import { useSearchParams } from 'react-router-dom';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Rating: High to Low' },
  { value: 'best_seller', label: 'Best Sellers' },
  { value: 'popular', label: 'Popular (Most Viewed)' }
];

const SortDropdown = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    params.set('page', '1'); // Reset pagination on sort change
    setSearchParams(params);
  };

  const activeSort = searchParams.get('sort') || 'newest';

  return (
    <div className="sort-select-wrapper">
      <span className="sort-select-label">Sort by:</span>
      <select
        value={activeSort}
        onChange={handleSortChange}
        className="sort-select-input"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
