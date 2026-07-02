import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationBar = ({ totalPages, currentPage, setCurrentPage, totalItems, loading, pageSize }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
      <p className="text-sm text-gray-500">
        Showing{' '}
        <span className="font-semibold text-gray-700">
          {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalItems)}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-gray-700">{totalItems}</span> results
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || loading}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
          .reduce((acc, p, idx, arr) => {
            if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
            acc.push(p);
            return acc;
          }, [])
          .map((item, idx) =>
            item === '…' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">…</span>
            ) : (
              <button
                key={item}
                onClick={() => setCurrentPage(item)}
                disabled={loading}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                  currentPage === item
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item}
              </button>
            )
          )}

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || loading}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default PaginationBar;
