import { useState, useEffect } from 'react';
import './SessionSetup.css';

const WORKER_URL = 'https://tangerine-worker.pacificatch.workers.dev';

function SessionSetup({ isAuthenticated, onSessionStart }) {
  const [lessons, setLessons] = useState([]); // [{ level, lesson }, ...]
  const [selected, setSelected] = useState(new Set()); // Set of "level-lesson" keys
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${WORKER_URL}/api/lessons`)
      .then(r => r.json())
      .then(data => {
        setLessons(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load lessons. Check your connection.');
        setLoading(false);
      });
  }, []);

  function key(level, lesson) {
    return `${level}-${lesson}`;
  }

  function toggle(level, lesson) {
    const k = key(level, lesson);
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(k)) {
        next.delete(k);
      } else {
        next.add(k);
      }
      return next;
    });
  }

  function toggleLevel(level, levelLessons) {
    const allKeys = levelLessons.map(({ lesson }) => key(level, lesson));
    const allSelected = allKeys.every(k => selected.has(k));
    setSelected(prev => {
      const next = new Set(prev);
      if (allSelected) {
        allKeys.forEach(k => next.delete(k));
      } else {
        allKeys.forEach(k => next.add(k));
      }
      return next;
    });
  }

  async function handleStart() {
    if (selected.size === 0) return;
    setStarting(true);

    // Parse selected keys back into { level, lesson } pairs
    const pairs = [...selected].map(k => {
      const [level, lesson] = k.split('-').map(Number);
      return { level, lesson };
    });

    try {
      // Fetch vocabulary for all selected lessons in parallel
      const results = await Promise.all(
        pairs.map(({ level, lesson }) =>
          fetch(`${WORKER_URL}/api/vocabulary?level=${level}&lesson=${lesson}`)
            .then(r => r.json())
        )
      );
      const vocabulary = results.flat();

      // Create session record if authenticated
      let sessionId = null;
      if (isAuthenticated) {
        const levels = [...new Set(pairs.map(p => p.level))];
        const lessonNums = pairs.map(p => p.lesson);
        const res = await fetch(`${WORKER_URL}/api/session/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ levels, lessons: lessonNums }),
        });
        const data = await res.json();
        sessionId = data.sessionId;
      }

      onSessionStart({ vocabulary, sessionId, pairs });
    } catch {
      setError('Failed to start session. Please try again.');
      setStarting(false);
    }
  }

  // Group lessons by level
  const byLevel = lessons.reduce((acc, { level, lesson }) => {
    if (!acc[level]) acc[level] = [];
    acc[level].push(lesson);
    return acc;
  }, {});

  if (loading) {
    return <div className="session-setup"><p className="session-loading">Loading lessons...</p></div>;
  }

  if (error) {
    return <div className="session-setup"><p className="session-error">{error}</p></div>;
  }

  return (
    <div className="session-setup">
      <h3>Choose Lessons to Practice</h3>
      <p className="session-subtitle">
        {isAuthenticated
          ? 'Your progress will be recorded.'
          : 'Guest mode — progress will not be recorded.'}
      </p>

      {Object.entries(byLevel).map(([level, levelLessons]) => {
        const allSelected = levelLessons.every(l => selected.has(key(level, l)));
        return (
          <div key={level} className="level-group">
            <div className="level-header">
              <span className="level-label">Level {level}</span>
              <button
                className="btn-select-all"
                onClick={() => toggleLevel(Number(level), levelLessons.map(l => ({ lesson: l })))}
              >
                {allSelected ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            <div className="lesson-grid">
              {levelLessons.map(lesson => {
                const k = key(level, lesson);
                return (
                  <label key={k} className={`lesson-checkbox ${selected.has(k) ? 'checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selected.has(k)}
                      onChange={() => toggle(Number(level), lesson)}
                    />
                    Lesson {lesson}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="session-footer">
        <span className="session-count">
          {selected.size === 0
            ? 'No lessons selected'
            : `${selected.size} lesson${selected.size > 1 ? 's' : ''} selected`}
        </span>
        <button
          className="btn-primary"
          onClick={handleStart}
          disabled={selected.size === 0 || starting}
        >
          {starting ? 'Loading words...' : 'Start Session'}
        </button>
      </div>
    </div>
  );
}

export default SessionSetup;
