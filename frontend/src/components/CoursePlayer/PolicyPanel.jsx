import React from 'react';
import { ChevronLeft, Sparkles, Lightbulb, Zap, MessageCircle } from 'lucide-react';

const PolicyPanel = ({ show, onClose }) => {
  return (
    <div className={`history-slideover ${show ? 'open' : ''}`}>
      <div className="history-header">
        <button className="back-btn" onClick={onClose}>
          <ChevronLeft size={20} />
        </button>
        <h4>Introduction & Policies</h4>
        <div style={{ width: 24 }}></div>
      </div>
      
      <div className="history-body policy-body">
        <div className="policy-icon">
          <Sparkles size={28} />
        </div>
        <h3 className="policy-title">Hello, I'm Teacher Bee AI!</h3>
        <p className="policy-desc">
          I will accompany you throughout your learning journey. With artificial intelligence and the ability to deeply understand and analyze lecture content, I can help you with:
        </p>
        
        <div className="features-list">
          <div className="feature-item">
            <Lightbulb className="feature-icon" size={18} color="#FBBF24" />
            <span>Summarizing lesson content and explaining with visual examples.</span>
          </div>
          <div className="feature-item">
            <Zap className="feature-icon" size={18} color="#34D399" />
            <span>Guiding you through exercises, suggesting answers and practices to improve your weak points.</span>
          </div>
          <div className="feature-item">
            <MessageCircle className="feature-icon" size={18} color="#60A5FA" />
            <span>Interacting with you up to <strong>25 times/hour</strong>, providing 1-on-1 Q&A just like studying directly with an instructor.</span>
          </div>
        </div>
        
        <p className="policy-footer">
          Every lesson will become more effective and enjoyable when you actively explore knowledge and discuss concepts with your virtual teacher!
        </p>
      </div>
    </div>
  );
};

export default PolicyPanel;
