import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import './EmptyState.css';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionLink,
}) => {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-state-icon-wrapper">
          <Icon className="empty-state-icon" size={48} />
        </div>
      )}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      
      {(actionLabel && (actionLink || onAction)) && (
        <div className="empty-state-action">
          {actionLink ? (
            <Link to={actionLink}>
              <Button variant="primary">{actionLabel}</Button>
            </Link>
          ) : (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
