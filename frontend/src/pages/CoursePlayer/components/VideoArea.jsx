import { useState, useRef, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { learningApi } from '../../../api/learningApi';

const VideoArea = ({ lesson }) => {
  const videoRef = useRef(null);
  
  // Tracking states
  const [furthestWatchedTime, setFurthestWatchedTime] = useState(0);
  const [showCheatWarning, setShowCheatWarning] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
  const [showCompletionConfirm, setShowCompletionConfirm] = useState(false);
  const [showAlreadyCompleted, setShowAlreadyCompleted] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  
  const lastTimeRef = useRef(0);
  const isSeekingRef = useRef(false);

  // Reset tracking when lesson changes
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (lesson) {
      setFurthestWatchedTime(lesson.lastWatchedPosition || 0);
      setShowCheatWarning(false);
      setShowIncompleteWarning(false);
      setShowCompletionConfirm(false);
      setShowAlreadyCompleted(false);
      setHasCompleted(lesson.isCompleted || false);
      lastTimeRef.current = lesson.lastWatchedPosition || 0;
      
      // If we have a previous position, we might want to start from there
      if (videoRef.current && lesson.lastWatchedPosition > 0) {
        videoRef.current.currentTime = lesson.lastWatchedPosition;
      }
    }
  }, [lesson]);

  // Sync progress to backend every 10 seconds
  useEffect(() => {
    if (!lesson) return;
    
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        learningApi.updateWatchPosition(lesson.id, videoRef.current.currentTime)
          .catch(err => console.error("Failed to sync video position", err));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [lesson]);

  const handleTimeUpdate = () => {
    if (!videoRef.current || isSeekingRef.current) return;
    
    const currentTime = videoRef.current.currentTime;
    
    // Check for cheat (jump > 10 seconds ahead of furthest watched)
    if (currentTime > furthestWatchedTime + 10) {
      videoRef.current.pause();
      setShowCheatWarning(true);
      return;
    }

    // Normal playback, update furthest watched
    if (currentTime > furthestWatchedTime) {
      setFurthestWatchedTime(currentTime);
    }
    
    lastTimeRef.current = currentTime;
  };

  const handleSeeking = () => {
    isSeekingRef.current = true;
  };

  const handleSeeked = () => {
    isSeekingRef.current = false;
    if (!videoRef.current) return;
    
    const currentTime = videoRef.current.currentTime;
    // After seeking, if they jumped too far ahead:
    if (currentTime > furthestWatchedTime + 10) {
      videoRef.current.pause();
      setShowCheatWarning(true);
    }
  };

  const handleEnded = async () => {
    if (!videoRef.current) return;
    
    // If they already completed it, just show the replay overlay
    if (hasCompleted) {
      setShowAlreadyCompleted(true);
      return;
    }
    
    const duration = videoRef.current.duration;
    
    // Check if they watched at least 90%
    if (furthestWatchedTime >= duration * 0.9) {
      setShowCompletionConfirm(true);
    } else {
      setShowIncompleteWarning(true);
    }
  };

  const confirmCompletion = async () => {
    try {
      await learningApi.markLessonComplete(lesson.id);
      setHasCompleted(true);
      setShowCompletionConfirm(false);
    } catch (error) {
      console.error("Error recording lesson completion", error);
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setShowCompletionConfirm(false);
      setShowAlreadyCompleted(false);
      videoRef.current.play();
    }
  };

  const handleRewindToValid = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = furthestWatchedTime;
      setShowCheatWarning(false);
      videoRef.current.play();
    }
  };

  if (!lesson) {
    return (
      <div className="w-full bg-black aspect-video flex items-center justify-center text-white">
        <div className="animate-pulse">Loading video...</div>
      </div>
    );
  }

  if (lesson.type !== 'video' || !lesson.videoUrl) {
    return (
      <div className="w-full bg-black aspect-video flex flex-col items-center justify-center text-white p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
        <p className="text-gray-400">This lesson does not have a video available.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-black aspect-video relative group flex flex-col">
      <video 
        ref={videoRef}
        src={lesson.videoUrl} 
        controls 
        className="w-full h-full object-contain"
        autoPlay
        controlsList="nodownload"
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleSeeking}
        onSeeked={handleSeeked}
        onEnded={handleEnded}
      />
      
      {/* Cheat Warning Overlay */}
      {showCheatWarning && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-10 backdrop-blur-sm">
          <AlertTriangle size={48} className="text-yellow-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Fast Forward Detection (Cheating)</h3>
          <p className="text-gray-300 mb-6 max-w-md text-center">
            The system detects that you have skipped past unwatched content. To ensure learning quality, please do not rewind more than 10 seconds.
          </p>
          <button 
            onClick={handleRewindToValid}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors"
          >
            Back to the valid time
          </button>
        </div>
      )}

      {/* Incomplete Warning Overlay */}
      {showIncompleteWarning && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-10 backdrop-blur-sm">
          <AlertTriangle size={48} className="text-red-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Not yet eligible for completion</h3>
          <p className="text-gray-300 mb-6 max-w-md text-center">
            You've fast forwarded to the end of the video but the total actual viewing time hasn't reached 90%. This lesson will not be counted as completed.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowIncompleteWarning(false)}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold transition-colors"
            >
              Đóng
            </button>
            <button 
              onClick={() => {
                setShowIncompleteWarning(false);
                handleRewindToValid();
              }}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors"
            >
              Học lại đoạn bị thiếu
            </button>
          </div>
        </div>
      )}

      {/* Completion Confirm Overlay */}
      {showCompletionConfirm && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-10 backdrop-blur-sm animate-in fade-in">
          <CheckCircle size={56} className="text-green-500 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Congratulation!</h3>
          <p className="text-gray-300 mb-8 max-w-md text-center text-lg">
            You have watched this lesson in its entirety. Do you want to mark the lesson as complete to continue your progress?
          </p>
          <div className="flex gap-4">
            <button 
              onClick={handleReplay}
              className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors border border-gray-600"
            >
              Review the lesson
            </button>
            <button 
              onClick={confirmCompletion}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors shadow-lg shadow-green-900/50"
            >
              Mark complete
            </button>
          </div>
        </div>
      )}

      {/* Already Completed Overlay */}
      {showAlreadyCompleted && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-10 backdrop-blur-sm animate-in fade-in">
          <CheckCircle size={56} className="text-blue-500 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Lesson completed</h3>
          <p className="text-gray-300 mb-8 max-w-md text-center text-lg">
            You have finished watching the video for this lesson. Do you want to watch it again from the beginning?
          </p>
          <button 
            onClick={handleReplay}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-900/50"
          >
            Review the lesson
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoArea;
