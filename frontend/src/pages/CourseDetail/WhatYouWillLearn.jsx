import { Check } from 'lucide-react';
import { parseList } from '../../utils/helpers';

const WhatYouWillLearn = ({ items }) => {
  const list = parseList(items);

  if (!list.length) return null;

  return (
    <div className="learn-outcomes-container">
      <h3 className="learn-outcomes-title">
        What you'll learn
      </h3>
      <div className="learn-outcomes-grid">
        {list.map((item, index) => (
          <div key={index} className="outcome-item">
            <Check size={16} className="outcome-icon" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatYouWillLearn;
