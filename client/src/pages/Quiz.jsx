import { useState } from 'react';
import PasswordPrompt from '../components/PasswordPrompt';
import './Quiz.css';

function Quiz() {
  const [authState, setAuthState] = useState('pending'); // 'pending' | 'authenticated' | 'guest'

  function handleAuthenticated() {
    setAuthState('authenticated');
  }

  function handleSkip() {
    setAuthState('guest');
  }

  return (
    <div className="quiz-page">
      {authState === 'pending' && (
        <PasswordPrompt onAuthenticated={handleAuthenticated} onSkip={handleSkip} />
      )}

      {authState === 'guest' && (
        <div className="guest-banner">
          Guest mode — answers are not being recorded
        </div>
      )}

      {authState === 'authenticated' && (
        <div className="auth-banner">
          Logged in — your progress is being recorded
        </div>
      )}

      <h2>Quiz</h2>
      <p>Session setup and quiz questions will appear here.</p>
    </div>
  );
}

export default Quiz;
