import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/courses?category=${category.slug}`}
      className="group flex flex-col items-center p-5 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
    >
      <div className="w-14 h-14 rounded-full overflow-hidden mb-3 bg-gray-50 group-hover:scale-110 transition-transform duration-300">
        <img
          src={category.image || 'https://via.placeholder.com/100'}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors text-center">
        {category.name}
      </h3>
      <p className="text-xs text-gray-400 mt-0.5 text-center">{category.description}</p>
    </Link>
  );
}
