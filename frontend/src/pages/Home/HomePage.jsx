import HeroSection from './HeroSection';
import FeaturedCourses from './FeaturedCourses';
import CategoryGrid from './CategoryGrid';
import NewArrivals from './NewArrivals';
import BestSellers from './BestSellers';
import TopViewed from './TopViewed';
import StatsSection from './StatsSection';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page-container">
      <HeroSection />
      <FeaturedCourses />
      <CategoryGrid />
      <NewArrivals />
      <BestSellers />
      <StatsSection />
      <TopViewed />
    </div>
  );
};

export default HomePage;
