import { useState } from 'react';
import PasswordPrompt from '../components/PasswordPrompt';
import SessionSetup from '../components/SessionSetup';
import QuizEngine from '../components/QuizEngine';
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
            <QuizEngine
              vocabulary={vocabulary}
              sessionId={sessionId}
              selectedPairs={selectedPairs}
              onEnd={handleEndSession}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Quiz;
