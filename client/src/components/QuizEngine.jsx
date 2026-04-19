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

  // Fix consecutive same-word pairs
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

// Insert a card back into the queue at a valid position (not adjacent to same word, min 2 spots ahead)
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

  // Fallback: append to end
  queue.push(card);
}

function QuizEngine({ vocabulary, sessionId, selectedPairs, onEnd }) {
  const queueRef = useRef([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [phase, setPhase] = useState('question'); // 'question' | 'revealed' | 'done'
  const [showPinyin, setShowPinyin] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [totalCards, setTotalCards] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    const queue = buildQueue(vocabulary);
    queueRef.current = queue;
    setTotalCards(queue.length);
    showNext(queue);
  }, []);

  function showNext(queue = queueRef.current) {
    if (queue.length === 0) {
      setPhase('done');
      return;
    }
    setCurrentCard({ ...queue[0] });
    setPhase('question');
    setShowPinyin(false);
    setHintUsed(false);
  }

  function handleHint() {
    setHintUsed(true);
    setShowPinyin(true);
  }

  function handleReveal() {
    setPhase('revealed');
  }

  async function handleAnswer(userSaysCorrect) {
    const actuallyCorrect = userSaysCorrect && !hintUsed;
    const card = queueRef.current.shift();

    // Record to backend (fire-and-forget)
    if (sessionId) {
      fetch(`${WORKER_URL}/api/session/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          vocabularyId: card.word.id,
          direction: card.direction,
          isCorrect: actuallyCorrect,
          hintUsed,
          attemptNumber: card.attemptNumber,
        }),
      }).catch(() => {}); // silent fail — don't block the quiz
    }

    if (actuallyCorrect) {
      const updatedCard = { ...card, correctCount: card.correctCount + 1 };
      setSessionStats(s => ({ ...s, correct: s.correct + 1 }));

      if (updatedCard.correctCount >= 2) {
        // Card fully mastered
        setDoneCount(d => d + 1);
      } else {
        // One more correct needed — re-queue
        requeue(queueRef.current, updatedCard);
      }
    } else {
      // Wrong or hint used — re-queue without resetting correctCount
      const updatedCard = { ...card, attemptNumber: card.attemptNumber + 1 };
      requeue(queueRef.current, updatedCard);
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
  const remaining = queueRef.current.length; // cards still in queue (not counting current)

  return (
    <div className="quiz-engine">

      {/* Header: meta + end session */}
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

        {/* Pinyin row (question phase) */}
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

        {/* Revealed answer */}
        {phase === 'revealed' && (
          <div className="quiz-answer">
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
            {hintUsed && (
              <div className="quiz-hint-notice">Hint was used — counted as incorrect</div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="quiz-actions">
          {phase === 'question' && (
            <>
              <button
                className="btn-hint"
                onClick={handleHint}
                disabled={hintUsed}
              >
                {hintUsed ? 'Hint shown' : 'Hint (pinyin)'}
              </button>
              <button className="btn-reveal" onClick={handleReveal}>
                Reveal Answer
              </button>
            </>
          )}

          {phase === 'revealed' && (
            <>
              <button className="btn-incorrect" onClick={() => handleAnswer(false)}>
                ✗ &nbsp;Incorrect
              </button>
              <button className="btn-correct" onClick={() => handleAnswer(true)}>
                ✓ &nbsp;Correct
              </button>
            </>
          )}
        </div>

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
