import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { learningApi } from '../../api/learningApi';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import LearningStreak from '../../components/common/LearningStreak/LearningStreak';
import './MyCoursesPage.css';

const STATUS_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'in-progress', label: 'Đang học' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'not-started', label: 'Chưa bắt đầu' },
];

const SORT_OPTIONS = [
  { key: 'recent', label: 'Gần đây nhất' },
  { key: 'enrolled', label: 'Ngày đăng ký' },
  { key: 'a-z', label: 'A → Z' },
  { key: 'progress', label: 'Tiến độ' },
];

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('recent');
  const [page] = useState(1);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await learningApi.getMyCourses({ status, sort, page, limit: 12 });
        const courseList = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setCourses(courseList);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [status, sort, page]);

  const getStatusModifier = (progress) => {
    if (progress >= 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'not-started';
  };

  const getStatusLabel = (progress) => {
    if (progress >= 100) return 'Hoàn thành';
    if (progress > 0) return 'Đang học';
    return 'Chưa bắt đầu';
  };

  return (
    <div className="my-courses-page">
      <LearningStreak />
      
      <div className="my-courses-header">
        <h2>Khóa học của tôi</h2>
        <div className="sort-dropdown">
          <label>Sắp xếp:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs" style={{ marginBottom: 'var(--space-xl)' }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`filter-tab ${status === tab.key ? 'filter-tab--active' : ''}`}
            onClick={() => setStatus(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <span>Đang tải...</span>
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Chưa có khóa học nào"
          description="Khám phá và đăng ký khóa học để bắt đầu hành trình học tập!"
        />
      ) : (
        <div className="enrolled-courses-grid">
          {courses.map((item) => {
            const course = item.course || {};
            const progress = item.progressPercent ?? 0;
            const statusMod = getStatusModifier(progress);
            return (
              <div key={item.enrollmentId || course.id} className="enrolled-course-card">
                {course.thumbnail && (
                  <img src={course.thumbnail} alt={course.name} className="enrolled-card-image" />
                )}
                <div className="enrolled-card-body">
                  <div className="enrolled-card-title">{course.name}</div>
                  <div className="enrolled-card-instructor">
                    {course.instructor || 'Giảng viên'}
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="enrolled-card-footer">
                    <span className="progress-text">{progress}% hoàn thành</span>
                    <span className={`status-badge status-badge--${statusMod}`}>{getStatusLabel(progress)}</span>
                  </div>
                  <div style={{ marginTop: 'var(--space-sm)' }}>
                    <Link to={`/learn/${course.slug || course.id}`} className="continue-btn">
                      Tiếp tục <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
