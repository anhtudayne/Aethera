import { useState } from 'react';
import { Search, SearchIcon } from 'lucide-react';

import CourseQATab from './CourseQATab';

const TABS = ['Overview', 'Q&A', 'Notes', 'Announcements', 'Reviews', 'Learning tools'];

const CourseTabs = ({ courseId, activeLessonId, isSidebarOpen }) => {
  const [activeTab, setActiveTab] = useState('Q&A');

  return (
    <div className="w-full bg-white mt-2">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex px-4 md:px-8 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 mr-6 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-gray-800 text-gray-800' 
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 md:p-8 max-w-[1000px]">
        {activeTab === 'Q&A' && (
          <CourseQATab courseId={courseId} activeLessonId={activeLessonId} />
        )}

        {activeTab === 'Overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">About this course</h2>
            <p className="text-gray-700">Course description and overview will be displayed here.</p>
          </div>
        )}

        {activeTab === 'Notes' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Notes</h2>
            <p className="text-gray-700">Create and manage your course notes here.</p>
          </div>
        )}

        {/* Other tabs placeholders */}
        {['Announcements', 'Reviews', 'Learning tools'].includes(activeTab) && (
          <div className="text-center py-12 text-gray-500">
            Content for {activeTab} is currently unavailable.
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseTabs;
