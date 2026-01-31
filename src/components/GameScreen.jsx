import { useEffect, useRef, useState } from 'react';
import { SentenceDisplay } from './SentenceDisplay';
import { StatsBar } from './StatsBar';
import { Creature } from './Creature';
import { PowerUpsUI } from './PowerUpsUI';

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
  isGameOver,
  onType,
  streakMultiplier,
  timeSurvived,
  gameMode,
  activePowerUps,
  currentLevelPowerUp,
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

  // Focus input on mount and keep it focused
  useEffect(() => {
    if (!isGameOver) {
      inputRef.current?.focus();
    }
  }, [isGameOver, level]); // Refocus on each new level

  const handleClick = () => {
    if (!isGameOver) {
      inputRef.current?.focus();
    }
  };

  const handleInput = (e) => {
    const value = e.target.value;
    onType(value);
  };

  // Prevent losing focus
  const handleBlur = () => {
    if (!isGameOver) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  };

  // Visual decay based on mistakes
  const decayOpacity = 1 - (mistakes * 0.06);
  const decayFilter = mistakes > 2 ? `blur(${(mistakes - 2) * 0.2}px)` : 'none';

  return (
    <div 
      className={`min-h-screen flex flex-col p-4 md:p-12 cursor-text ${isFlashing ? 'flash-mistake' : ''}`}
      onClick={handleClick}
      style={{ 
        opacity: decayOpacity,
        filter: isGameOver ? 'none' : decayFilter,
      }}
    >
      {/* Creature component */}
      <Creature 
        mistakes={mistakes} 
        maxMistakes={maxMistakes} 
        isGameOver={isGameOver}
      />

      {/* Text input - visible on mobile for keyboard trigger */}
      <input
        ref={inputRef}
        type="text"
        value={typed}
        onChange={handleInput}
        onBlur={handleBlur}
        className={`
          ${isMobile 
            ? 'fixed bottom-0 left-0 right-0 h-12 bg-[#111] border-t border-[var(--color-bone)]/20 px-4 text-[var(--color-bone)] text-lg z-50' 
            : 'absolute opacity-0 pointer-events-none'
          }
        `}
        placeholder={isMobile ? "Type here..." : ""}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        enterKeyHint="next"
      />

      <div className="relative z-20 space-y-3">
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
          streakMultiplier={streakMultiplier}
          timeSurvived={timeSurvived}
          gameMode={gameMode}
        />
        <PowerUpsUI 
          activePowerUps={activePowerUps}
          currentLevelPowerUp={currentLevelPowerUp}
        />
      </div>

      <div className={`flex-1 flex items-center justify-center relative z-20 ${isShaking ? 'shake' : ''} ${isMobile ? 'pb-16' : ''}`}>
        <div className="max-w-4xl px-2">
          <SentenceDisplay sentence={sentence} typed={typed} />
        </div>
      </div>

      {!isMobile && (
        <div className="text-center text-[var(--color-bone)]/20 text-sm relative z-20">
          just type
        </div>
      )}

      {isMobile && (
        <div className="text-center text-[var(--color-bone)]/30 text-xs pb-16 relative z-20">
          tap the input below to type
        </div>
      )}
    </div>
  );
}
