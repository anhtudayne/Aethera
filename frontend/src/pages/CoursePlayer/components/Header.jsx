import { Link } from 'react-router-dom';
import { ArrowLeft, Share2, MoreVertical, Trophy } from 'lucide-react';
import { ROUTES } from '../../../utils/constants';

const Header = ({ courseTitle = "Course Title", progress = 0 }) => {
  return (
    <div className="bg-[#1c1d1f] text-white flex items-center justify-between px-4 py-3 border-b border-gray-700 z-50">
      <div className="flex items-center gap-4">
        <Link to={ROUTES.DASHBOARD} className="text-gray-300 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="h-6 w-[1px] bg-gray-600"></div>
        <h1 className="font-bold text-sm md:text-base truncate max-w-xl">
          {courseTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="hidden md:flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white transition-colors">
          <Trophy size={16} className={progress === 100 ? "text-yellow-400" : ""} />
          <span>Your progress: {progress}%</span>
        </div>
        <button className="flex items-center gap-1 border border-gray-500 rounded px-3 py-1 hover:bg-gray-700 transition-colors">
          <Share2 size={16} />
          <span className="hidden md:inline">Share</span>
        </button>
        <button className="p-1 hover:bg-gray-700 rounded transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default Header;
