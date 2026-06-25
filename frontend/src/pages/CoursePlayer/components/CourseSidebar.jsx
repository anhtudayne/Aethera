import { useState } from 'react';
import { ChevronDown, ChevronUp, PlayCircle, CheckSquare, Square, X } from 'lucide-react';

const CourseSidebar = ({ curriculum, activeLessonId, setActiveLessonId, onClose }) => {
  const [expandedSections, setExpandedSections] = useState([0]); // First section open by default

  const toggleSection = (index) => {
    setExpandedSections(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="w-full md:w-80 lg:w-[400px] border-l border-gray-200 bg-white flex flex-col h-full z-40 relative">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
        <h2 className="font-bold text-gray-800">Course content</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {(!Array.isArray(curriculum) || curriculum.length === 0) ? (
          <div className="p-4 text-gray-500 text-center">Loading curriculum...</div>
        ) : (
          curriculum.map((section, index) => {
            const isExpanded = expandedSections.includes(index);
            const sectionLessons = section.lessons || section.Lessons;
            const totalLessons = sectionLessons?.length || 0;
            // Mock completion calculation for demo
            const completedLessons = Math.floor(totalLessons * 0.3);
            const sectionDuration = "52min"; // Mock

            return (
              <div key={section.id || index} className="border-b border-gray-200">
                {/* Section Header */}
                <div 
                  className="p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer flex justify-between items-start transition-colors"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-[15px] text-gray-800 line-clamp-2 leading-tight mb-1">
                      Section {index + 1}: {section.title}
                    </h3>
                    <div className="text-xs text-gray-500 flex gap-1">
                      <span>{completedLessons} / {totalLessons}</span>
                      <span>|</span>
                      <span>{sectionDuration}</span>
                    </div>
                  </div>
                  <div className="text-gray-500 mt-1">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Lessons List */}
                {isExpanded && sectionLessons && (
                  <div className="bg-white">
                    {sectionLessons.map((lesson, lIndex) => {
                      const isActive = activeLessonId === lesson.id;
                      const isCompleted = lesson.isCompleted;

                      return (
                        <div 
                          key={lesson.id} 
                          onClick={() => setActiveLessonId(lesson.id)}
                          className={`p-3 pl-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${isActive ? 'bg-[#f7f9fa] border-l-4 border-l-[#a435f0]' : 'border-l-4 border-l-transparent'}`}
                        >
                          <div className="mt-0.5 text-gray-400">
                            {isCompleted ? (
                              <CheckSquare size={16} className="text-[#a435f0]" />
                            ) : (
                              <Square size={16} />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className={`text-sm ${isActive ? 'font-bold' : ''}`}>
                              {lIndex + 1}. {lesson.title}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                              <PlayCircle size={12} />
                              <span>{lesson.duration || '2min'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CourseSidebar;
