import { useState, useEffect, useRef } from 'react';
import './QuizEngine.css';

const WORKER_URL = 'https://tangerine-worker.pacificatch.workers.dev';

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build initial queue: 2 cards per word, shuffled, no same-word back-to-back
function buildQueue(vocabulary) {
  const cards = vocabulary.flatMap(word => [
    { word, direction: 'char_to_eng', correctCount: 0, attemptNumber: 1 },
    { word, direction: 'eng_to_char', correctCount: 0, attemptNumber: 1 },
  ]);

  const shuffled = shuffle(cards);

  for (let i = 1; i < shuffled.length; i++) {
    if (shuffled[i].word.id === shuffled[i - 1].word.id) {
      for (let j = i + 1; j < shuffled.length; j++) {
        if (shuffled[j].word.id !== shuffled[i - 1].word.id) {
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          break;
        }
      }
    }
  }

  return shuffled;
}

// Insert card back into queue at valid position (min 2 spots ahead, not adjacent to same word)
function requeue(queue, card) {
  const minPos = Math.min(2, queue.length);

  for (let attempt = 0; attempt < 20; attempt++) {
    const pos = minPos + Math.floor(Math.random() * Math.max(1, queue.length - minPos + 1));
    const prev = queue[pos - 1];
    const next = queue[pos];
    if (
      (!prev || prev.word.id !== card.word.id) &&
      (!next || next.word.id !== card.word.id)
    ) {
      queue.splice(pos, 0, card);
      return;
    }
  }

  queue.push(card);
}

// Speak Chinese text using Web Speech API
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW';
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

// Auto-check user's typed answer
function checkAnswer(input, word, direction) {
  const clean = s => s.toLowerCase().trim();
  const userClean = clean(input);
  if (!userClean) return false;

  if (direction === 'eng_to_char') {
    // Accept traditional or simplified
    return userClean === clean(word.traditional) || userClean === clean(word.simplified);
  } else {
    // Accept any part of the definition (split by ; or ,)
    const parts = word.definition.split(/[;,]/).map(p => clean(p));
    return parts.some(p => p === userClean);
  }
}

function QuizEngine({ vocabulary, sessionId, selectedPairs, onEnd }) {
  const queueRef = useRef([]);
  const inputRef = useRef(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [phase, setPhase] = useState('question'); // 'question' | 'revealed' | 'done'
  const [showPinyin, setShowPinyin] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [autoResult, setAutoResult] = useState(null); // null | true | false
  const [totalCards, setTotalCards] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    const queue = buildQueue(vocabulary);
    queueRef.current = queue;
    setTotalCards(queue.length);
    showNext(queue);
  }, []);

  // Auto-focus input on each new question
  useEffect(() => {
    if (phase === 'question' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase, currentCard]);

  function showNext(queue = queueRef.current) {
    if (queue.length === 0) {
      setPhase('done');
      return;
    }
    setCurrentCard({ ...queue[0] });
    setPhase('question');
    setShowPinyin(false);
    setUserInput('');
    setAutoResult(null);
  }

  // User submits their typed answer
  function handleCheck(e) {
    e?.preventDefault();
    if (!userInput.trim()) return;
    const result = checkAnswer(userInput, currentCard.word, currentCard.direction);
    setAutoResult(result);
    setPhase('revealed');
  }

  // User skips typing and just reveals the answer
  function handleReveal() {
    setAutoResult(null);
    setPhase('revealed');
  }

  // Process the final result (auto or overridden)
  async function processResult(isCorrect) {
    const card = queueRef.current.shift();

    if (sessionId) {
      fetch(`${WORKER_URL}/api/session/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          vocabularyId: card.word.id,
          direction: card.direction,
          isCorrect,
          hintUsed: false,
          attemptNumber: card.attemptNumber,
        }),
      }).catch(() => {});
    }

    if (isCorrect) {
      const updatedCard = { ...card, correctCount: card.correctCount + 1 };
      setSessionStats(s => ({ ...s, correct: s.correct + 1 }));
      if (updatedCard.correctCount >= 2) {
        setDoneCount(d => d + 1);
      } else {
        requeue(queueRef.current, updatedCard);
      }
    } else {
      requeue(queueRef.current, { ...card, attemptNumber: card.attemptNumber + 1 });
      setSessionStats(s => ({ ...s, incorrect: s.incorrect + 1 }));
    }

    showNext();
  }

  // Done screen
  if (phase === 'done') {
    const total = sessionStats.correct + sessionStats.incorrect;
    const accuracy = total > 0 ? Math.round((sessionStats.correct / total) * 100) : 0;

    return (
      <div className="quiz-done">
        <div className="quiz-done-icon">🎉</div>
        <h3>Session Complete!</h3>
        <div className="quiz-done-stats">
          <div className="done-stat">
            <span className="done-stat-number">{vocabulary.length}</span>
            <span className="done-stat-label">words covered</span>
          </div>
          <div className="done-stat">
            <span className="done-stat-number">{sessionStats.correct}</span>
            <span className="done-stat-label">correct</span>
          </div>
          <div className="done-stat">
            <span className="done-stat-number">{sessionStats.incorrect}</span>
            <span className="done-stat-label">incorrect</span>
          </div>
          <div className="done-stat">
            <span className="done-stat-number">{accuracy}%</span>
            <span className="done-stat-label">accuracy</span>
          </div>
        </div>
        <button className="btn-primary" onClick={onEnd}>Back to Lesson Select</button>
      </div>
    );
  }

  if (!currentCard) return null;

  const { word, direction } = currentCard;
  const isCharToEng = direction === 'char_to_eng';
  const progress = totalCards > 0 ? Math.round((doneCount / totalCards) * 100) : 0;
  const remaining = queueRef.current.length;

  return (
    <div className="quiz-engine">

      {/* Header */}
      <div className="quiz-header">
        <span className="quiz-meta">
          {selectedPairs.map(p => `L${p.level} Lesson ${p.lesson}`).join(', ')}
          {sessionId && <span className="quiz-session-badge"> · Session #{sessionId}</span>}
        </span>
        <button className="btn-end-session" onClick={onEnd}>End Session</button>
      </div>

      {/* Progress bar */}
      <div className="quiz-progress-wrap">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="quiz-progress-label">{doneCount} / {totalCards} done</span>
      </div>

      {/* Card */}
      <div className="quiz-card">

        <div className="quiz-direction-label">
          {isCharToEng ? 'What does this mean in English?' : 'How do you write this in Chinese?'}
        </div>

        {/* Question */}
        <div className="quiz-question">
          {isCharToEng ? (
            <span className="quiz-character">{word.traditional}</span>
          ) : (
            <span className="quiz-english">
              {word.part_of_speech && (
                <span className="quiz-pos">{word.part_of_speech} — </span>
              )}
              {word.definition}
            </span>
          )}
        </div>

        {/* Pinyin toggle (question phase only) */}
        {phase === 'question' && (
          <div className="quiz-pinyin-row">
            {showPinyin ? (
              <span className="quiz-pinyin">{word.pinyin}</span>
            ) : (
              <button className="btn-show-pinyin" onClick={() => setShowPinyin(true)}>
                Show pinyin
              </button>
            )}
          </div>
        )}

        {/* Answer input (question phase) */}
        {phase === 'question' && (
          <form className="quiz-input-form" onSubmit={handleCheck}>
            <input
              ref={inputRef}
              type="text"
              className="quiz-input"
              placeholder={isCharToEng ? 'Type the English meaning…' : 'Type the Chinese character…'}
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
            <div className="quiz-input-actions">
              <button
                type="submit"
                className="btn-reveal"
                disabled={!userInput.trim()}
              >
                Check
              </button>
              <button
                type="button"
                className="btn-skip-input"
                onClick={handleReveal}
              >
                Skip — just show answer
              </button>
            </div>
          </form>
        )}

        {/* Revealed answer */}
        {phase === 'revealed' && (
          <div className="quiz-answer">

            {/* What the user typed */}
            {userInput.trim() && (
              <div className={`quiz-user-answer ${autoResult === true ? 'correct' : autoResult === false ? 'incorrect' : ''}`}>
                <span className="quiz-user-label">Your answer:</span>
                <span className="quiz-user-text">{userInput}</span>
                {autoResult === true && <span className="quiz-auto-badge correct">✓ Correct</span>}
                {autoResult === false && <span className="quiz-auto-badge incorrect">✗ Incorrect</span>}
              </div>
            )}

            {/* Correct answer */}
            <div className="quiz-correct-answer">
              <span className="quiz-correct-label">Correct answer:</span>
              {isCharToEng ? (
                <>
                  <div className="quiz-answer-pinyin">{word.pinyin}</div>
                  <div className="quiz-answer-definition">
                    {word.part_of_speech && (
                      <span className="quiz-pos">{word.part_of_speech} — </span>
                    )}
                    {word.definition}
                  </div>
                </>
              ) : (
                <>
                  <div className="quiz-answer-character">{word.traditional}</div>
                  <div className="quiz-answer-pinyin">{word.pinyin}</div>
                </>
              )}
            </div>

            {/* Audio button — always speaks the Chinese character */}
            <button
              className="btn-audio"
              onClick={() => speak(word.traditional)}
              title="Hear Mandarin pronunciation"
            >
              🔊 Hear it
            </button>

          </div>
        )}

        {/* Action buttons (revealed phase) */}
        {phase === 'revealed' && (
          <div className="quiz-actions">
            {/* Auto-result flow: show Next + override */}
            {autoResult !== null ? (
              <div className="quiz-result-actions">
                <button
                  className={`btn-next ${autoResult ? 'correct' : 'incorrect'}`}
                  onClick={() => processResult(autoResult)}
                >
                  Next →
                </button>
                <button
                  className="btn-override"
                  onClick={() => processResult(!autoResult)}
                >
                  Override — mark as {autoResult ? 'incorrect' : 'correct'}
                </button>
              </div>
            ) : (
              /* Manual flow (user skipped typing) */
              <>
                <button className="btn-incorrect" onClick={() => processResult(false)}>
                  ✗ &nbsp;Incorrect
                </button>
                <button className="btn-correct" onClick={() => processResult(true)}>
                  ✓ &nbsp;Correct
                </button>
              </>
            )}
          </div>
        )}

      </div>

      {/* Footer stats */}
      <div className="quiz-footer-stats">
        <span className="quiz-stat correct">✓ {sessionStats.correct}</span>
        <span className="quiz-stat remaining">{remaining + 1} remaining</span>
        <span className="quiz-stat incorrect">✗ {sessionStats.incorrect}</span>
      </div>

    </div>
  );
}

export default QuizEngine;
