import React from 'react';
import { ChevronLeft, Sparkles, Lightbulb, Zap, MessageCircle } from 'lucide-react';

const PolicyPanel = ({ show, onClose }) => {
  return (
    <div className={`history-slideover ${show ? 'open' : ''}`}>
      <div className="history-header">
        <button className="back-btn" onClick={onClose}>
          <ChevronLeft size={20} />
        </button>
        <h4>Giới thiệu & Chính sách</h4>
        <div style={{ width: 24 }}></div>
      </div>
      
      <div className="history-body policy-body">
        <div className="policy-icon">
          <Sparkles size={28} />
        </div>
        <h3 className="policy-title">Xin chào, mình là Teacher Bee AI!</h3>
        <p className="policy-desc">
          Mình sẽ đồng hành cùng bạn trong suốt quá trình học tập. Với trí tuệ nhân tạo cùng khả năng hiểu và phân tích chuyên sâu nội dung bài giảng, mình có thể giúp bạn:
        </p>
        
        <div className="features-list">
          <div className="feature-item">
            <Lightbulb className="feature-icon" size={18} color="#FBBF24" />
            <span>Tóm lược và tổng kết nội dung bài học, giải thích bằng ví dụ trực quan.</span>
          </div>
          <div className="feature-item">
            <Zap className="feature-icon" size={18} color="#34D399" />
            <span>Hướng dẫn làm bài, gợi ý đáp án và các dạng bài tập để cải thiện đúng các điểm yếu trong bài của bạn.</span>
          </div>
          <div className="feature-item">
            <MessageCircle className="feature-icon" size={18} color="#60A5FA" />
            <span>Trao đổi với bạn <strong>25 lượt/giờ</strong>, giúp bạn hỏi đáp 1-1 như học trực tiếp với giảng viên.</span>
          </div>
        </div>
        
        <p className="policy-footer">
          Mỗi buổi học sẽ trở nên hiệu quả và thú vị hơn khi bạn chủ động khai phá kiến thức và được gợi mở mọi vấn đề với giáo viên ảo đấy!
        </p>
      </div>
    </div>
  );
};

export default PolicyPanel;
