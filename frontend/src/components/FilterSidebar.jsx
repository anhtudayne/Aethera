import React from 'react';

const LEVELS = [
  { value: 'beginner', label: 'Mới bắt đầu' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'advanced', label: 'Chuyên gia' }
];

export default function FilterSidebar({
  categories,
  activeCategories,
  activeLevels,
  localPrices,
  setLocalPrices,
  handleCheckboxChange,
  clearAllFilters,
  hasActiveFilters
}) {
  return (
    <aside className="w-full md:w-64 bg-white md:bg-transparent shadow-sm md:shadow-none p-6 md:p-0 rounded-2xl border border-gray-100 md:border-none flex-shrink-0">
      <div className="space-y-8 w-full md:w-64">
        {/* Danh mục */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-lg">Danh mục</h3>
          <div className="space-y-2.5">
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  checked={activeCategories.includes(cat.id.toString())}
                  onChange={() => handleCheckboxChange('categories', cat.id)}
                />
                <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Trình độ */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-lg">Trình độ</h3>
          <div className="space-y-2.5">
            {LEVELS.map(level => (
              <label key={level.value} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  checked={activeLevels.includes(level.value)}
                  onChange={() => handleCheckboxChange('levels', level.value)}
                />
                <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{level.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Khoảng giá */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-lg">Giá (VNĐ)</h3>
          <div className="flex items-center gap-2 mb-3">
            <input 
              type="number" 
              placeholder="Từ" 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              value={localPrices.min}
              onChange={(e) => setLocalPrices(prev => ({ ...prev, min: e.target.value }))}
            />
            <span className="text-gray-400">-</span>
            <input 
              type="number" 
              placeholder="Đến" 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none focus:ring-1 focus:ring-primary/20 transition-all"
              value={localPrices.max}
              onChange={(e) => setLocalPrices(prev => ({ ...prev, max: e.target.value }))}
            />
          </div>
        </div>
        
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            className="w-full py-2.5 px-4 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            ✕ Xóa tất cả bộ lọc
          </button>
        )}
      </div>
    </aside>
  );
}
