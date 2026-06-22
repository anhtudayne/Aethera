import ReactPlayer from 'react-player';
import { X, PlayCircle } from 'lucide-react';

const FreePreviewModal = ({ isOpen, onClose, lesson, courseTitle }) => {
  if (!isOpen || !lesson) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '800px',
          background: 'var(--color-bg-white)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-4)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking modal content
      >
        {/* Header */}
        <div 
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--color-border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-bg-secondary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlayCircle size={18} color="var(--color-accent)" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>FREE PREVIEW</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>
                {lesson.title}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'var(--color-border-light)',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-border-light)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Video Player */}
        <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
          {lesson.videoUrl ? (
            lesson.videoUrl.includes('youtube.com') || lesson.videoUrl.includes('youtu.be') ? (
              <ReactPlayer
                url={lesson.videoUrl}
                width="100%"
                height="100%"
                controls
                playing
              />
            ) : (
              <video 
                src={lesson.videoUrl}
                width="100%"
                height="100%"
                controls
                autoPlay
                controlsList="nodownload"
                style={{ objectFit: 'contain', backgroundColor: '#000' }}
              />
            )
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem' }}>
              Preview video is currently unavailable.
            </div>
          )}
        </div>

        {/* Footer info */}
        {courseTitle && (
          <div style={{ padding: '16px 24px', background: 'var(--color-bg-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Course: <strong>{courseTitle}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreePreviewModal;
