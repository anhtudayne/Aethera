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
      console.error('Error loading comments:', error);
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
      toast.success('Comment sent');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error submitting comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplyAdded = (parentId, newReply) => {
    // Recursively find the parent comment and add it to the replies array
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
    return <div className="comments-loading">Loading comments...</div>;
  }

  return (
    <div className="course-comments-section">
      <div className="comments-header">
        <MessageSquare size={24} />
        <h3>Q&A & Discussion</h3>
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
            placeholder="Do you have questions or want to discuss anything about this course?"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
            rows={2}
          />
          <button type="submit" disabled={!newComment.trim() || submitting} className="comment-submit-btn">
            {submitting ? 'Sending...' : <Send size={18} />}
          </button>
        </div>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments-msg">There are no comments yet. Be the first to start the discussion!</p>
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
