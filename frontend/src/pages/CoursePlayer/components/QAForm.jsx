import React, { useState } from 'react';
import { qaApi } from '../../../api/qaApi';

const QAForm = ({ courseId, activeLessonId, onCancel, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
            setError('Please enter full title and content.');
            return;
        }
        
        setIsSubmitting(true);
        setError('');

        try {
            await qaApi.createQuestion(courseId, {
                title: title.trim(),
                content: content.trim(),
                lessonId: activeLessonId
            });
            onSuccess();
        } catch (err) {
            console.error('Error submitting question:', err);
            setError('An error occurred while submitting your question. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded p-4 mb-6">
            <h3 className="text-lg font-bold mb-4">Ask new questions</h3>
            
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                    Title
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Example: How to import this module?"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{title.length}/100</p>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                    Detailed content
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                    className="w-full border border-gray-300 rounded p-2 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
            </div>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 font-bold hover:bg-gray-100 rounded"
                    disabled={isSubmitting}
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white font-bold rounded hover:bg-gray-800 disabled:bg-gray-400"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Sending...' : 'Posting question'}
                </button>
            </div>
        </form>
    );
};

export default QAForm;
