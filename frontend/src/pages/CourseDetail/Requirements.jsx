import { parseList } from '../../utils/helpers';

const Requirements = ({ items }) => {
  const list = parseList(items);

  if (!list.length) return null;

  return (
    <div className="detail-text-section">
      <h3 className="detail-section-title">
        Requirements
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

export default Requirements;
