import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CourseCard from './CourseCard/CourseCard';
import './CourseCarousel.css';

const CourseCarousel = ({ courses = [] }) => {
  const containerRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScrollLimits = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeft(scrollLeft > 5);
      // Math.ceil is used to handle subpixel rendering issues
      setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollLimits);
      // Check limits on mount/resize
      checkScrollLimits();
      window.addEventListener('resize', checkScrollLimits);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScrollLimits);
      window.removeEventListener('resize', checkScrollLimits);
    };
  }, [courses]);

  const handleScroll = (direction) => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      const scrollAmount = clientWidth * 0.75; // Scroll 75% of container width
      containerRef.current.scrollTo({
        left: containerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount),
        behavior: 'smooth',
      });
    }
  };

  if (!courses.length) return null;

  return (
    <div className="course-carousel-wrapper">
      {/* Scroll Arrows */}
      {showLeft && (
        <button
          className="carousel-arrow arrow-left"
          onClick={() => handleScroll('left')}
          aria-label="Scroll Left"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {showRight && (
        <button
          className="carousel-arrow arrow-right"
          onClick={() => handleScroll('right')}
          aria-label="Scroll Right"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Horizontal Carousel Scroller */}
      <div className="course-carousel-container" ref={containerRef}>
        {courses.map((course) => (
          <div className="carousel-item" key={course.id}>
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCarousel;
