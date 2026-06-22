import { useState, useEffect } from 'react';
import { courseApi } from '../../../api/courseApi';
import CommentItem from './CommentItem';
import { MessageSquare, Send, User } from 'lucide-react';
import { toast } from 'sonner';
import useAuth from '../../../hooks/useAuth';
import './CourseComments.css';

const CourseComments = ({ courseId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [courseId]);

  const fetchComments = async () => {
    try {
      const res = await courseApi.getComments(courseId);
      setComments(res.data?.data || res.data || []);
    } catch (error) {
      console.error('Lỗi tải bình luận:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostRootComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await courseApi.postComment(courseId, newComment);
      const postedComment = res.data?.data || res.data;
      setComments([postedComment, ...comments]);
      setNewComment('');
      toast.success('Đã gửi bình luận');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Lỗi khi gửi bình luận');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplyAdded = (parentId, newReply) => {
    // Đệ quy tìm comment cha và thêm vào mảng replies
    const addReplyToTree = (list, parentId, newReply) => {
      return list.map(c => {
        if (c.id === parentId) {
          return { ...c, replies: [newReply, ...(c.replies || [])] };
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: addReplyToTree(c.replies, parentId, newReply) };
        }
        return c;
      });
    };
    setComments(addReplyToTree(comments, parentId, newReply));
  };

  if (loading) {
    return <div className="comments-loading">Đang tải bình luận...</div>;
  }

  return (
    <div className="course-comments-section">
      <div className="comments-header">
        <MessageSquare size={24} />
        <h3>Hỏi đáp & Thảo luận</h3>
      </div>

      <form className="comment-form-root" onSubmit={handlePostRootComment}>
        <div className="comment-avatar-wrapper" style={{ marginTop: '4px' }}>
          {user?.image ? (
            <img src={user.image} alt="Avatar" className="comment-avatar" />
          ) : (
            <div className="comment-avatar-fallback">
              <User size={18} />
            </div>
          )}
        </div>
        <div className="comment-input-wrapper">
          <textarea
            placeholder="Bạn có câu hỏi hoặc muốn thảo luận gì về khóa học này?"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
            rows={2}
          />
          <button type="submit" disabled={!newComment.trim() || submitting} className="comment-submit-btn">
            {submitting ? 'Đang gửi...' : <Send size={18} />}
          </button>
        </div>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments-msg">Chưa có bình luận nào. Hãy là người đầu tiên bắt đầu cuộc thảo luận!</p>
        ) : (
          comments.map(c => (
            <CommentItem 
              key={c.id} 
              comment={c} 
              courseId={courseId} 
              onReplyAdded={handleReplyAdded} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CourseComments;
