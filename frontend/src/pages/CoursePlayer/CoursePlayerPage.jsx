import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { userApi } from '../../api/userApi';
import { courseApi } from '../../api/courseApi';
import { learningApi } from '../../api/learningApi';
import Header from './components/Header';
import CourseSidebar from './components/CourseSidebar';
import VideoArea from './components/VideoArea';
import CourseTabs from './components/CourseTabs';
import VideoChatbox from '../../components/CoursePlayer/VideoChatbox';

export const CoursePlayerPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [courseDetails, setCourseDetails] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState('curriculum');
  
  const activeLesson = useMemo(() => {
    if (!curriculum || curriculum.length === 0) return null;
    for (const section of curriculum) {
      const lessons = section.lessons || section.Lessons || [];
      const lesson = lessons.find(l => l.id === activeLessonId);
      if (lesson) return lesson;
    }
    return null;
  }, [curriculum, activeLessonId]);
  
  const lessonIdParam = searchParams.get('lessonId');

  useEffect(() => {
    const fetchCourseData = async () => {
      if (slug) {
        try {
          // Fetch curriculum (authenticated content with paid video URLs)
          let rawRes = await learningApi.getCourseContent(slug);
          
          // Helper to find deeply an array and parse JSON strings
          const findArray = (obj) => {
            if (!obj) return null;
            if (typeof obj === 'string') {
              try { 
                const parsed = JSON.parse(obj); 
                return findArray(parsed);
              } catch(_) { return null; }
            }
            if (Array.isArray(obj)) return obj;
            if (typeof obj === 'object') {
              if (obj.data) {
                const arr = findArray(obj.data);
                if (arr) return arr;
              }
              for (const key in obj) {
                if (Array.isArray(obj[key])) return obj[key];
              }
            }
            return null;
          };

          let sections = findArray(rawRes) || [];
          setCurriculum(sections);
          
          // Try fetching course details for title (optional, handle gracefully)
          try {
             const detailRes = await courseApi.getBySlug(slug);
             setCourseDetails(detailRes?.data?.data || detailRes?.data || detailRes);
          } catch (e) {
             console.warn('Could not fetch course details', e);
          }

          if (lessonIdParam) {
            setActiveLessonId(parseInt(lessonIdParam, 10));
            return;
          }
          
          let foundLesson = false;
          if (sections && sections.length > 0) {
            for (const section of sections) {
              const sectionLessons = section.lessons || section.Lessons;
              if (sectionLessons && sectionLessons.length > 0) {
                const firstLessonId = sectionLessons[0].id;
                setActiveLessonId(firstLessonId);
                setSearchParams({ lessonId: firstLessonId }, { replace: true });
                foundLesson = true;
                break;
              }
            }
          }
          if (!foundLesson) {
             setActiveLessonId(41);
          }
        } catch (error) {
          console.error('Error loading course data:', error);
          setActiveLessonId(41); // Fallback
        }
      } else {
        setActiveLessonId(41); // Fallback
      }
    };
    
    fetchCourseData();

    // Streak logic
    const logInitialActivity = async () => {
      try {
        await userApi.logStreakActivity(5);
      } catch (err) {
        console.error('Failed to log streak activity', err);
      }
    };
    logInitialActivity();

    const interval = setInterval(() => {
      userApi.logStreakActivity(1).catch(console.error);
    }, 60000);

    return () => clearInterval(interval);
  }, [slug, lessonIdParam, setSearchParams]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
      {/* Header */}
      <Header courseTitle={courseDetails?.title || "Course Title"} progress={0} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Column (Video + Tabs) */}
        <div className={`flex-1 flex flex-col overflow-y-auto ${isSidebarOpen ? 'hidden md:flex' : 'flex'}`}>
          <VideoArea lesson={activeLesson} />
          
          <div className="flex-1">
            <CourseTabs courseId={courseDetails?.id} activeLessonId={activeLessonId} isSidebarOpen={isSidebarOpen} />
          </div>
        </div>

        {/* Right Sidebar Wrapper */}
        {isSidebarOpen && (
          <div className="w-full md:w-80 lg:w-[400px] border-l border-gray-200 bg-white flex flex-col h-full z-40 relative">
            {/* Header Tabs */}
            <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
              <button 
                onClick={() => setActiveRightTab('curriculum')}
                className={`flex-1 py-4 px-2 font-semibold text-sm text-center transition-colors ${activeRightTab === 'curriculum' ? 'text-[#a435f0] border-b-2 border-[#a435f0]' : 'text-gray-500 hover:text-gray-800'}`}
              >
                Course Content
              </button>
              <button 
                onClick={() => setActiveRightTab('chat')}
                className={`flex-1 py-4 px-2 font-semibold text-sm text-center transition-colors flex items-center justify-center gap-2 ${activeRightTab === 'chat' ? 'text-[#a435f0] border-b-2 border-[#a435f0]' : 'text-gray-500 hover:text-gray-800'}`}
              >
                Teacher Bee AI
              </button>
              <button onClick={() => setIsSidebarOpen(false)} className="p-4 text-gray-400 hover:text-gray-800 border-l border-gray-100 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative flex flex-col">
              {activeRightTab === 'curriculum' ? (
                <CourseSidebar 
                  curriculum={curriculum}
                  activeLessonId={activeLessonId}
                  setActiveLessonId={(id) => {
                    setActiveLessonId(id);
                    setSearchParams({ lessonId: id });
                  }}
                  onClose={() => setIsSidebarOpen(false)}
                />
              ) : (
                <VideoChatbox lessonId={activeLessonId || 41} />
              )}
            </div>
          </div>
        )}

        {/* Floating Sidebar Toggle (Visible when sidebar is closed) */}
        {!isSidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="absolute top-4 right-4 z-50 bg-gray-900 text-white p-2 rounded shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2 font-bold"
          >
            <Menu size={20} />
            <span className="hidden md:inline">Menu</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CoursePlayerPage;
