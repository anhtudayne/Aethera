import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import { ROUTES } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';
import './HeroSection.css';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Elevate knowledge every day</span>
          </div>
          <h1 className="hero-title">
            Where Knowledge is Refined & <br />
            <span className="text-gradient">Experience is Elevated</span>
          </h1>
          <p className="hero-description">
            Your learning journey starts here. Experience a premium, curated, and focused e-learning environment tailored for your progress.
          </p>
          <div className="hero-cta-group">
            <Link to={ROUTES.COURSES}>
              <Button variant="primary" size="lg" icon={ArrowRight}>
                Explore Courses
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link to={ROUTES.DASHBOARD}>
                <Button variant="secondary" size="lg">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to={ROUTES.REGISTER}>
                <Button variant="secondary" size="lg">
                  Create Account
                </Button>
              </Link>
            )}
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
              <p>Curated quality</p>
            </div>
          </div>
          <div className="hero-visual-card card-2">
            <div className="visual-card-icon">⭐</div>
            <div>
              <h4>Premium Rating</h4>
              <p>Outstanding reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
