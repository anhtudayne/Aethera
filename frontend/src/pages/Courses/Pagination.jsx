import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ totalPages = 1 }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container-box">
      {/* Prev */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-nav-btn"
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Pages */}
      {Array.from({ length: totalPages }).map((_, index) => {
        const pageNum = index + 1;
        const isActive = pageNum === currentPage;
        return (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`pagination-number-btn ${isActive ? 'active' : ''}`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-nav-btn"
        aria-label="Next Page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
