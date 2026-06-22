import Skeleton from '../common/Skeleton/Skeleton';

const CourseCardSkeleton = () => {
  return (
    <div 
      style={{
        background: 'var(--color-bg-white)',
        border: '1px solid var(--color-border-light)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Thumbnail shimmer */}
      <Skeleton variant="rect" style={{ width: '100%', aspectRatio: '16/9' }} />
      
      {/* Info shimmer */}
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Title */}
        <Skeleton variant="text" width="90%" height="16px" style={{ marginBottom: '6px' }} />
        <Skeleton variant="text" width="70%" height="16px" style={{ marginBottom: '10px' }} />
        
        {/* Author */}
        <Skeleton variant="text" width="40%" height="12px" style={{ marginBottom: '10px' }} />
        
        {/* Rating */}
        <Skeleton variant="text" width="60%" height="12px" style={{ marginBottom: '10px' }} />
        
        {/* Price */}
        <Skeleton variant="text" width="80px" height="18px" style={{ marginBottom: '10px' }} />
        
        {/* Badges */}
        <div style={{ display: 'flex', gap: '6px', marginTop: 'auto', paddingTop: '4px' }}>
          <Skeleton variant="rect" width="60px" height="18px" style={{ borderRadius: '2px' }} />
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
