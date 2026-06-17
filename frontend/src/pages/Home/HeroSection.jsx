import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import { ROUTES } from '../../utils/constants';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Nâng tầm tri thức mỗi ngày</span>
          </div>
          <h1 className="hero-title">
            Where Knowledge is Refined & <br />
            <span className="text-gradient">Experience is Elevated</span>
          </h1>
          <p className="hero-description">
            Hành trình học tập của bạn bắt đầu từ đây. Trải nghiệm nền tảng học trực tuyến cao cấp, chọn lọc và tập trung tối đa vào sự tiến bộ của bạn.
          </p>
          <div className="hero-cta-group">
            <Link to={ROUTES.COURSES}>
              <Button variant="primary" size="lg" icon={ArrowRight}>
                Explore Courses
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button variant="secondary" size="lg">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative elements to replace generic placeholders */}
        <div className="hero-visual">
          <div className="hero-visual-blur blur-indigo"></div>
          <div className="hero-visual-blur blur-yellow"></div>
          <div className="hero-visual-card card-1">
            <div className="visual-card-icon">🧠</div>
            <div>
              <h4>Refined Content</h4>
              <p>Chắt lọc tinh túy</p>
            </div>
          </div>
          <div className="hero-visual-card card-2">
            <div className="visual-card-icon">⭐</div>
            <div>
              <h4>Premium Rating</h4>
              <p>Đánh giá vượt trội</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
