import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { instructorApi } from '../../api/instructorApi';
import useAuth from '../../hooks/useAuth';
import './InstructorDashboardPage.css';

const InstructorDashboardPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const instructorName = user ? `${user.firstName} ${user.lastName}`.trim() : '';
        const response = await instructorApi.getMyCourses({ instructorName });
        if (response && response.data) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch instructor courses', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchCourses();
    }
  }, [user]);

  return (
    <div className="instructor-courses-page">
      <div className="instructor-courses-header">
        <h1 className="instructor-courses-title">Courses</h1>
      </div>

      <div className="instructor-courses-tabs">
        <div className="instructor-tab active">Courses</div>
        <div className="instructor-tab">Course bundles</div>
        <div className="instructor-tab">
          Course cloning <span className="instructor-tab-badge">Beta</span>
        </div>
      </div>

      <div className="instructor-alert">
        <div className="instructor-alert-badge">New</div>
        <div className="instructor-alert-content">
          <h4>We upgraded practice tests so you can upgrade yours.</h4>
          <p>With our creation improvements, new question types, and generative AI features, maximize your practice test's certification prep potential.</p>
          <a href="#" className="instructor-alert-link">Learn more</a>
          <button className="instructor-alert-dismiss">Dismiss</button>
        </div>
      </div>

      <div className="instructor-toolbar">
        <div className="instructor-toolbar-left">
          <div style={{ display: 'flex' }}>
            <input 
              type="text" 
              placeholder="Search your courses" 
              className="instructor-search-input"
            />
            <button className="instructor-search-button">
              <Search size={18} />
            </button>
          </div>
          <select className="instructor-select">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </div>
        <Link to="/instructor/course/create" className="instructor-new-course-btn">New course</Link>
      </div>

      <div className="instructor-courses-list">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <Loader2 className="spinner" size={32} />
          </div>
        ) : courses.length > 0 ? (
          courses.map(course => (
            <div key={course.id} className="instructor-course-card">
              <div className="instructor-course-image">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#6a6f73', fontSize: '12px' }}>No Image</span>
                )}
              </div>
              <div className="instructor-course-info">
                <h3 className="instructor-course-title">{course.name}</h3>
                <div className="instructor-course-status">
                  <span className={course.status === 'public' ? 'status-public' : 'status-draft'}>
                    {course.status ? course.status.toUpperCase() : 'DRAFT'}
                  </span>
                  {course.status === 'public' && <span style={{ color: '#6a6f73', fontWeight: 'normal' }}>Public</span>}
                </div>
              </div>
              <div className="instructor-course-progress" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <Link to={`/instructor/course/${course.slug}/manage`} style={{ textDecoration: 'none', color: '#5624d0', fontWeight: 700 }}>
                  Manage Course
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '64px', border: '1px dashed #d1d7dc' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>No courses yet</h3>
            <p style={{ color: '#6a6f73' }}>Get started by creating your first course.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboardPage;
