import React from 'react';
import { Award, Target, Zap, Clock } from 'lucide-react';

export default function StatsDashboard({ wpm, accuracy, streak, timeLeft, activeMode }) {
  // Map values for aesthetic visualization
  const getStreakColor = () => {
    if (streak > 20) return 'var(--color-pink)';
    if (streak > 10) return 'var(--color-yellow)';
    return 'var(--color-cyan)';
  };

  return (
    <div className="stats-row glass-panel">
      {/* WPM Stat */}
      <div className="stat-item">
        <div className="stat-value" style={{ color: 'var(--color-cyan)', textShadow: '0 0 10px var(--color-cyan-glow)' }}>
          {wpm}
        </div>
        <div className="stat-label">
          <Award size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
          WPM
        </div>
      </div>

      {/* Accuracy Stat */}
      <div className="stat-item">
        <div className="stat-value" style={{ color: 'var(--color-green)', textShadow: '0 0 10px var(--color-green-glow)' }}>
          {accuracy}%
        </div>
        <div className="stat-label">
          <Target size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
          Accuracy
        </div>
      </div>

      {/* Streak Stat */}
      <div className="stat-item">
        <div className="stat-value" style={{ color: getStreakColor(), textShadow: `0 0 10px ${getStreakColor()}80`, transform: streak > 10 ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.2s ease' }}>
          {streak}
        </div>
        <div className="stat-label">
          <Zap size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
          Streak
        </div>
      </div>

      {/* Time Left */}
      <div className="stat-item">
        <div className="stat-value" style={{ color: timeLeft < 10 ? 'var(--color-pink)' : 'var(--color-primary)' }}>
          {timeLeft}s
        </div>
        <div className="stat-label">
          <Clock size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
          Time Left
        </div>
      </div>
    </div>
  );
}
