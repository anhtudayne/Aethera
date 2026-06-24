import React, { useState, useEffect, useCallback } from 'react';
import { Search, SearchIcon } from 'lucide-react';
import { qaApi } from '../../../api/qaApi';
import QAQuestionCard from './QAQuestionCard';
import QAForm from './QAForm';
import QADetail from './QADetail';

const CourseQATab = ({ courseId, activeLessonId }) => {
    const [questions, setQuestions] = useState([]);
    const [upvotedIds, setUpvotedIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    
    // Filters and State
    const [viewMode, setViewMode] = useState('list'); // 'list', 'form', 'detail'
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [filterLesson, setFilterLesson] = useState('all'); // 'all' or 'current'
    const [sortBy, setSortBy] = useState('recent'); // 'recent' or 'upvoted'
    const [keyword, setKeyword] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await qaApi.getQuestions(courseId, {
                lessonId: filterLesson === 'current' ? activeLessonId : 'all',
                keyword,
                sortBy,
                page,
                limit: 10
            });
            setQuestions(res.data?.questions || []);
            setTotalPages(res.data?.totalPages || 1);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    }, [courseId, activeLessonId, filterLesson, sortBy, keyword, page]);

    const fetchUpvotes = useCallback(async () => {
        try {
            const res = await qaApi.getUserUpvotes(courseId);
            setUpvotedIds(new Set(res.data || []));
        } catch (error) {
            console.error('Error fetching upvotes:', error);
        }
    }, [courseId]);

    useEffect(() => {
        if (viewMode === 'list') {
            fetchQuestions();
            fetchUpvotes();
        }
    }, [fetchQuestions, fetchUpvotes, viewMode]);

    const handleSearch = (e) => {
        e.preventDefault();
        setKeyword(searchInput);
        setPage(1);
    };

    const handleUpvote = async (questionId) => {
        try {
            const res = await qaApi.toggleUpvote(questionId);
            const { isUpvoted, upvotesCount } = res.data;
            
            // Update local state
            setQuestions(prev => prev.map(q => 
                q.id === questionId ? { ...q, upvotesCount } : q
            ));
            
            setUpvotedIds(prev => {
                const newSet = new Set(prev);
                if (isUpvoted) newSet.add(questionId);
                else newSet.delete(questionId);
                return newSet;
            });
        } catch (error) {
            console.error('Error toggling upvote:', error);
        }
    };

    const handleQuestionClick = (questionId) => {
        setSelectedQuestionId(questionId);
        setViewMode('detail');
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedQuestionId(null);
    };

    const handleFormSuccess = () => {
        setViewMode('list');
        setPage(1);
        setSortBy('recent');
        setKeyword('');
        setSearchInput('');
        fetchQuestions();
    };

    if (viewMode === 'detail' && selectedQuestionId) {
        return <QADetail questionId={selectedQuestionId} onBack={handleBackToList} />;
    }

    return (
        <div className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <form onSubmit={handleSearch} className="relative flex-1">
                    <input 
                        type="text" 
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Tìm kiếm tất cả câu hỏi trong khóa học" 
                        className="w-full border border-gray-900 rounded p-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-500" size={20} />
                    <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-gray-900 text-white rounded-r">
                        <SearchIcon size={20} />
                    </button>
                </form>
            </div>

            {/* Filters & Ask Button */}
            {viewMode === 'list' && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                    <div className="flex flex-wrap gap-4">
                        <select 
                            value={filterLesson}
                            onChange={(e) => { setFilterLesson(e.target.value); setPage(1); }}
                            className="font-bold p-2 border border-black rounded focus:outline-none"
                        >
                            <option value="all">Tất cả bài giảng</option>
                            <option value="current">Bài giảng hiện tại</option>
                        </select>
                        <select 
                            value={sortBy}
                            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                            className="font-bold p-2 border border-black rounded focus:outline-none"
                        >
                            <option value="recent">Mới nhất</option>
                            <option value="upvoted">Được đề xuất (Upvotes)</option>
                        </select>
                    </div>
                    <button 
                        onClick={() => setViewMode('form')}
                        className="font-bold border border-black px-4 py-2 rounded hover:bg-gray-100 whitespace-nowrap"
                    >
                        Đặt câu hỏi mới
                    </button>
                </div>
            )}

            {/* Form Mode */}
            {viewMode === 'form' && (
                <QAForm 
                    courseId={courseId} 
                    activeLessonId={activeLessonId} 
                    onCancel={() => setViewMode('list')} 
                    onSuccess={handleFormSuccess} 
                />
            )}

            {/* Questions List */}
            {viewMode === 'list' && (
                <div>
                    <h3 className="font-bold text-lg mb-4">
                        {questions.length > 0 ? `Tất cả câu hỏi trong khóa học (${questions.length})` : 'Tất cả câu hỏi'}
                    </h3>
                    
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Đang tải...</div>
                    ) : questions.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            Không tìm thấy câu hỏi nào. Bạn hãy là người đầu tiên đặt câu hỏi nhé!
                        </div>
                    ) : (
                        <div className="border border-gray-200 rounded">
                            {questions.map(question => (
                                <QAQuestionCard 
                                    key={question.id} 
                                    question={question}
                                    isUpvoted={upvotedIds.has(question.id)}
                                    onUpvote={handleUpvote}
                                    onClick={handleQuestionClick}
                                />
                            ))}
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 gap-2">
                            <button 
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Trước
                            </button>
                            <span className="px-3 py-1">Trang {page} / {totalPages}</span>
                            <button 
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseQATab;
