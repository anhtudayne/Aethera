import Skeleton from '../common/Skeleton/Skeleton';

const CourseCardSkeleton = () => {
  return (
    <div 
      style={{
        background: 'var(--color-bg-white)',
        border: '1px solid var(--color-border-light)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-1)',
      }}
    >
      {/* Thumbnail shimmer */}
      <Skeleton variant="rect" style={{ width: '100%', aspectRatio: '16/10' }} />
      
      {/* Info shimmer */}
      <div style={{ padding: 'var(--space-md)' }}>
        {/* Level */}
        <Skeleton variant="text" width="60px" height="12px" style={{ marginBottom: '8px' }} />
        
        {/* Title */}
        <Skeleton variant="text" width="90%" height="18px" style={{ marginBottom: '6px' }} />
        <Skeleton variant="text" width="70%" height="18px" style={{ marginBottom: '12px' }} />
        
        {/* Author */}
        <Skeleton variant="text" width="40%" height="12px" style={{ marginBottom: '16px' }} />
        
        {/* Rating */}
        <Skeleton variant="text" width="55%" height="14px" style={{ marginBottom: '20px' }} />
        
        <hr style={{ border: 0, height: '1px', background: 'var(--color-border-light)', marginBottom: '12px' }} />
        
        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width="70px" height="20px" />
          <Skeleton variant="text" width="60px" height="12px" />
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
