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
          I will accompany you throughout the learning process. With artificial intelligence and the ability to understand and analyze lecture content in depth, I can help you:
        </p>
        
        <div className="features-list">
          <div className="feature-item">
            <Lightbulb className="feature-icon" size={18} color="#FBBF24" />
            <span>Summarize and summarize the lesson content, explain with visual examples.</span>
          </div>
          <div className="feature-item">
            <Zap className="feature-icon" size={18} color="#34D399" />
            <span>Instructions for doing the test, suggested answers and types of exercises to properly improve the weak points in your test.</span>
          </div>
          <div className="feature-item">
            <MessageCircle className="feature-icon" size={18} color="#60A5FA" />
            <span>Talk to you <strong>25 turns/hour</strong>, helps you ask and answer 1-1 like studying directly with a lecturer.</span>
          </div>
        </div>
        
        <p className="policy-footer">
          Each class session will become more effective and interesting when you actively explore knowledge and have all problems suggested to you by the virtual teacher!
        </p>
      </div>
    </div>
  );
};

export default PolicyPanel;
