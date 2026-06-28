import { useState } from 'react';
import { courseApi } from '../../../api/courseApi';
import { Reply, User } from 'lucide-react';
import { toast } from 'sonner';

const CommentItem = ({ comment, courseId, onReplyAdded }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Display up to the first 3 replies, the rest are hidden behind the "See more comments" button
  const [showAllReplies, setShowAllReplies] = useState(false);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await courseApi.postComment(courseId, replyContent, comment.id);
      const postedReply = res.data?.data || res.data;
      onReplyAdded(comment.id, postedReply);
      setReplyContent('');
      setIsReplying(false);
      setShowAllReplies(true);
      toast.success('Reply sent');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error sending response');
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (dateString) => {
    if (!dateString) return '';
    const diff = new Date() - new Date(dateString);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const replies = comment.replies || [];
  const visibleReplies = showAllReplies ? replies : replies.slice(0, 3);
  const hiddenCount = replies.length - visibleReplies.length;

  return (
    <div className="comment-item">
      <div className="comment-main">
        <div className="comment-avatar-wrapper">
          {comment.user?.image ? (
            <img src={comment.user.image} alt="Avatar" className="comment-avatar" />
          ) : (
            <div className="comment-avatar-fallback"><User size={18} /></div>
          )}
        </div>
        <div className="comment-content-wrapper">
          <div className="comment-header">
            <span className="comment-author">
              {comment.user?.firstName} {comment.user?.lastName}
            </span>
            <span className="comment-time">{timeAgo(comment.createdAt)}</span>
          </div>
          <div className="comment-body">
            {comment.content}
          </div>
          <div className="comment-actions">
            <button className="reply-btn" onClick={() => setIsReplying(!isReplying)}>
              <Reply size={14} /> Trả lời
            </button>
          </div>

          {/* Response form */}
          {isReplying && (
            <form className="reply-form" onSubmit={handleReplySubmit}>
              <textarea
                placeholder="Write your answer..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                disabled={submitting}
                rows={1}
                autoFocus
              />
              <div className="reply-form-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsReplying(false)}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={!replyContent.trim() || submitting}>
                  {submitting ? 'Sending...' : 'Sending'}
                </button>
              </div>
            </form>
          )}

          {/* Child replies (Recursive) */}
          {replies.length > 0 && (
            <div className="nested-replies">
              {visibleReplies.map(reply => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply} 
                  courseId={courseId} 
                  onReplyAdded={onReplyAdded} 
                />
              ))}
              
              {!showAllReplies && hiddenCount > 0 && (
                <button 
                  className="show-more-replies-btn" 
                  onClick={() => setShowAllReplies(true)}
                >
                  <Reply size={14} style={{ transform: 'scaleY(-1)' }} /> 
                  See also {hiddenCount} answer
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
