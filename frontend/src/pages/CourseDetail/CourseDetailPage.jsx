import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { courseApi } from '../../api/courseApi';
import { normalizeCourse } from '../../utils/helpers';
import CourseHero from './CourseHero';
import PriceCard from './PriceCard';
import WhatYouWillLearn from './WhatYouWillLearn';
import Requirements from './Requirements';
import TargetAudience from './TargetAudience';
import CurriculumAccordion from './CurriculumAccordion';
import ReviewsList from './ReviewsList';
import InstructorSection from './InstructorSection';
import RelatedCourses from './RelatedCourses';
import FreePreviewModal from './FreePreviewModal';
import CourseComments from '../../components/common/CourseComments/CourseComments';
import VideoChatbox from '../../components/CoursePlayer/VideoChatbox';
import useAuth from '../../hooks/useAuth';
import './CourseDetailPage.css';

const CourseDetailPage = () => {
  const { slug } = useParams();
  
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  // Preview Modal States
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const detailsRes = await courseApi.getBySlug(slug);
        const detailsData = detailsRes?.data || detailsRes;
        
        if (!detailsData || (detailsData.status && !detailsData.id)) {
          setError('Course not found');
          setLoading(false);
          return;
        }

        setCourse(normalizeCourse(detailsData));

        // Fetch curriculum outline
        const currRes = await courseApi.getCurriculum(slug);
        const currData = currRes?.data?.sections || currRes?.sections || currRes?.curriculum || currRes?.data?.curriculum || [];
        setCurriculum(Array.isArray(currData) ? currData : []);

        // Increment course view counts
        try {
          await courseApi.incrementView(detailsData.id);
        } catch {
          // ignore increment error
        }

        // Check enrollment if authenticated
        if (isAuthenticated) {
          try {
            const enrollRes = await courseApi.checkEnrollment(slug);
            const enrolled = typeof enrollRes === 'boolean' ? enrollRes : (enrollRes?.enrolled ?? enrollRes?.data?.enrolled ?? false);
            setIsEnrolled(enrolled);
          } catch (e) {
            console.error('Lỗi check enroll:', e);
          }
        }

      } catch (err) {
        console.error('Failed to load course details:', err);
        setError(err?.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [slug, isAuthenticated]);

  const handleOpenPreview = (lesson) => {
    setSelectedLesson(lesson);
    setPreviewOpen(true);
  };

  const handleOpenGeneralPreview = () => {
    // Look for first free preview lesson in the entire curriculum
    let firstPreview = null;
    for (const section of curriculum) {
      const lessons = section.Lessons || section.lessons || [];
      const found = lessons.find(l => l.isFreePreview || l.is_free_preview);
      if (found) {
        firstPreview = found;
        break;
      }
    }
    if (firstPreview) {
      setSelectedLesson(firstPreview);
      setPreviewOpen(true);
    } else {
      // If none found, show first lesson if available
      const firstSection = curriculum[0];
      const lessons = firstSection?.Lessons || firstSection?.lessons || [];
      if (lessons[0]) {
        setSelectedLesson(lessons[0]);
        setPreviewOpen(true);
      } else {
        alert('No preview video available for this course.');
      }
    }
  };

  if (loading) {
    return (
      <div className="course-detail-loading">
        <Loader2 className="animate-spin" size={48} />
        <span>Loading course syllabus...</span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h3>Failed to load course</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>{error || 'Course does not exist.'}</p>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      {/* Hero Header */}
      <CourseHero course={course} />

      <div className="container course-detail-body">
        {/* Main Left Section */}
        <div className="course-detail-main">
          <WhatYouWillLearn items={course.whatYouWillLearn} />
          
          <CurriculumAccordion 
            curriculum={curriculum} 
            onSelectPreview={handleOpenPreview} 
          />

          <Requirements items={course.requirements} />
          <TargetAudience items={course.targetAudience} />

          <InstructorSection instructorName={course.instructor} />

          <ReviewsList 
            courseId={course.id} 
            averageRating={course.averageRating} 
            reviewsCount={course.reviewsCount} 
            isEnrolled={isEnrolled}
          />

          {/* Render CourseComments if enrolled */}
          {isEnrolled && (
            <CourseComments courseId={course.id} />
          )}

          <RelatedCourses courseId={course.id} />
        </div>

        {/* Sticky Right Side Card */}
        <div className="course-detail-sidebar">
          <PriceCard 
            course={course} 
            onOpenPreview={handleOpenGeneralPreview}
            initialEnrolled={isEnrolled}
          />
          
          {/* Chatbox hiển thị tạm thời để test */}
          <div style={{ marginTop: '24px' }}>
            <VideoChatbox lessonId={1} />
          </div>
        </div>
      </div>

      {/* Free Preview Video Popup */}
      <FreePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        lesson={selectedLesson}
        courseTitle={course.title}
      />
    </div>
  );
};

export default CourseDetailPage;
