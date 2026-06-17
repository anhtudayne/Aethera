import { parseList } from '../../utils/helpers';

const TargetAudience = ({ items }) => {
  const list = parseList(items);

  if (!list.length) return null;

  return (
    <div className="detail-text-section">
      <h3 className="detail-section-title">
        Who this course is for:
      </h3>
      <ul className="detail-bullets-list">
        {list.map((item, index) => (
          <li key={index} className="detail-bullet-item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TargetAudience;
