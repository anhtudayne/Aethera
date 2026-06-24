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
  Trash2,
  Bug,
  BookOpen
} from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import './SupportPage.css';

const SupportPage = () => {
  // Navigation State
  const [showHistory, setShowHistory] = useState(false);

  // Form State
  const [reportType, setReportType] = useState('general'); // 'general' | 'course'
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]); // Cloudinary image URLs
  
  // Loading States
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
          toast.error('Failed to load your enrolled courses list.');
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
          toast.error('Failed to load your report history.');
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
      toast.error('You can only upload a maximum of 2 evidence images.');
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
      toast.success('Evidence screenshots uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Error uploading images.');
    } finally {
      setUploadingImage(false);
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
      toast.error('Please fill in both subject and description.');
      return;
    }

    if (reportType === 'course' && !selectedCourseId) {
      toast.error('Please select the course you want to report.');
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
      toast.success('Your report has been submitted successfully!');
      
      // Reset form
      setTitle('');
      setMessage('');
      setSelectedCourseId('');
      setAttachments([]);
    } catch (err) {
      console.error('Submit ticket error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to submit your report.');
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
        return 'In Progress';
      case 'RESOLVED':
        return 'Resolved';
      case 'DISMISSED':
        return 'Dismissed';
      default:
        return status;
    }
  };

  const toggleExpandTicket = (id) => {
    setExpandedTicketId(expandedTicketId === id ? null : id);
  };

  return (
    <div className="support-page">
      <h2>Report Issue ⚙️</h2>

      <div className="support-section">
        <div className="report-section-header">
          <h3>{!showHistory ? 'Submit a New Report' : 'My Report History'}</h3>
          {!showHistory && (
            <button 
              type="button" 
              className="history-toggle-btn"
              onClick={() => setShowHistory(true)}
            >
              <History size={16} />
              <span>View History</span>
            </button>
          )}
        </div>

        {!showHistory ? (
          <form className="report-form" onSubmit={handleSubmit}>
            {/* Report Type Selector */}
            <div className="form-group">
              <label>Report Type</label>
              <div className="report-type-cards">
                <div 
                  className={`report-type-card ${reportType === 'general' ? 'active' : ''}`}
                  onClick={() => {
                    setReportType('general');
                    setSelectedCourseId('');
                  }}
                >
                  <div className="report-type-card-icon-wrapper">
                    <Bug size={20} className="report-type-card-icon" />
                  </div>
                  <div className="report-type-card-content">
                    <span className="report-type-card-title">General Issue</span>
                    <span className="report-type-card-desc">Website bugs, account issues, system errors</span>
                  </div>
                  <div className="report-type-card-radio">
                    <div className="radio-circle-inner"></div>
                  </div>
                </div>
                <div 
                  className={`report-type-card ${reportType === 'course' ? 'active' : ''}`}
                  onClick={() => setReportType('course')}
                >
                  <div className="report-type-card-icon-wrapper">
                    <BookOpen size={20} className="report-type-card-icon" />
                  </div>
                  <div className="report-type-card-content">
                    <span className="report-type-card-title">Course or Instructor</span>
                    <span className="report-type-card-desc">Lecture quality, missing contents, instructor concerns</span>
                  </div>
                  <div className="report-type-card-radio">
                    <div className="radio-circle-inner"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrolled Courses Selector (Only if Report Type is Course) */}
            {reportType === 'course' && (
              <div className="form-group">
                <label>Select Enrolled Course</label>
                {coursesLoading ? (
                  <div className="upload-loading">
                    <Loader2 size={16} className="animate-spin" style={{ color: '#5624d0' }} />
                    <span style={{ color: '#5624d0' }}>Loading purchased courses...</span>
                  </div>
                ) : enrolledCourses.length === 0 ? (
                  <p className="no-enrolled-courses-warning">
                    <AlertCircle size={16} /> You have not enrolled in any courses yet.
                  </p>
                ) : (
                  <div className="enrolled-courses-selector-list">
                    {enrolledCourses.map((course) => {
                      const isSelected = String(selectedCourseId) === String(course.id);
                      return (
                        <div
                          key={course.id}
                          className={`enrolled-course-selector-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => !submitting && setSelectedCourseId(course.id)}
                        >
                          <div className="course-card-image-wrapper">
                            <img
                              src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=60'}
                              alt={course.name}
                              className="course-card-image"
                            />
                          </div>
                          <div className="course-card-details">
                            <div className="course-card-title">{course.name}</div>
                            <div className="course-card-instructor">By {course.instructor}</div>
                          </div>
                          <div className="course-card-radio">
                            <div className="radio-circle-inner"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a brief subject (e.g. Video buffering issue, Incorrect exercises, Missing PDF)"
                disabled={submitting}
                required
              />
            </div>

            {/* Message Content */}
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your issue in detail. Share the context, what happened, or the quality concern you have..."
                disabled={submitting}
                required
              ></textarea>
            </div>

            {/* Evidence Image Uploader (Max 2) */}
            <div className="form-group uploader-container">
              <label>Evidence Screenshots (Max 2 images)</label>
              
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
                    <Loader2 size={24} className="animate-spin text-indigo-600" style={{ color: '#5624d0' }} />
                    <span className="text-sm font-semibold" style={{ color: '#5624d0' }}>Uploading evidence...</span>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">Upload screenshot evidence</span>
                    <p>Supports JPG, PNG, WEBP (Max 2. Uploaded: {attachments.length}/2)</p>
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
                        title="Remove this image"
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
              className="report-submit-btn" 
              disabled={submitting || uploadingImage || (reportType === 'course' && !selectedCourseId)}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Submitting Report...
                </span>
              ) : 'Submit Report'}
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
              <span>Back to submission form</span>
            </button>

            {ticketsLoading ? (
              <div className="flex items-center justify-center py-8 text-indigo-600 font-semibold gap-2" style={{ color: '#5624d0' }}>
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
                              {format(new Date(ticket.createdAt), "MMM dd, yyyy - HH:mm", { locale: enUS })}
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
                              <div className="details-label">Related Course</div>
                              <div className="details-course-info">
                                <span className="font-semibold text-gray-900">{ticket.course.name}</span>
                                <span className="text-xs text-gray-500">Instructor: {ticket.course.instructor}</span>
                              </div>
                            </div>
                          )}

                          {/* Report Detail Content */}
                          <div className="details-content-box">
                            <div className="details-label">Report Details</div>
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
                                  <div className="details-label">Attached Evidence</div>
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
                                <h4>Admin Response</h4>
                                <p className="response-text">{ticket.adminResponse}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="admin-response-box no-response">
                              <HelpCircle className="response-icon" size={18} />
                              <div className="response-details">
                                <h4>Pending Response</h4>
                                <p className="response-text">Our support team is reviewing your report.</p>
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
    </div>
  );
};

export default SupportPage;
