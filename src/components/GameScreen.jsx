import { useEffect, useRef, useState } from 'react';
import { SentenceDisplay } from './SentenceDisplay';
import { StatsBar } from './StatsBar';
import { VirtualKeyboard } from './VirtualKeyboard';

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
  combo,
  wpm,
  difficulty,
  onType 
}) {
  const inputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      inputRef.current?.focus();
    }
  }, [isMobile]);

  const handleClick = () => {
    if (!isMobile) {
      inputRef.current?.focus();
    }
  };

  const handleInput = (e) => {
    onType(e.target.value);
  };

  const handleVirtualKey = (char) => {
    onType(typed + char);
  };

  // Visual decay based on mistakes
  const decayOpacity = 1 - (mistakes * 0.08);
  const decayFilter = mistakes > 2 ? `blur(${(mistakes - 2) * 0.3}px)` : 'none';

  // Next expected character for keyboard highlighting
  const nextChar = sentence[typed.length] || '';

  return (
    <div 
      className={`min-h-screen flex flex-col p-4 md:p-12 cursor-text ${isFlashing ? 'flash-mistake' : ''} ${isMobile ? 'pb-56' : ''}`}
      onClick={handleClick}
      style={{ 
        opacity: decayOpacity,
        filter: decayFilter,
      }}
    >
      {/* Hidden input for desktop keyboard */}
      {!isMobile && (
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
      )}

      <StatsBar 
        level={level} 
        mistakes={mistakes} 
        maxMistakes={maxMistakes}
        bestScore={bestScore}
        timeLeft={timeLeft}
        maxTime={maxTime}
        combo={combo}
        wpm={wpm}
        difficulty={difficulty}
      />

      <div className={`flex-1 flex items-center justify-center ${isShaking ? 'shake' : ''}`}>
        <div className="max-w-4xl px-2">
          <SentenceDisplay sentence={sentence} typed={typed} />
        </div>
      </div>

      {!isMobile && (
        <div className="text-center text-[var(--color-bone)]/20 text-sm">
          just type
        </div>
      )}

      {/* Virtual keyboard for mobile */}
      {isMobile && (
        <VirtualKeyboard onKeyPress={handleVirtualKey} nextChar={nextChar} />
      )}
    </div>
  );
}
