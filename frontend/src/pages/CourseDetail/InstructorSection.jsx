import React, { useState, useEffect } from 'react';
import { Star, Award, Users, PlayCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { courseApi } from '../../api/courseApi';
import './InstructorSection.css';

const InstructorSection = ({ instructorName }) => {
  const [instructorInfo, setInstructorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!instructorName) {
      setLoading(false);
      return;
    }

    const fetchInstructor = async () => {
      try {
        const res = await courseApi.getInstructorInfo(instructorName);
        if (res?.data?.data) {
          setInstructorInfo(res.data.data);
        } else if (res?.data) {
          setInstructorInfo(res.data);
        }
      } catch (err) {
        console.error("Failed to load instructor info", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [instructorName]);

  if (loading || !instructorInfo) {
    return null; // or a skeleton loader
  }

  const { name, bio, image, instructorRating, reviewsCount, studentsCount, coursesCount } = instructorInfo;

  return (
    <div className="course-instructor-section">
      <h2 className="course-instructor-title">Instructors</h2>
      <div className="course-instructor-card">
        <a href="#instructor" className="course-instructor-name">{name}</a>
        <p className="course-instructor-subtitle">Expert Instructor at Aethera</p>
        
        <div className="course-instructor-header">
          <div className="course-instructor-avatar-container">
            <img 
              src={image || "https://i.pravatar.cc/150?u=aethera"} 
              alt={name} 
              className="course-instructor-avatar" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://i.pravatar.cc/150?u=fallback";
              }}
            />
          </div>
          
          <ul className="course-instructor-stats">
            <li>
              <Star className="course-instructor-stat-icon" size={16} />
              <span><strong>{instructorRating}</strong> Instructor Rating</span>
            </li>
            <li>
              <Award className="course-instructor-stat-icon" size={16} />
              <span><strong>{reviewsCount?.toLocaleString()}</strong> Reviews</span>
            </li>
            <li>
              <Users className="course-instructor-stat-icon" size={16} />
              <span><strong>{studentsCount?.toLocaleString()}</strong> Students</span>
            </li>
            <li>
              <PlayCircle className="course-instructor-stat-icon" size={16} />
              <span><strong>{coursesCount}</strong> Courses</span>
            </li>
          </ul>
        </div>

        <div className={`course-instructor-bio ${expanded ? 'expanded' : ''}`}>
          <div dangerouslySetInnerHTML={{ __html: bio }} />
        </div>
        
        <button 
          className="course-instructor-more-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>Show less <ChevronUp size={16} /></>
          ) : (
            <>Show more <ChevronDown size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default InstructorSection;
