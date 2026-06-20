import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../../api/categoryApi';
import { extractArray } from '../../utils/helpers';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        const data = extractArray(res);
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm hidden md:block">
      <div className="container max-w-[1340px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center gap-8 py-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/courses/category/${cat.slug}`}
              className="text-[14px] text-[#2d2f31] hover:text-[#5624d0] transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
