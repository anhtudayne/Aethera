import { useState } from 'react';
import { courseApi } from '../../../api/courseApi';
import { Reply, User } from 'lucide-react';
import { toast } from 'sonner';

const CommentItem = ({ comment, courseId, onReplyAdded }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Hiển thị tối đa 3 replies đầu, còn lại ẩn sau nút "Xem thêm bình luận"
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
      toast.success('Đã gửi trả lời');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Lỗi khi gửi trả lời');
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (dateString) => {
    if (!dateString) return '';
    const diff = new Date() - new Date(dateString);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
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

          {/* Form trả lời */}
          {isReplying && (
            <form className="reply-form" onSubmit={handleReplySubmit}>
              <textarea
                placeholder="Viết câu trả lời..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                disabled={submitting}
                rows={1}
                autoFocus
              />
              <div className="reply-form-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsReplying(false)}>Hủy</button>
                <button type="submit" className="btn-submit" disabled={!replyContent.trim() || submitting}>
                  {submitting ? 'Đang gửi...' : 'Gửi'}
                </button>
              </div>
            </form>
          )}

          {/* Các replies con (Đệ quy) */}
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
                  Xem thêm {hiddenCount} câu trả lời
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
