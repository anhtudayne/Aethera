import React from 'react';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const QAQuestionCard = ({ question, isUpvoted, onUpvote, onClick }) => {
    // Helper to get initials
    const getInitials = (firstName, lastName, username) => {
        if (firstName && lastName) {
            return `${firstName[0]}${lastName[0]}`.toUpperCase();
        }
        return username ? username.substring(0, 2).toUpperCase() : 'U';
    };

    const userInitials = getInitials(question.user?.firstName, question.user?.lastName, question.user?.username);
    
    // Format date
    const timeAgo = formatDistanceToNow(new Date(question.createdAt), { addSuffix: true, locale: vi });

    return (
        <div 
            className="flex gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onClick(question.id)}
        >
            {/* Avatar */}
            <div className="flex-shrink-0 mt-1">
                {question.user?.image ? (
                    <img 
                        src={question.user.image} 
                        alt="avatar" 
                        className="w-12 h-12 rounded-full object-cover bg-gray-200"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-lg">
                        {userInitials}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 truncate">
                    {question.title}
                </h3>
                
                {/* Content snippet */}
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {question.content}
                </p>

                {/* Metadata */}
                <div className="flex items-center text-xs text-gray-500 gap-2">
                    <span className="text-[#5624d0] font-medium hover:underline truncate max-w-[200px]">
                        {question.user?.firstName} {question.user?.lastName}
                    </span>
                    <span>•</span>
                    <span className="truncate max-w-[200px]">
                        Bài học: {question.lesson?.title || 'Chung'}
                    </span>
                    <span>•</span>
                    <span>{timeAgo}</span>
                </div>
            </div>

            {/* Stats / Actions */}
            <div className="flex flex-col items-center gap-3 pl-4 border-l border-gray-100 min-w-[60px]">
                <button 
                    className="flex items-center gap-1.5 group flex-col"
                    onClick={(e) => {
                        e.stopPropagation();
                        onUpvote(question.id);
                    }}
                >
                    <span className={`text-sm font-bold ${isUpvoted ? 'text-[#5624d0]' : 'text-gray-600'}`}>
                        {question.upvotesCount}
                    </span>
                    <ThumbsUp 
                        size={18} 
                        className={`transition-colors ${isUpvoted ? 'fill-[#5624d0] text-[#5624d0]' : 'text-gray-400 group-hover:text-gray-600'}`} 
                    />
                </button>
                
                <div className="flex items-center gap-1.5 flex-col text-gray-500">
                    <span className="text-sm font-bold">{question.answersCount || 0}</span>
                    <MessageSquare size={18} />
                </div>
            </div>
        </div>
    );
};

export default QAQuestionCard;
