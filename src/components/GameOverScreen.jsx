import { useState } from 'react';
import { DIFFICULTIES } from '../config/difficulty';
import { ShareCard } from './ShareCard';

export function GameOverScreen({ level, bestScore, maxCombo, wpm, difficulty, gameMode, onRestart }) {
  const [showShare, setShowShare] = useState(false);
  
  const isNewBest = level >= bestScore;
  const diffConfig = DIFFICULTIES[difficulty];
  const isDaily = gameMode === 'daily';
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-5xl md:text-8xl font-bold text-[var(--color-blood-bright)] tracking-widest">
        NO WAY OUT
      </h1>
      
      {isDaily && (
        <div className="text-yellow-500 text-sm uppercase tracking-wider">
          📅 Daily Challenge
        </div>
      )}
      
      <div className="text-center space-y-3 mt-4">
        <p className="text-2xl md:text-3xl">
          Level <span className="text-[var(--color-bone)] font-bold">{level}</span>
        </p>
        {isNewBest && level > 1 && !isDaily && (
          <p className="text-green-400 text-lg animate-pulse">✨ NEW BEST! ✨</p>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-8 text-[var(--color-bone)]/60 text-sm md:text-base mt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-[var(--color-bone)]">{wpm}</div>
          <div>WPM</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{maxCombo}</div>
          <div>Best Combo</div>
        </div>
        {!isDaily && (
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{bestScore}</div>
            <div>Best Level</div>
          </div>
        )}
      </div>

      {!isDaily && (
        <div className={`text-sm ${diffConfig.color} mt-2`}>
          {diffConfig.name} MODE
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-3 mt-6 w-full max-w-xs">
        <button
          onClick={() => setShowShare(true)}
          className="px-8 py-3 bg-[var(--color-bone)]/10 hover:bg-[var(--color-bone)]/20 text-[var(--color-bone)] transition-colors tracking-wider border border-[var(--color-bone)]/30"
        >
          📤 SHARE SCORE
        </button>

        {!isDaily && (
          <button
            onClick={() => onRestart(difficulty)}
            className="px-8 py-4 text-lg border-2 border-[var(--color-bone)]/30 hover:border-[var(--color-blood-bright)] hover:text-[var(--color-blood-bright)] transition-colors duration-200 tracking-widest"
          >
            TRY AGAIN
          </button>
        )}

        <button
          onClick={() => onRestart(null)}
          className="text-[var(--color-bone)]/40 hover:text-[var(--color-bone)]/60 text-sm transition-colors py-2"
        >
          {isDaily ? '← back to menu' : 'change difficulty'}
        </button>
      </div>

      <p className="text-[var(--color-bone)]/30 text-xs mt-4">
        {!isDaily && 'Press ENTER to restart'}
      </p>

      {/* Share modal */}
      {showShare && (
        <ShareCard
          level={level}
          wpm={wpm}
          maxCombo={maxCombo}
          difficulty={isDaily ? 'daily' : difficulty}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
