import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { X, Play, Video, Clock, FileText, ChevronDown, ChevronUp, User } from 'lucide-react';
import { adminApi } from '../../../api/adminApi';
import { formatPrice } from '../../../utils/helpers';
import { toast } from 'sonner';
import CourseStatusBadge from './CourseStatusBadge';

const AdminCoursePreviewModal = ({ courseId, onClose, onApprove, onReject }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getCoursePreview(courseId);
        if (res.data) {
          setCourse(res.data);
          // Expand first section by default
          if (res.data.sections && res.data.sections.length > 0) {
            setExpandedSections({ [res.data.sections[0].id]: true });
          }
        } else {
          toast.error('Failed to load course preview');
        }
      } catch (error) {
        console.error('Error fetching preview:', error);
        toast.error('Error loading course preview');
      } finally {
        setLoading(false);
      }
    };
    if (courseId) {
      fetchPreview();
    }
  }, [courseId]);

  const toggleSection = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePlayVideo = (lesson) => {
    if (lesson.videoUrl) {
      setActiveVideo(lesson);
    } else {
      toast.info('This lesson does not have a video URL');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-xl flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading preview...</span>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const getPlayableUrl = (url) => {
    if (!url) return url;
    if (url.includes('cloudinary.com') && url.includes('/video/upload/')) {
      if (!url.includes('/upload/vc_')) {
        return url.replace('/video/upload/', '/video/upload/vc_h264/');
      }
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{course.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1"><User size={14} /> {course.instructorData?.firstName} {course.instructorData?.lastName}</span>
              <span>•</span>
              <span className="font-mono">{formatPrice(course.price)}</span>
              <span>•</span>
              <CourseStatusBadge status={course.status} />
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">

          {/* Left Panel: Details & Video */}
          <div className="flex-1 overflow-y-auto border-r border-gray-200 p-6 flex flex-col gap-6">

            {/* Video Player */}
            <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', backgroundColor: '#111827', borderRadius: '0.75rem', overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                {activeVideo ? (
                  activeVideo.videoUrl ? (
                    (activeVideo.videoUrl.includes('youtube.com') || activeVideo.videoUrl.includes('youtu.be')) ? (
                      <ReactPlayer
                        url={activeVideo.videoUrl}
                        width="100%"
                        height="100%"
                        controls
                        playing
                      />
                    ) : (
                      <video
                        src={getPlayableUrl(activeVideo.videoUrl)}
                        width="100%"
                        height="100%"
                        controls
                        autoPlay
                        playsInline
                        style={{ objectFit: 'contain', backgroundColor: '#111827' }}
                      />
                    )
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-400">
                      <Video size={48} className="mx-auto mb-3 opacity-50" />
                      <p>This lesson does not have a video URL.</p>
                    </div>
                  )
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-400">
                    <Play size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Select a video lesson from the curriculum to preview.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Now Playing Title */}
            {activeVideo && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                <h3 className="text-indigo-900 font-semibold flex items-center gap-2">
                  <Play size={16} className="text-indigo-600" />
                  Currently playing: {activeVideo.title}
                </h3>
              </div>
            )}

            {/* Course Description */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
              <div
                className="text-gray-700 text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">Requirements</h3>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {course.requirements.map((req, i) => <li key={i}>{req}</li>)}
                  </ul>
                </div>
              )}
              {/* Target Audience */}
              {course.targetAudience && course.targetAudience.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">Target Audience</h3>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {course.targetAudience.map((ta, i) => <li key={i}>{ta}</li>)}
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* Right Panel: Curriculum */}
          <div className="w-full md:w-[400px] flex flex-col h-full bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-bold text-gray-900">Curriculum</h3>
              <p className="text-xs text-gray-500 mt-1">{course.sections?.length || 0} sections</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {course.sections && course.sections.map((section, idx) => (
                <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="font-medium text-gray-900 text-sm">
                      Section {idx + 1}: {section.title}
                    </div>
                    {expandedSections[section.id] ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                  </button>

                  {expandedSections[section.id] && (
                    <div className="divide-y divide-gray-100">
                      {section.lessons && section.lessons.map((lesson, lIdx) => (
                        <div
                          key={lesson.id}
                          onClick={() => handlePlayVideo(lesson)}
                          className={`px-4 py-2.5 flex items-start gap-3 cursor-pointer transition-colors ${activeVideo?.id === lesson.id ? 'bg-indigo-50/50' : 'hover:bg-gray-50'}`}
                        >
                          <div className={`mt-0.5 ${activeVideo?.id === lesson.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                            {lesson.type === 'video' ? <Video size={16} /> : <FileText size={16} />}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${activeVideo?.id === lesson.id ? 'text-indigo-900 font-medium' : 'text-gray-700'}`}>
                              {lIdx + 1}. {lesson.title}
                            </p>
                            {lesson.type === 'video' && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <Clock size={12} /> {lesson.duration || '0:00'}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      {(!section.lessons || section.lessons.length === 0) && (
                        <div className="px-4 py-3 text-sm text-gray-500 italic text-center">No lessons in this section</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        {course.status !== 'published' && course.status !== 'rejected' && (
          <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
            <button
              onClick={() => onReject(course.id, course.name, 'rejected')}
              className="px-6 py-2 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              Reject Course
            </button>
            <button
              onClick={() => onApprove(course.id)}
              className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Approve Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCoursePreviewModal;
