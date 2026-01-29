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
  onType 
}) {
  const inputRef = useRef(null);

  // Keep focus on hidden input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Refocus on click anywhere
  const handleClick = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    // Prevent default for most keys to avoid browser shortcuts
    if (e.key !== 'F5' && e.key !== 'F12') {
      // Allow the character through for typing
    }
  };

  const handleInput = (e) => {
    onType(e.target.value);
  };

  return (
    <div 
      className={`min-h-screen flex flex-col p-6 md:p-12 cursor-text ${isFlashing ? 'flash-mistake' : ''}`}
      onClick={handleClick}
    >
      {/* Hidden input for capturing keystrokes */}
      <input
        ref={inputRef}
        type="text"
        value={typed}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="absolute opacity-0 pointer-events-none"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* Stats at top */}
      <StatsBar 
        level={level} 
        mistakes={mistakes} 
        maxMistakes={maxMistakes}
        bestScore={bestScore}
      />

      {/* Sentence in center */}
      <div className={`flex-1 flex items-center justify-center ${isShaking ? 'shake' : ''}`}>
        <div className="max-w-4xl">
          <SentenceDisplay sentence={sentence} typed={typed} />
        </div>
      </div>

      {/* Hint at bottom */}
      <div className="text-center text-[var(--color-bone)]/20 text-sm">
        just type
      </div>
    </div>
  );
}
