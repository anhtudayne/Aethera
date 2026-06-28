import React, { useEffect, useState } from 'react';
import { userApi } from '../../../api/userApi';
import { Flame, Check, Info } from 'lucide-react';
import './LearningStreak.css';

const LearningStreak = () => {
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await userApi.getStreak();
        // Update visit for today's login if not already (or is handled implicitly by the backend, we can call log activity 0 minutes)
        const logRes = await userApi.logStreakActivity(0); 
        setStreakData(logRes.data?.data || logRes.data);
      } catch (error) {
        console.error('Failed to load streak data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStreak();
  }, []);

  if (loading || !streakData) return null;

  const { streakWeeks = 0, weeklyVisits = 0, weeklyMinutes = 0 } = streakData;
  const targetMinutes = 30;
  const targetVisits = 1;

  const isVisitGoalMet = weeklyVisits >= targetVisits;
  const isTimeGoalMet = weeklyMinutes >= targetMinutes;

  // Calculate % for circle
  const percentMinutes = Math.min((weeklyMinutes / targetMinutes) * 100, 100);
  const circleCircumference = 2 * Math.PI * 24; // r=24
  const strokeDashoffset = circleCircumference - (percentMinutes / 100) * circleCircumference;

  // Render date (eg: Jun 21 - 27)
  const now = new Date();
  const d = new Date(now);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(d.setDate(diff));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const options = { month: 'short', day: 'numeric' };
  const dateRangeStr = `${startOfWeek.toLocaleDateString('en-US', options)} - ${endOfWeek.toLocaleDateString('en-US', options)}`;

  return (
    <div className="learning-streak-card">
      <div className="streak-left">
        <h3 className="streak-title">Start a weekly streak</h3>
        <p className="streak-subtitle">
          {streakWeeks > 0 ? `You're on a ${streakWeeks}-week streak! Keep it up.` : 'One ring down! Now, watch your course(s).'}
        </p>
      </div>
      
      <div className="streak-right">
        {/* Flame Icon + Weeks */}
        <div className="streak-stats">
          <div className={`streak-icon-wrapper ${streakWeeks > 0 ? 'active' : ''}`}>
            <Flame size={32} className="flame-icon" />
          </div>
          <div className="streak-text-group">
            <span className="streak-value">{streakWeeks}</span>
            <span className="streak-label">weeks<br />Current streak</span>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="streak-progress">
          <div className="progress-ring-wrapper">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="24" fill="none" stroke="#e0e0e0" strokeWidth="6" />
              <circle 
                cx="30" cy="30" r="24" fill="none" 
                stroke="#1e3a8a" strokeWidth="6" 
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 30 30)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div className="progress-ring-inner">
              {isVisitGoalMet && isTimeGoalMet ? (
                 <div className="progress-completed-dot"></div>
              ) : (
                 <div className="progress-inner-dot"></div>
              )}
            </div>
          </div>
        </div>

        {/* Stats details */}
        <div className="streak-details">
          <div className="streak-detail-item">
            <div className={`status-dot ${isTimeGoalMet ? 'met' : 'unmet'}`}></div>
            <span>{weeklyMinutes}/{targetMinutes} course min</span>
          </div>
          <div className="streak-detail-item">
            <div className={`status-dot ${isVisitGoalMet ? 'met' : 'unmet'}`}></div>
            <span>{weeklyVisits}/{targetVisits} visit</span>
          </div>
          <div className="streak-date-range">
            {dateRangeStr}
          </div>
        </div>

        <button className="info-btn" title="Information about Learning Streak">
          <Info size={16} />
        </button>
      </div>
    </div>
  );
};

export default LearningStreak;
