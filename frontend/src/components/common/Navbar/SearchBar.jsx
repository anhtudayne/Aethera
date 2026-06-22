import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/courses?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  return (
    <form className="nav-search-bar" onSubmit={handleSubmit}>
      <button type="submit" className="nav-search-icon-btn" aria-label="Search">
        <Search size={18} />
      </button>
      <input
        type="text"
        placeholder="Tìm kiếm nội dung bất kỳ..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="nav-search-input"
      />
    </form>
  );
};

export default SearchBar;
