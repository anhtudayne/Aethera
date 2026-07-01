import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Award, ArrowRight, Inbox } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import { dashboardApi } from '../../api/dashboardApi';
import { ROUTES } from '../../utils/constants';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await dashboardApi.getDashboard();
        setData(res.data);
      } catch (err) {
        setError(err?.message || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <span>Loading data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={Inbox}
        title="Đã xảy ra lỗi"
        description={error}
      />
    );
  }

  const stats = [
    { label: 'Registered course', value: data?.stats?.totalEnrolled ?? 0, icon: BookOpen, modifier: 'enrolled' },
    { label: 'Completed', value: data?.stats?.completedCourses ?? 0, icon: CheckCircle, modifier: 'completed' },
    { label: 'Certificate', value: data?.stats?.totalCertificates ?? 0, icon: Award, modifier: 'certs' },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <h2>Welcome back, {user?.fullName || user?.name || 'Student'} 👋</h2>
        <p>This is an overview of your study activities.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`stat-card stat-card--${stat.modifier}`}>
              <div className="stat-icon"><Icon size={24} /></div>
              <div className="stat-info">
                <h4>{stat.label}</h4>
                <div className="stat-value">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Courses */}
      <div className="section-header">
        <h3>Recent courses</h3>
        <Link to={ROUTES.MY_COURSES}>See all <ArrowRight size={14} /></Link>
      </div>
      {data?.coursesInProgress?.length > 0 ? (
        <div className="recent-courses-grid">
          {data.coursesInProgress.map((item) => {
            const course = item.course || {};
            const progress = item.progressPercent ?? 0;
            return (
              <Link key={item.courseId || course.id} to={`/learn/${course.slug || course.id}`} className="recent-course-card">
                {course.thumbnail && (
                  <img src={course.thumbnail} alt={course.name} className="recent-course-image" />
                )}
                <div className="recent-course-body">
                  <div className="recent-course-title">{course.name}</div>
                  <div className="recent-course-instructor">
                    {course.instructor || 'Lecturer'}
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="progress-text">{progress}% complete</div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Chưa có khóa học nào"
          description="Start your learning journey today!"
        />
      )}

      {/* Recent Certificates */}
      <div className="section-header">
        <h3>Recent certification</h3>
        <Link to={ROUTES.CERTIFICATES}>See all <ArrowRight size={14} /></Link>
      </div>
      {data?.recentCertificates?.length > 0 ? (
        <div className="recent-certs-grid">
          {data.recentCertificates.map((cert) => {
            const course = cert.course || {};
            return (
              <div key={cert.id} className="recent-cert-card">
                <div className="cert-trophy">🏆</div>
                <div className="cert-course-name">{course.name || 'Course certificate'}</div>
                <div className="cert-date">
                  Issue date: {new Date(cert.issuedAt || cert.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Award}
          title="No certificate yet"
          description="Complete the course to receive your first certificate!"
        />
      )}
    </div>
  );
};

export default DashboardPage;
