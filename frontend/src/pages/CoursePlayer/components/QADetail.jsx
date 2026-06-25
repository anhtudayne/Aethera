import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { qaApi } from '../../../api/qaApi';

const QADetail = ({ questionId, onBack }) => {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchQuestionDetail();
    }, [questionId]);

    const fetchQuestionDetail = async () => {
        setLoading(true);
        try {
            const res = await qaApi.getQuestionById(questionId);
            setQuestion(res.data?.data || res.data);
        } catch (error) {
            console.error('Error fetching question details:', error);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (firstName, lastName, username) => {
        if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
        return username ? username.substring(0, 2).toUpperCase() : 'U';
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        try {
            await qaApi.createAnswer(questionId, replyContent.trim());
            setReplyContent('');
            await fetchQuestionDetail(); // Refresh
        } catch (error) {
            console.error('Error posting reply:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Đang tải câu hỏi...</div>;
    }

    if (!question) {
        return (
            <div className="p-8 text-center text-gray-500">
                Không tìm thấy câu hỏi.
                <button onClick={onBack} className="block mx-auto mt-4 text-[#5624d0] font-bold hover:underline">
                    Quay lại
                </button>
            </div>
        );
    }

    const timeAgo = formatDistanceToNow(new Date(question.createdAt), { addSuffix: true, locale: vi });
    const userInitials = getInitials(question.user?.firstName, question.user?.lastName, question.user?.username);

    return (
        <div className="flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="mb-6">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft size={16} /> Quay lại danh sách câu hỏi
                </button>
            </div>

            {/* Original Question */}
            <div className="flex gap-4 mb-8">
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
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm mb-1">
                        <span className="font-bold text-[#5624d0]">
                            {question.user?.firstName} {question.user?.lastName}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">{question.lesson?.title || 'Chung'}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">{timeAgo}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                        {question.title}
                    </h2>
                    <div className="text-gray-800 whitespace-pre-wrap">
                        {question.content}
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            {/* Answers */}
            <div className="mb-8">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <MessageSquare size={20} />
                    {question.answers?.length || 0} câu trả lời
                </h3>

                <div className="space-y-6">
                    {question.answers?.map(answer => {
                        const ansTimeAgo = formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true, locale: vi });
                        const ansInitials = getInitials(answer.user?.firstName, answer.user?.lastName, answer.user?.username);

                        return (
                            <div key={answer.id} className="flex gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    {answer.user?.image ? (
                                        <img 
                                            src={answer.user.image} 
                                            alt="avatar" 
                                            className="w-10 h-10 rounded-full object-cover bg-gray-200"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm">
                                            {ansInitials}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-sm mb-1">
                                        <span className="font-bold text-[#5624d0]">
                                            {answer.user?.firstName} {answer.user?.lastName}
                                        </span>
                                        {answer.isInstructor && (
                                            <span className="bg-[#5624d0] text-white text-xs px-2 py-0.5 rounded font-bold">
                                                Giảng viên
                                            </span>
                                        )}
                                        <span className="text-gray-500">•</span>
                                        <span className="text-gray-500">{ansTimeAgo}</span>
                                    </div>
                                    <div className="text-gray-800 whitespace-pre-wrap">
                                        {answer.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Reply Form */}
            <div className="flex gap-4 mt-8">
                <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        Bạn
                    </div>
                </div>
                <form onSubmit={handleReply} className="flex-1">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Thêm câu trả lời..."
                        className="w-full border border-gray-300 rounded p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-gray-900 mb-2"
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || !replyContent.trim()}
                            className="px-6 py-2 bg-gray-900 text-white font-bold rounded hover:bg-gray-800 disabled:bg-gray-400"
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Trả lời'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QADetail;
