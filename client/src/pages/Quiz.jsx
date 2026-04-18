import { useState } from 'react';
import PasswordPrompt from '../components/PasswordPrompt';
import SessionSetup from '../components/SessionSetup';
import './Quiz.css';

function Quiz() {
  const [authState, setAuthState] = useState('pending'); // 'pending' | 'authenticated' | 'guest'
  const [quizState, setQuizState] = useState('setup');   // 'setup' | 'active'
  const [sessionId, setSessionId] = useState(null);
  const [vocabulary, setVocabulary] = useState([]);
  const [selectedPairs, setSelectedPairs] = useState([]);

  function handleAuthenticated() {
    setAuthState('authenticated');
  }

  function handleSkip() {
    setAuthState('guest');
  }

  function handleSessionStart({ vocabulary, sessionId, pairs }) {
    setVocabulary(vocabulary);
    setSessionId(sessionId);
    setSelectedPairs(pairs);
    setQuizState('active');
  }

  function handleEndSession() {
    setQuizState('setup');
    setVocabulary([]);
    setSessionId(null);
    setSelectedPairs([]);
  }

  return (
    <div className="quiz-page">
      {authState === 'pending' && (
        <PasswordPrompt onAuthenticated={handleAuthenticated} onSkip={handleSkip} />
      )}

      {authState !== 'pending' && (
        <>
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

          {quizState === 'setup' && (
            <SessionSetup
              isAuthenticated={authState === 'authenticated'}
              onSessionStart={handleSessionStart}
            />
          )}

          {quizState === 'active' && (
            <div className="quiz-active">
              <div className="quiz-active-header">
                <span className="quiz-active-meta">
                  {vocabulary.length} words &mdash;{' '}
                  {selectedPairs.map(p => `L${p.level} Lesson ${p.lesson}`).join(', ')}
                  {sessionId && <span className="session-id-badge"> · Session #{sessionId}</span>}
                </span>
                <button className="btn-end-session" onClick={handleEndSession}>
                  End Session
                </button>
              </div>
              <p className="quiz-placeholder">Quiz questions will appear here in Milestone 6.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Quiz;
