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
        setError(err?.message || 'Không thể tải dashboard');
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
        <span>Đang tải dữ liệu...</span>
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
    { label: 'Khóa học đã đăng ký', value: data?.stats?.totalEnrolled ?? 0, icon: BookOpen, modifier: 'enrolled' },
    { label: 'Đã hoàn thành', value: data?.stats?.completedCourses ?? 0, icon: CheckCircle, modifier: 'completed' },
    { label: 'Chứng chỉ', value: data?.stats?.totalCertificates ?? 0, icon: Award, modifier: 'certs' },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <h2>Chào mừng trở lại, {user?.fullName || user?.name || 'Học viên'} 👋</h2>
        <p>Đây là tổng quan hoạt động học tập của bạn.</p>
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
        <h3>Khóa học gần đây</h3>
        <Link to={ROUTES.MY_COURSES}>Xem tất cả <ArrowRight size={14} /></Link>
      </div>
      {data?.coursesInProgress?.length > 0 ? (
        <div className="recent-courses-grid">
          {data.coursesInProgress.map((item) => {
            const course = item.course || {};
            const progress = item.progressPercent ?? 0;
            return (
              <Link key={item.courseId || course.id} to={`/learn/${course.slug || course.id}`} className="recent-course-card">
                <div className="recent-course-title">{course.name}</div>
                <div className="recent-course-instructor">
                  {course.instructor || 'Giảng viên'}
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="progress-text">{progress}% hoàn thành</div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Chưa có khóa học nào"
          description="Bắt đầu hành trình học tập của bạn ngay hôm nay!"
        />
      )}

      {/* Recent Certificates */}
      <div className="section-header">
        <h3>Chứng chỉ gần đây</h3>
        <Link to={ROUTES.CERTIFICATES}>Xem tất cả <ArrowRight size={14} /></Link>
      </div>
      {data?.recentCertificates?.length > 0 ? (
        <div className="recent-certs-grid">
          {data.recentCertificates.map((cert) => {
            const course = cert.course || {};
            return (
              <div key={cert.id} className="recent-cert-card">
                <div className="cert-trophy">🏆</div>
                <div className="cert-course-name">{course.name || 'Chứng chỉ khóa học'}</div>
                <div className="cert-date">
                  Cấp ngày: {new Date(cert.issuedAt || cert.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Award}
          title="Chưa có chứng chỉ"
          description="Hoàn thành khóa học để nhận chứng chỉ đầu tiên!"
        />
      )}
    </div>
  );
};

export default DashboardPage;
