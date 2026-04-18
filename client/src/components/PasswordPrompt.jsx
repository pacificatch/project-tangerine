import { useState } from 'react';
import './PasswordPrompt.css';

const WORKER_URL = 'https://tangerine-worker.pacificatch.workers.dev';

function PasswordPrompt({ onAuthenticated, onSkip }) {
  const [password, setPassword] = useState('');
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!password.trim()) {
      onSkip();
      return;
    }

    setChecking(true);
    try {
      const res = await fetch(`${WORKER_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.authenticated) {
        onAuthenticated();
      } else {
        onSkip();
      }
    } catch {
      onSkip();
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="password-overlay">
      <div className="password-modal">
        <div className="password-icon">🍊</div>
        <h2>Welcome to Tangerine</h2>
        <p>Enter your password to record your progress, or skip to practice without saving results.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn-primary" disabled={checking}>
            {checking ? 'Checking...' : 'Continue'}
          </button>
        </form>

        <button className="btn-skip" onClick={onSkip}>
          Skip — practice without saving
        </button>
      </div>
    </div>
  );
}

export default PasswordPrompt;
