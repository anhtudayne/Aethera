import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseApi } from '../../api/courseApi';
import { instructorApi } from '../../api/instructorApi';
import { ROUTES } from '../../utils/constants';
import Button from '../../components/common/Button/Button';
import { Loader2, ArrowLeft, Plus, Edit2, Trash2, Video, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import './InstructorCourseCurriculumPage.css';

const InstructorCourseCurriculumPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for Modals/Forms
  const [editingSection, setEditingSection] = useState(null); // { id, title } or { isNew: true, title: '' }
  const [editingLesson, setEditingLesson] = useState(null); // { id, title, type, content, videoUrl, duration, sectionId, isNew: boolean }

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      const courseRes = await courseApi.getBySlug(slug);
      const courseData = courseRes.data?.data || courseRes.data;
      if (!courseData) {
        setError('Course not found');
        return;
      }
      setCourse(courseData);

      // Fetch sections
      const sectionsRes = await instructorApi.getSections(courseData.id);
      const sectionsData = sectionsRes.data?.data || sectionsRes.data || [];
      setSections(sectionsData);
    } catch (err) {
      setError('Failed to load curriculum');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, [slug]);

  const handleSaveSection = async () => {
    try {
      if (editingSection.isNew) {
        await instructorApi.createSection({
          courseId: course.id,
          title: editingSection.title,
          order: sections.length + 1
        });
      } else {
        await instructorApi.updateSection(editingSection.id, {
          title: editingSection.title
        });
      }
      setEditingSection(null);
      fetchCurriculum();
    } catch (err) {
      alert('Failed to save section');
    }
  };

  const handleDeleteSection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this section? All its lessons will be deleted too.')) return;
    try {
      await instructorApi.deleteSection(id);
      fetchCurriculum();
    } catch (err) {
      alert('Failed to delete section');
    }
  };

  const handleSaveLesson = async () => {
    try {
      if (editingLesson.isNew) {
        await instructorApi.createLesson({
          sectionId: editingLesson.sectionId,
          title: editingLesson.title,
          type: editingLesson.type,
          content: editingLesson.content,
          videoUrl: editingLesson.videoUrl,
          duration: editingLesson.duration
        });
      } else {
        await instructorApi.updateLesson(editingLesson.id, {
          title: editingLesson.title,
          type: editingLesson.type,
          content: editingLesson.content,
          videoUrl: editingLesson.videoUrl,
          duration: editingLesson.duration
        });
      }
      setEditingLesson(null);
      fetchCurriculum();
    } catch (err) {
      alert('Failed to save lesson');
    }
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await instructorApi.deleteLesson(id);
      fetchCurriculum();
    } catch (err) {
      alert('Failed to delete lesson');
    }
  };

  if (loading) {
    return <div className="curriculum-loading"><Loader2 className="spinner" size={32} /></div>;
  }

  if (error) {
    return <div className="curriculum-error">{error}</div>;
  }

  return (
    <div className="curriculum-container">
      <div className="curriculum-header">
        <Link to={`/instructor/course/${slug}/manage`} className="back-link">
          <ArrowLeft size={16} /> Back to Course Info
        </Link>
        <h1>Curriculum</h1>
        <p>Start putting together your course by creating sections, lectures and practice.</p>
      </div>

      <div className="curriculum-content">
        {sections.map((section, sIndex) => (
          <div key={section.id} className="section-card">
            <div className="section-header">
              <div className="section-title">
                <strong>Section {sIndex + 1}:</strong> {section.title}
              </div>
              <div className="section-actions">
                <button onClick={() => setEditingSection({ id: section.id, title: section.title })}><Edit2 size={16} /></button>
                <button onClick={() => handleDeleteSection(section.id)}><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="lessons-list">
              {(section.lessons || []).map((lesson, lIndex) => (
                <div key={lesson.id} className="lesson-item">
                  <div className="lesson-info">
                    {lesson.type === 'video' ? <Video size={16} /> : <FileText size={16} />}
                    <span>Lecture {lIndex + 1}: {lesson.title}</span>
                  </div>
                  <div className="lesson-actions">
                    <button onClick={() => setEditingLesson({ ...lesson, isNew: false, sectionId: section.id })}><Edit2 size={14} /></button>
                    <button onClick={() => handleDeleteLesson(lesson.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="add-lesson-wrapper">
              <Button 
                variant="outline" 
                className="add-lesson-btn"
                onClick={() => setEditingLesson({ isNew: true, sectionId: section.id, title: '', type: 'video', content: '', videoUrl: '', duration: '' })}
              >
                <Plus size={16} /> Curriculum Item
              </Button>
            </div>
          </div>
        ))}

        {editingSection ? (
          <div className="edit-box">
            <h4>{editingSection.isNew ? 'New Section' : 'Edit Section'}</h4>
            <input 
              type="text" 
              value={editingSection.title} 
              onChange={e => setEditingSection({...editingSection, title: e.target.value})}
              placeholder="Enter a Title"
              className="curriculum-input"
            />
            <div className="edit-box-actions">
              <Button onClick={() => setEditingSection(null)} variant="outline">Cancel</Button>
              <Button onClick={handleSaveSection} variant="primary">Save Section</Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" className="add-section-btn" onClick={() => setEditingSection({ isNew: true, title: '' })}>
            <Plus size={16} /> Section
          </Button>
        )}
      </div>

      {editingLesson && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingLesson.isNew ? 'Add Lesson' : 'Edit Lesson'}</h3>
            
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={editingLesson.title} onChange={e => setEditingLesson({...editingLesson, title: e.target.value})} className="curriculum-input" />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select value={editingLesson.type} onChange={e => setEditingLesson({...editingLesson, type: e.target.value})} className="curriculum-input">
                <option value="video">Video</option>
                <option value="text">Article / Text</option>
              </select>
            </div>

            {editingLesson.type === 'video' ? (
              <>
                <div className="form-group">
                  <label>Video URL</label>
                  <input type="text" value={editingLesson.videoUrl || ''} onChange={e => setEditingLesson({...editingLesson, videoUrl: e.target.value})} className="curriculum-input" placeholder="https://youtube.com/..." />
                </div>
                <div className="form-group">
                  <label>Duration (e.g. 05:30)</label>
                  <input type="text" value={editingLesson.duration || ''} onChange={e => setEditingLesson({...editingLesson, duration: e.target.value})} className="curriculum-input" />
                </div>
              </>
            ) : (
              <div className="form-group">
                <label>Text Content</label>
                <textarea value={editingLesson.content || ''} onChange={e => setEditingLesson({...editingLesson, content: e.target.value})} className="curriculum-input" style={{ minHeight: '100px' }}></textarea>
              </div>
            )}

            <div className="modal-actions">
              <Button onClick={() => setEditingLesson(null)} variant="outline">Cancel</Button>
              <Button onClick={handleSaveLesson} variant="primary">Save Lesson</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCourseCurriculumPage;
