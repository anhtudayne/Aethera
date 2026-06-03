import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Check, MessageCircle, PlayCircle, Info, ChevronUp, ChevronDown, Play, FileText
} from 'lucide-react';
import DOMPurify from 'dompurify';
import axios from 'axios';
import Navbar from '../components/Navbar';

const LearningPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');
  const [expandedChapters, setExpandedChapters] = useState([]);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Vui lòng đăng nhập để xem bài học!');
          navigate(`/course/${slug}`);
          return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8089/api';
        
        // Kiểm tra quyền truy cập khóa học
        try {
          const checkRes = await axios.get(`${apiUrl}/courses/${slug}/check-enrollment`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!checkRes.data.data.enrolled) {
            alert('Bạn cần mua khóa học này để có thể xem bài học!');
            navigate(`/course/${slug}`);
            return;
          }
        } catch (error) {
          console.error("Lỗi kiểm tra bản quyền", error);
          alert('Lỗi khi xác thực quyền truy cập khóa học.');
          navigate(`/course/${slug}`);
          return;
        }

        const response = await axios.get(`${apiUrl}/courses/${slug}`);
        const courseData = response.data.data;
        setCourse(courseData);

        if (courseData.sections && courseData.sections.length > 0) {
          setExpandedChapters([courseData.sections[0].id]);
          if (courseData.sections[0].lessons && courseData.sections[0].lessons.length > 0) {
            setActiveLesson(courseData.sections[0].lessons[0]);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu khóa học:", error);
        setError("Đã có lỗi xảy ra khi tải dữ liệu khóa học. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug, navigate]);

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleSelectLesson = (lesson) => {
    setActiveLesson(lesson);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 font-medium">{error}</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center">Không tìm thấy khóa học</div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Top Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">

        {/* LEFT COLUMN: Video Player & Tabs */}
        <div className="flex-1 lg:w-2/3 flex flex-col overflow-y-auto bg-white rounded-xl shadow-sm border border-slate-200">

          <div className="p-4 border-b border-slate-200 bg-white">
            <h1 className="text-xl font-bold text-slate-800">{activeLesson ? activeLesson.title : course.name}</h1>
            {course && <p className="text-sm text-slate-500 mt-1">Khóa học: {course.name}</p>}
          </div>

          {/* Video Player Container */}
          <div className="w-full bg-black aspect-video relative group flex flex-col justify-between">
            {activeLesson && activeLesson.type === 'video' && activeLesson.videoUrl ? (
              <div className="absolute inset-0">
                <video
                  key={activeLesson.id}
                  src={activeLesson.videoUrl}
                  className="w-full h-full object-contain bg-black"
                  controls
                  autoPlay
                />
              </div>
            ) : activeLesson && activeLesson.type === 'text' ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white p-8 overflow-y-auto">
                <div className="prose prose-slate max-w-none text-slate-800" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(activeLesson.content) }} />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <p>Vui lòng chọn bài học</p>
              </div>
            )}
          </div>

          {/* Content Tabs */}
          <div className="flex-1 flex flex-col">
            <div className="border-b border-slate-200 flex overflow-x-auto no-scrollbar">
              {[
                { id: 'description', label: 'Mô tả', icon: Info },
                { id: 'qa', label: 'Hỏi đáp (Q&A)', icon: MessageCircle },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8 bg-white flex-1 min-h-[300px] rounded-b-xl">
              {activeTab === 'description' && (
                <div className="max-w-3xl prose prose-slate">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">{activeLesson ? activeLesson.title : course.name}</h2>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              )}
              {activeTab === 'qa' && (
                <div className="text-center text-slate-500 py-10">
                  <MessageCircle className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p>Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <div className="flex-1 lg:w-1/3 lg:max-w-md bg-white flex flex-col border border-slate-200 rounded-xl shadow-sm h-[calc(100vh-140px)] overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
            <h2 className="font-bold text-slate-800 text-lg">Nội dung khóa học</h2>
          </div>

          <div className="overflow-y-auto flex-1 pb-20 lg:pb-0">
            {course.sections?.map((chapter) => (
              <div key={chapter.id} className="border-b border-slate-200 last:border-0">
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-[15px] text-slate-800">
                      {chapter.title}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 text-slate-400">
                    {expandedChapters.includes(chapter.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {expandedChapters.includes(chapter.id) && (
                  <div className="bg-slate-50/50 pb-2">
                    {chapter.lessons?.map((lesson) => {
                      const isCurrent = activeLesson?.id === lesson.id;
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => handleSelectLesson(lesson)}
                          className={`flex gap-3 p-3 pl-4 sm:pl-6 hover:bg-slate-100 transition-colors cursor-pointer group ${isCurrent ? 'bg-blue-50/80 hover:bg-blue-50/100' : ''}`}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {isCurrent ? <PlayCircle className="w-5 h-5 text-blue-600" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-blue-400"></div>}
                          </div>

                          <div className="flex-1">
                            <p className={`text-sm ${isCurrent ? 'font-semibold text-blue-800' : 'text-slate-700'}`}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {lesson.type === 'video' ? (
                                <Play className="w-3 h-3 text-slate-400" />
                              ) : (
                                <FileText className="w-3 h-3 text-slate-400" />
                              )}
                              {lesson.duration && <span className="text-xs text-slate-500">{lesson.duration}</span>}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default LearningPage;
