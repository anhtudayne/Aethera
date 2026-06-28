import { useState, useEffect } from 'react';
import { ticketApi } from '../../api/ticketApi';
import { toast } from 'sonner';
import { 
  AlertCircle, 
  Upload, 
  History, 
  ChevronLeft, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  HelpCircle,
  FileText,
  Loader2,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import './ReportSection.css';

const ReportSection = () => {
  // Navigation State
  const [showHistory, setShowHistory] = useState(false);

  // Form State
  const [reportType, setReportType] = useState('general'); // 'general' | 'course'
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]); // Cloudinary image URLs
  
  // Loading & Error States
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Data State
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  // Load enrolled courses for dropdown
  useEffect(() => {
    if (reportType === 'course' && enrolledCourses.length === 0) {
      const fetchCourses = async () => {
        try {
          setCoursesLoading(true);
          const res = await ticketApi.getMyEnrolledCourses();
          const coursesList = res.data || res || [];
          setEnrolledCourses(coursesList);
        } catch (err) {
          console.error('Error fetching enrolled courses:', err);
          toast.error('Your course list could not be loaded.');
        } finally {
          setCoursesLoading(false);
        }
      };
      fetchCourses();
    }
  }, [reportType, enrolledCourses.length]);

  // Load user tickets when history is opened
  useEffect(() => {
    if (showHistory) {
      const fetchMyTickets = async () => {
        try {
          setTicketsLoading(true);
          const res = await ticketApi.getMyTickets();
          setTickets(res.data || res || []);
        } catch (err) {
          console.error('Error fetching tickets:', err);
          toast.error('Unable to load report history.');
        } finally {
          setTicketsLoading(false);
        }
      };
      fetchMyTickets();
    }
  }, [showHistory]);

  // Handle uploading evidence images (Max 2 images)
  const handleImageUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    if (attachments.length + selectedFiles.length > 2) {
      toast.error('You can only upload a maximum of 2 proof images.');
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const res = await ticketApi.uploadEvidence(formData);
      const uploadedUrls = res.urls || res.data?.urls || [];
      
      setAttachments((prev) => [...prev, ...uploadedUrls].slice(0, 2));
      toast.success('Upload photo proof successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Error uploading photo.');
    } finally {
      setUploadingImage(false);
      // Clear value so the same file can be selected again
      e.target.value = '';
    }
  };

  // Remove uploaded image preview
  const handleRemoveImage = (indexToRemove) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Handle submit report
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Please enter full title and content.');
      return;
    }

    if (reportType === 'course' && !selectedCourseId) {
      toast.error('Please select the course to report.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: title.trim(),
        message: message.trim(),
        targetId: reportType === 'course' ? Number(selectedCourseId) : null,
        attachments
      };

      await ticketApi.createTicket(payload);
      toast.success('Your report has been sent successfully!');
      
      // Reset form
      setTitle('');
      setMessage('');
      setSelectedCourseId('');
      setAttachments([]);
    } catch (err) {
      console.error('Submit ticket error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Submit failure report.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'OPEN':
        return 'status-badge open';
      case 'IN_PROGRESS':
        return 'status-badge in_progress';
      case 'RESOLVED':
        return 'status-badge resolved';
      case 'DISMISSED':
        return 'status-badge dismissed';
      default:
        return 'status-badge';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'OPEN':
        return 'Pending';
      case 'IN_PROGRESS':
        return 'Processing';
      case 'RESOLVED':
        return 'Resolved';
      case 'DISMISSED':
        return 'Refused';
      default:
        return status;
    }
  };

  const toggleExpandTicket = (id) => {
    setExpandedTicketId(expandedTicketId === id ? null : id);
  };

  return (
    <div className="settings-section">
      <div className="report-section-header">
        <h3>Report problems & Suggestions</h3>
        {!showHistory && (
          <button 
            type="button" 
            className="history-toggle-btn"
            onClick={() => setShowHistory(true)}
          >
            <History size={16} />
            <span>View report history</span>
          </button>
        )}
      </div>

      {!showHistory ? (
        <form className="report-form" onSubmit={handleSubmit}>
          {/* Report Type Selector */}
          <div className="form-group">
            <label>Report type</label>
            <div className="report-type-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="reportType"
                  value="general"
                  checked={reportType === 'general'}
                  onChange={() => setReportType('general')}
                />
                Báo cáo chung (website, tài khoản, lỗi hệ thống)
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="reportType"
                  value="course"
                  checked={reportType === 'course'}
                  onChange={() => setReportType('course')}
                />
                Báo cáo về Khóa học & Lecturer
              </label>
            </div>
          </div>

          {/* Enrolled Courses Dropdown (Only if Report Type is Course) */}
          {reportType === 'course' && (
            <div className="form-group">
              <label>Select the purchased course</label>
              {coursesLoading ? (
                <div className="upload-loading">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Loading course list...</span>
                </div>
              ) : (
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  disabled={submitting}
                  required
                >
                  <option value="">-- Select the course you want to report --</option>
                  {enrolledCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.instructor})
                    </option>
                  ))}
                </select>
              )}
              {enrolledCourses.length === 0 && !coursesLoading && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> You have not purchased or registered for any courses on the system.
                </p>
              )}
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label>Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a brief report title (e.g. Video loading error, Lesson missing materials)"
              disabled={submitting}
              required
            />
          </div>

          {/* Message Content */}
          <div className="form-group">
            <label>Detailed content</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Vui lòng mô tả chi tiết lỗi hoặc vấn đề bạn đang gặp phải. Chất lượng bài giảng thế nào hoặc sự cố cụ thể là gì..."
              disabled={submitting}
              required
            ></textarea>
          </div>

          {/* Evidence Image Uploader (Max 2) */}
          <div className="form-group uploader-container">
            <label>Proof images (Maximum 2 photos)</label>
            
            <label 
              className={`uploader-trigger ${attachments.length >= 2 || uploadingImage || submitting ? 'disabled' : ''}`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={attachments.length >= 2 || uploadingImage || submitting}
                style={{ display: 'none' }}
              />
              {uploadingImage ? (
                <>
                  <Loader2 size={24} className="animate-spin text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-600">Uploading photos...</span>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">Upload proof photos</span>
                  <p>Supports JPG, PNG, WEBP (Maximum 2 images. Loaded: {attachments.length}/2)</p>
                </>
              )}
            </label>

            {/* Images Preview Grid */}
            {attachments.length > 0 && (
              <div className="uploader-preview-grid">
                {attachments.map((url, index) => (
                  <div key={index} className="preview-item">
                    <img src={url} alt={`Evidence Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="delete-preview-btn"
                      onClick={() => handleRemoveImage(index)}
                      title="Delete this image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="settings-save-btn" 
            disabled={submitting || uploadingImage || (reportType === 'course' && !selectedCourseId)}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Sending report...
              </span>
            ): 'Send report'}
          </button>
        </form>
      ) : (
        /* History View */
        <div className="history-container">
          <button 
            type="button" 
            className="back-link-btn"
            onClick={() => setShowHistory(false)}
          >
            <ChevronLeft size={16} />
            <span>Return to the report submission page</span>
          </button>

          {ticketsLoading ? (
            <div className="flex items-center justify-center py-8 text-indigo-600 font-semibold gap-2">
              <Loader2 size={20} className="animate-spin" />
              <span>Loading report history...</span>
            </div>
          ) : tickets.length === 0 ? (
            <div className="no-tickets-state">
              <FileText size={48} className="mx-auto text-gray-300 mb-3" />
              <p>You have not submitted any reports yet.</p>
            </div>
          ) : (
            <div className="history-list">
              {tickets.map((ticket) => {
                const isExpanded = expandedTicketId === ticket.id;
                return (
                  <div key={ticket.id} className="history-item">
                    {/* Item Accordion Header */}
                    <div 
                      className="history-item-summary"
                      onClick={() => toggleExpandTicket(ticket.id)}
                    >
                      <div className="history-item-left">
                        <div className="history-item-title">{ticket.title}</div>
                        <div className="history-item-meta">
                          <span>
                            Type: {ticket.ticketType === 'REPORT' ? 'Course' : 'System'}
                          </span>
                          <span>•</span>
                          <span>
                            {format(new Date(ticket.createdAt), "dd 'thg' MM, yyyy - HH:mm", { locale: vi })}
                          </span>
                        </div>
                      </div>
                      <div className="history-item-right">
                        <span className={getStatusBadgeClass(ticket.status)}>
                          {getStatusText(ticket.status)}
                        </span>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>

                    {/* Item Accordion Body */}
                    {isExpanded && (
                      <div className="history-item-details">
                        {/* Course metadata if applicable */}
                        {ticket.course && (
                          <div className="details-content-box">
                            <div className="details-label">Related courses</div>
                            <div className="details-course-info">
                              <span className="font-semibold text-gray-900">{ticket.course.name}</span>
                              <span className="text-xs text-gray-500">Instructor: {ticket.course.instructor}</span>
                            </div>
                          </div>
                        )}

                        {/* Report Detail Content */}
                        <div className="details-content-box">
                          <div className="details-label">Detailed report content</div>
                          <p className="details-message">{ticket.message}</p>
                        </div>

                        {/* Evidence attachments */}
                        {ticket.attachments && (
                          (() => {
                            let parsedAttachments = [];
                            if (Array.isArray(ticket.attachments)) {
                              parsedAttachments = ticket.attachments;
                            } else if (typeof ticket.attachments === 'string') {
                              try {
                                const parsed = JSON.parse(ticket.attachments);
                                parsedAttachments = Array.isArray(parsed) ? parsed : [parsed];
                              } catch {
                                parsedAttachments = [ticket.attachments];
                              }
                            }
                            
                            return parsedAttachments.length > 0 && (
                              <div className="details-evidence">
                                <div className="details-label">Photo proof attached</div>
                                <div className="details-evidence-grid">
                                  {parsedAttachments.map((imgUrl, idx) => (
                                    <a 
                                      key={idx} 
                                      href={imgUrl} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="evidence-thumb"
                                    >
                                      <img src={imgUrl} alt={`Evidence thumbnail ${idx + 1}`} />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            );
                          })()
                        )}

                        {/* Admin Feedback response */}
                        {ticket.adminResponse ? (
                          <div className="admin-response-box">
                            <MessageSquare className="response-icon" size={18} />
                            <div className="response-details">
                              <h4>Response from the Board of Directors</h4>
                              <p className="response-text">{ticket.adminResponse}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="admin-response-box no-response">
                            <HelpCircle className="response-icon" size={18} />
                            <div className="response-details">
                              <h4>No response yet</h4>
                              <p className="response-text">The administration is reviewing your report.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportSection;
