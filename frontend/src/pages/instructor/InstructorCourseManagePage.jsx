import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseApi } from '../../api/courseApi';
import { categoryApi } from '../../api/categoryApi';
import { instructorApi } from '../../api/instructorApi';
import { ROUTES } from '../../utils/constants';
import Button from '../../components/common/Button/Button';
import { Loader2, ArrowLeft, Save, BookOpen, Upload, CheckCircle, Circle, Send } from 'lucide-react';

const InstructorCourseManagePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    salePrice: '',
    categoryId: '',
    level: '',
    language: '',
    whatYouWillLearn: '',
    requirements: '',
    targetAudience: '',
    thumbnail: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, catRes] = await Promise.all([
          courseApi.getBySlug(slug),
          categoryApi.getAll()
        ]);

        const courseData = courseRes.data?.data || courseRes.data;
        if (!courseData) {
          setError('Course not found');
          setLoading(false);
          return;
        }

        setCourse(courseData);
        setFormData({
          name: courseData.name || '',
          shortDescription: courseData.shortDescription || '',
          description: courseData.description || '',
          price: courseData.price || '',
          salePrice: courseData.salePrice || '',
          categoryId: courseData.categoryId || '',
          level: courseData.level || 'beginner',
          language: courseData.language || 'Tiếng Việt',
          whatYouWillLearn: Array.isArray(courseData.whatYouWillLearn) ? courseData.whatYouWillLearn.join('\n') : '',
          requirements: Array.isArray(courseData.requirements) ? courseData.requirements.join('\n') : '',
          targetAudience: Array.isArray(courseData.targetAudience) ? courseData.targetAudience.join('\n') : '',
          thumbnail: courseData.thumbnail || ''
        });

        const catData = catRes.data?.data || catRes.data;
        setCategories(catData || []);

        setLoading(false);
      } catch (err) {
        setError('Failed to load course details');
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('thumbnail', file);
      
      const res = await instructorApi.uploadCourseThumbnail(formDataUpload);
      // axiosClient already unwraps the response data
      const imageUrl = res.imageUrl || (res.data && res.data.imageUrl);
      
      if (imageUrl) {
        setFormData(prev => ({ ...prev, thumbnail: imageUrl }));
        setMessage('Image uploaded successfully! Remember to save the course.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const payload = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        whatYouWillLearn: formData.whatYouWillLearn.split('\n').filter(line => line.trim() !== ''),
        requirements: formData.requirements.split('\n').filter(line => line.trim() !== ''),
        targetAudience: formData.targetAudience.split('\n').filter(line => line.trim() !== '')
      };

      const res = await instructorApi.updateCourse(course.id, payload);
      setMessage('Course updated successfully!');
      
      // If the name changed, the slug might have changed.
      // But we will just show the success message for now.
      if (res.data && res.data.data && res.data.data.slug !== slug) {
         navigate(`/instructor/course/${res.data.data.slug}/manage`, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!window.confirm('Are you sure you want to submit this course for review? You will not be able to edit major details while it is pending.')) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await instructorApi.submitReview(course.id);
      setMessage('Course submitted for review successfully!');
      setCourse(prev => ({ ...prev, status: 'pending' }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit course for review');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}><Loader2 className="spinner" size={32} /></div>;
  }

  if (error && !course) {
    return <div style={{ padding: '24px', color: '#b30820' }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to={ROUTES.INSTRUCTOR_DASHBOARD} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1c1d1f' }}>
            <ArrowLeft size={24} />
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Course Landing Page</h1>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to={`/instructor/course/${slug}/curriculum`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px solid #1c1d1f', textDecoration: 'none', color: '#1c1d1f', fontWeight: 700 }}>
            <BookOpen size={16} /> Curriculum Builder
          </Link>
          <Button onClick={handleSave} disabled={saving} variant="primary" style={{ padding: '8px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            {saving ? <Loader2 className="spinner" size={16} /> : <Save size={16} />}
            Save
          </Button>
        </div>
      </div>

      {message && <div style={{ padding: '16px', backgroundColor: '#d1e7dd', color: '#0f5132', marginBottom: '24px' }}>{message}</div>}
      {error && <div style={{ padding: '16px', backgroundColor: '#fcebea', color: '#b30820', marginBottom: '24px' }}>{error}</div>}

      {/* Pre-check Progress Bar */}
      {(() => {
        let totalLessons = 0;
        let totalDurationSecs = 0;
        if (course?.sections) {
          course.sections.forEach(sec => {
            if (sec.lessons) {
              totalLessons += sec.lessons.length;
              sec.lessons.forEach(l => {
                if (l.duration) {
                  const parts = l.duration.split(':').reverse();
                  let secs = 0;
                  if (parts[0]) secs += parseInt(parts[0], 10);
                  if (parts[1]) secs += parseInt(parts[1], 10) * 60;
                  if (parts[2]) secs += parseInt(parts[2], 10) * 3600;
                  totalDurationSecs += secs;
                }
              });
            }
          });
        }
        
        const isThumbnailOk = !!formData.thumbnail;
        const isDescOk = formData.description?.trim().length >= 50;
        const isCatOk = !!formData.categoryId;
        const isLessonOk = totalLessons >= 3;
        const isDurationOk = totalDurationSecs >= 15 * 60;
        
        const conditions = [
          { label: 'Thumbnail uploaded', ok: isThumbnailOk },
          { label: 'Description (>= 50 chars)', ok: isDescOk },
          { label: 'Category selected', ok: isCatOk },
          { label: `At least 3 lessons (has ${totalLessons})`, ok: isLessonOk },
          { label: `At least 15 mins (has ${Math.floor(totalDurationSecs / 60)}m)`, ok: isDurationOk }
        ];
        
        const completedCount = conditions.filter(c => c.ok).length;
        const isReady = completedCount === conditions.length;
        const isDraft = course?.status === 'draft';
        const isRejected = course?.status === 'rejected';

        return (isDraft || isRejected) && (
          <div style={{ padding: '24px', border: '1px solid #d1d7dc', backgroundColor: '#f7f9fa', marginBottom: '24px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0' }}>Submit for Review</h2>
                <p style={{ margin: 0, color: '#6a6f73', fontSize: '14px' }}>Complete all requirements to submit your course to the moderation team.</p>
              </div>
              <Button 
                onClick={handleSubmitReview} 
                disabled={!isReady || saving} 
                style={{ 
                  padding: '10px 20px', display: 'flex', gap: '8px', alignItems: 'center',
                  backgroundColor: isReady ? '#a435f0' : '#e5e7eb',
                  color: isReady ? 'white' : '#9ca3af',
                  cursor: isReady ? 'pointer' : 'not-allowed',
                  border: 'none', fontWeight: 700
                }}
              >
                {saving ? <Loader2 className="spinner" size={16} /> : <Send size={16} />}
                Submit for Review
              </Button>
            </div>
            
            <div style={{ width: '100%', height: '8px', backgroundColor: '#d1d7dc', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ width: `${(completedCount / conditions.length) * 100}%`, height: '100%', backgroundColor: isReady ? '#198754' : '#a435f0', transition: 'width 0.3s ease' }}></div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {conditions.map((c, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: c.ok ? '#198754' : '#6a6f73' }}>
                  {c.ok ? <CheckCircle size={16} /> : <Circle size={16} />}
                  {c.label}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div style={{ borderTop: '1px solid #d1d7dc', paddingTop: '24px' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Course Image / Thumbnail</label>
              <div style={{ border: '1px solid #d1d7dc', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7f9fa', minHeight: '200px' }}>
                {formData.thumbnail ? (
                  <img src={formData.thumbnail} alt="Course Thumbnail" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', marginBottom: '16px' }} />
                ) : (
                  <div style={{ color: '#6a6f73', marginBottom: '16px' }}>No image uploaded</div>
                )}
                
                <input
                  type="file"
                  id="thumbnail-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="thumbnail-upload" style={{
                    display: 'flex', alignItems: 'center', gap: '8px', cursor: uploadingImage ? 'not-allowed' : 'pointer', 
                    padding: '8px 16px', border: '1px solid #1c1d1f', borderRadius: '0',
                    fontWeight: 700, backgroundColor: 'transparent', 
                    opacity: uploadingImage ? 0.7 : 1
                }}>
                    {uploadingImage ? <Loader2 className="spinner" size={16} /> : <Upload size={16} />}
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </label>
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Course Title</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #1c1d1f', fontSize: '15px' }}
              maxLength={60}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Course Subtitle / Short Description</label>
            <input 
              type="text" 
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #1c1d1f', fontSize: '15px' }}
              maxLength={120}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Course Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #1c1d1f', fontSize: '15px', minHeight: '150px', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>What will students learn in your course?</label>
              <textarea 
                name="whatYouWillLearn"
                value={formData.whatYouWillLearn}
                onChange={handleChange}
                placeholder="Enter learning objectives, one per line."
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #1c1d1f', fontSize: '15px', minHeight: '120px', resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>What are the requirements or prerequisites for taking your course?</label>
              <textarea 
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Enter requirements, one per line."
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #1c1d1f', fontSize: '15px', minHeight: '120px', resize: 'vertical' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Who is this course for?</label>
              <textarea 
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="Enter target audiences, one per line."
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #1c1d1f', fontSize: '15px', minHeight: '120px', resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Basic Info</label>
              <select 
                name="level"
                value={formData.level}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #1c1d1f', fontSize: '15px', backgroundColor: '#fff', marginBottom: '16px' }}
              >
                <option value="beginner">Beginner Level</option>
                <option value="intermediate">Intermediate Level</option>
                <option value="advanced">Advanced Level</option>
              </select>

              <select 
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #1c1d1f', fontSize: '15px', backgroundColor: '#fff' }}
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1, display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Price (VND)</label>
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #1c1d1f', fontSize: '15px' }}
                  min="0"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px' }}>Sale Price (VND)</label>
                <input 
                  type="number" 
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #1c1d1f', fontSize: '15px' }}
                  min="0"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default InstructorCourseManagePage;
