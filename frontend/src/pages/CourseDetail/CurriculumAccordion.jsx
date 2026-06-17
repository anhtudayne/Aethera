import { useState } from 'react';
import { ChevronDown, ChevronUp, PlayCircle, Lock } from 'lucide-react';
import { formatDuration } from '../../utils/helpers';

const CurriculumAccordion = ({ curriculum = [], onSelectPreview }) => {
  const [expandedSections, setExpandedSections] = useState({ 0: true }); // Expand first section by default

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!curriculum || !curriculum.length) {
    return (
      <div style={{ padding: '20px', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
        No curriculum outline available for this course yet.
      </div>
    );
  }

  return (
    <div className="curriculum-accordion-wrapper">
      <h3 className="detail-section-title">
        Course Curriculum
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {curriculum.map((section, sIndex) => {
          const isExpanded = !!expandedSections[sIndex];
          const lessons = section.Lessons || section.lessons || [];
          
          return (
            <div
              key={section.id || sIndex}
              className="accordion-section-card"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(sIndex)}
                className="accordion-header-button"
              >
                <div className="accordion-header-details">
                  <span>{section.title}</span>
                  <span className="accordion-header-meta">
                    {lessons.length} lessons • {section.totalDurationFormatted || section.totalDuration || `${lessons.reduce((acc, l) => acc + (l.duration || 0), 0)}s`}
                  </span>
                </div>
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {/* Lessons List */}
              {isExpanded && (
                <div className="accordion-lessons-list">
                  {lessons.length > 0 ? (
                    lessons.map((lesson, lIndex) => {
                      const isPreview = lesson.isFreePreview || lesson.is_free_preview;
                      return (
                        <div
                          key={lesson.id || lIndex}
                          className="lesson-row-item"
                        >
                          <div className="lesson-left-col">
                            {isPreview ? (
                              <PlayCircle size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                            ) : (
                              <Lock size={14} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
                            )}
                            <span>{lesson.title}</span>
                          </div>

                          <div className="lesson-right-col">
                            {isPreview && (
                              <button
                                onClick={() => onSelectPreview(lesson)}
                                className="lesson-preview-pill"
                              >
                                Preview
                              </button>
                            )}
                            <span className="lesson-duration-badge">
                              {formatDuration(lesson.duration)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      No lectures in this section yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurriculumAccordion;
