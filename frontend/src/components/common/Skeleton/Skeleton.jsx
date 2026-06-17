import clsx from 'clsx';
import './Skeleton.css';

const Skeleton = ({
  className,
  variant = 'rect', // 'circle' | 'text' | 'rect'
  width,
  height,
  ...props
}) => {
  const styles = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={clsx('skeleton-loader', `skeleton-${variant}`, className)}
      style={styles}
      {...props}
    />
  );
};

export default Skeleton;
