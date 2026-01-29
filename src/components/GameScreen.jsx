import { useEffect, useRef } from 'react';
import { SentenceDisplay } from './SentenceDisplay';
import { StatsBar } from './StatsBar';

export function GameScreen({ 
  level, 
  mistakes, 
  maxMistakes, 
  bestScore,
  sentence, 
  typed, 
  isShaking,
  isFlashing,
  timeLeft,
  maxTime,
  onType 
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClick = () => {
    inputRef.current?.focus();
  };

  const handleInput = (e) => {
    onType(e.target.value);
  };

  // Visual decay based on mistakes
  const decayOpacity = 1 - (mistakes * 0.1);
  const decayFilter = mistakes > 2 ? `blur(${(mistakes - 2) * 0.3}px)` : 'none';

  return (
    <div 
      className={`min-h-screen flex flex-col p-6 md:p-12 cursor-text ${isFlashing ? 'flash-mistake' : ''}`}
      onClick={handleClick}
      style={{ 
        opacity: decayOpacity,
        filter: decayFilter,
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={typed}
        onChange={handleInput}
        className="absolute opacity-0 pointer-events-none"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      <StatsBar 
        level={level} 
        mistakes={mistakes} 
        maxMistakes={maxMistakes}
        bestScore={bestScore}
        timeLeft={timeLeft}
        maxTime={maxTime}
      />

      <div className={`flex-1 flex items-center justify-center ${isShaking ? 'shake' : ''}`}>
        <div className="max-w-4xl">
          <SentenceDisplay sentence={sentence} typed={typed} />
        </div>
      </div>

      <div className="text-center text-[var(--color-bone)]/20 text-sm">
        just type
      </div>
    </div>
  );
}
