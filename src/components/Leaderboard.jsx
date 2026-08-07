import React, { useEffect, useState } from 'react';
import { Trophy, Trash2, Calendar } from 'lucide-react';

export default function Leaderboard({ newScoreRecord = null, onClose }) {
  const [scores, setScores] = useState([]);

  // Load scores on mount
  useEffect(() => {
    const saved = localStorage.getItem('typiverse_leaderboard');
    if (saved) {
      setScores(JSON.parse(saved));
    }
  }, []);

  // Save new score record if supplied
  useEffect(() => {
    if (!newScoreRecord) return;

    setScores((prevScores) => {
      const updated = [...prevScores, { ...newScoreRecord, id: Date.now() }];
      // Sort: highest WPM first, then highest accuracy, then time
      updated.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);
      // Limit to top 10
      const top10 = updated.slice(0, 10);
      localStorage.setItem('typiverse_leaderboard', JSON.stringify(top10));
      return top10;
    });
  }, [newScoreRecord]);

  const clearScores = () => {
    localStorage.removeItem('typiverse_leaderboard');
    setScores([]);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Trophy color="var(--color-yellow)" size={24} />
          High Scores Leaderboard
        </h2>

        <div className="leaderboard-list">
          {scores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-secondary)' }}>
              No scores recorded yet. Time to establish your rank!
            </div>
          ) : (
            scores.map((score, index) => {
              // Highlight top 3
              const rankColor = index === 0 ? 'var(--color-yellow)' : index === 1 ? '#d1d5db' : index === 2 ? '#b45309' : 'var(--color-text-muted)';
              return (
                <div key={score.id || index} className="leaderboard-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="leaderboard-rank" style={{ color: rankColor }}>
                      #{index + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, textTransform: 'capitalize' }}>
                        {score.ageMode === 'kids' ? '👶 Kids Mode' : score.ageMode === 'senior' ? '👵 Accessibility' : '🚀 Cyber racer'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Calendar size={10} />
                        {score.date || 'Just now'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'right' }}>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-cyan)' }}>
                        {score.wpm}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                        WPM
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-green)' }}>
                        {score.accuracy}%
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                        Acc
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          {scores.length > 0 && (
            <button className="button button-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={clearScores}>
              <Trash2 size={16} />
              Reset Board
            </button>
          )}
          <button className="button button-cyan" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
            Back to Typing
          </button>
        </div>
      </div>
    </div>
  );
}
