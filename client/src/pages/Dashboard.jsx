import { useState, useEffect } from 'react';
import './Dashboard.css';


const WORKER_URL = 'https://tangerine-worker.pacificatch.workers.dev';

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${WORKER_URL}/api/dashboard`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load dashboard. Check your connection.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page"><p className="dash-loading">Loading stats…</p></div>;
  if (error)   return <div className="page"><p className="dash-error">{error}</p></div>;

  const { totalWords, totalSessions, lastSession, accuracy, streak, mostMissed, lessonAccuracy, recentSessions } = data;
  const hasAnswers = accuracy.total > 0;

  return (
    <div className="page dashboard">
      <h2>Dashboard</h2>

      {/* Stat cards */}
      <div className="dash-cards">
        <div className="dash-card">
          <span className="dash-card-number">{totalWords}</span>
          <span className="dash-card-label">words in library</span>
        </div>
        <div className="dash-card">
          <span className="dash-card-number">{totalSessions}</span>
          <span className="dash-card-label">sessions completed</span>
        </div>
        <div className="dash-card">
          <span className="dash-card-number">{streak}</span>
          <span className="dash-card-label">day streak</span>
        </div>
        <div className="dash-card">
          <span className="dash-card-number">{hasAnswers ? `${accuracy.rate}%` : '—'}</span>
          <span className="dash-card-label">lifetime accuracy</span>
        </div>
      </div>

      <div className="dash-meta">Last session: {fmt(lastSession)}</div>

      {/* Accuracy by lesson */}
      {lessonAccuracy.length > 0 && (
        <div className="dash-section">
          <h3>Accuracy by Lesson</h3>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Lesson</th>
                <th>Correct</th>
                <th>Total</th>
                <th>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {lessonAccuracy.map(row => (
                <tr key={`${row.level}-${row.lesson}`}>
                  <td>{row.level}</td>
                  <td>{row.lesson}</td>
                  <td>{row.correct}</td>
                  <td>{row.total}</td>
                  <td>
                    <div className="dash-accuracy-bar">
                      <div
                        className="dash-accuracy-fill"
                        style={{ width: `${Math.round((row.correct / row.total) * 100)}%` }}
                      />
                      <span>{Math.round((row.correct / row.total) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Most missed */}
      {mostMissed.length > 0 && (
        <div className="dash-section">
          <h3>Most Missed</h3>
          <div className="dash-missed-list">
            {mostMissed.map((w, i) => (
              <div key={i} className="dash-missed-item">
                <span className="dash-missed-char">{w.traditional}</span>
                <span className="dash-missed-pinyin">{w.pinyin}</span>
                <span className="dash-missed-def">{w.definition}</span>
                <span className="dash-missed-count">{w.incorrect_count}✗</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <div className="dash-section">
          <h3>Recent Sessions</h3>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Lessons</th>
                <th>Answers</th>
                <th>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map(s => {
                const lessons = JSON.parse(s.lessons || '[]');
                const rate = s.total_answers > 0
                  ? Math.round((s.correct_answers / s.total_answers) * 100)
                  : 0;
                return (
                  <tr key={s.id}>
                    <td>{fmt(s.started_at)}</td>
                    <td>{lessons.map(l => `L${l}`).join(', ')}</td>
                    <td>{s.total_answers}</td>
                    <td>{s.total_answers > 0 ? `${rate}%` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!hasAnswers && (
        <div className="dash-empty">
          Complete a quiz session to see your progress here.
        </div>
      )}
    </div>
  );
}

export default Dashboard;
