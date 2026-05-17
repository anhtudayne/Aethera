import React from 'react';

export default function EmptyState({ clearAllFilters }) {
  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🔍</span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy khóa học phù hợp</h3>
      <p className="text-gray-500 max-w-md mb-8">
        Rất tiếc, chúng tôi không tìm thấy khóa học nào khớp với tiêu chí lọc của bạn. Vui lòng thử lại với các tiêu chí khác.
      </p>
      {clearAllFilters && (
        <button 
          onClick={clearAllFilters}
          className="px-6 py-3 bg-primary text-white font-semibold rounded-xl shadow-md hover:bg-primary-dark transition-colors flex items-center gap-2 mx-auto"
        >
          ✕ Xóa tất cả bộ lọc
        </button>
      )}
    </div>
  );
}
