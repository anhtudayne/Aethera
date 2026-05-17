import React from 'react';

export default function Pagination({ pagination, handlePageChange }) {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="mt-12 flex justify-center items-center gap-2">
      <button 
        disabled={pagination.currentPage === 1}
        onClick={() => handlePageChange(pagination.currentPage - 1)}
        className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>

      <div className="flex items-center gap-1">
        {[...Array(pagination.totalPages)].map((_, i) => {
          const pageNum = i + 1;
          // Logic to show limited pages
          if (
            pageNum === 1 || 
            pageNum === pagination.totalPages || 
            (pageNum >= pagination.currentPage - 1 && pageNum <= pagination.currentPage + 1)
          ) {
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  pagination.currentPage === pageNum
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                }`}
              >
                {pageNum}
              </button>
            );
          } else if (
            pageNum === pagination.currentPage - 2 ||
            pageNum === pagination.currentPage + 2
          ) {
            return <span key={pageNum} className="text-gray-400 px-1">...</span>;
          }
          return null;
        })}
      </div>

      <button 
        disabled={pagination.currentPage === pagination.totalPages}
        onClick={() => handlePageChange(pagination.currentPage + 1)}
        className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}
