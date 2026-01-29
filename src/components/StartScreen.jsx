import { useEffect, useState } from 'react';
import { DIFFICULTIES } from '../config/difficulty';
import { hasDailyBeenPlayed, getDailyBest, getTimeUntilNextDaily } from '../config/dailyChallenge';

export function StartScreen({ onStart, onStartDaily, stats }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal');
  const [flicker, setFlicker] = useState(false);
  const [ready, setReady] = useState(false);
  const [showMode, setShowMode] = useState('main'); // main, difficulty, stats

  const dailyPlayed = hasDailyBeenPlayed();
  const dailyBest = getDailyBest();

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!ready) return;
    
    const handleKey = (e) => {
      if (showMode === 'difficulty') {
        if (e.key === 'Enter' || e.key === ' ') {
          onStart(selectedDifficulty);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          const keys = Object.keys(DIFFICULTIES);
          const idx = keys.indexOf(selectedDifficulty);
          setSelectedDifficulty(keys[Math.max(0, idx - 1)]);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          const keys = Object.keys(DIFFICULTIES);
          const idx = keys.indexOf(selectedDifficulty);
          setSelectedDifficulty(keys[Math.min(keys.length - 1, idx + 1)]);
        } else if (e.key === 'Escape') {
          setShowMode('main');
        }
      }
    };
    
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onStart, selectedDifficulty, ready, showMode]);

  // Flicker effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(true);
      setTimeout(() => setFlicker(false), 100);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-8 transition-opacity duration-100 ${flicker ? 'opacity-70' : 'opacity-100'}`}>
      <h1 className="text-4xl md:text-8xl font-bold tracking-[0.2em] md:tracking-[0.3em] mb-4 text-[var(--color-bone)]">
        ONE WAY OUT
      </h1>
      
      <p className="text-[var(--color-bone)]/40 text-lg md:text-xl mb-12 tracking-widest">
        TYPE OR DIE
      </p>

      {showMode === 'main' && (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          {/* Play button */}
          <button
            onClick={() => setShowMode('difficulty')}
            className="py-4 px-8 border-2 border-[var(--color-bone)] text-[var(--color-bone)] hover:bg-[var(--color-bone)] hover:text-[var(--color-void)] transition-all font-bold tracking-wider text-lg"
          >
            PLAY
          </button>

          {/* Daily Challenge */}
          <button
            onClick={() => !dailyPlayed && onStartDaily()}
            disabled={dailyPlayed}
            className={`py-4 px-8 border-2 transition-all font-bold tracking-wider ${
              dailyPlayed
                ? 'border-[var(--color-bone)]/20 text-[var(--color-bone)]/30 cursor-not-allowed'
                : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-[var(--color-void)]'
            }`}
          >
            <div>📅 DAILY CHALLENGE</div>
            {dailyPlayed ? (
              <div className="text-xs mt-1 font-normal">
                Completed! Best: Level {dailyBest} • Next in {getTimeUntilNextDaily()}
              </div>
            ) : (
              <div className="text-xs mt-1 font-normal opacity-70">
                Same sentences for everyone today
              </div>
            )}
          </button>

          {/* Stats */}
          {stats && stats.totalGames > 0 && (
            <button
              onClick={() => setShowMode('stats')}
              className="py-3 px-8 border border-[var(--color-bone)]/30 text-[var(--color-bone)]/60 hover:border-[var(--color-bone)]/60 hover:text-[var(--color-bone)] transition-all text-sm tracking-wider"
            >
              📊 STATS & ACHIEVEMENTS
            </button>
          )}
        </div>
      )}

      {showMode === 'difficulty' && (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {Object.values(DIFFICULTIES).map((diff) => (
              <button
                key={diff.id}
                onClick={() => {
                  setSelectedDifficulty(diff.id);
                  if (ready) onStart(diff.id);
                }}
                className={`px-6 py-4 border-2 transition-all duration-200 min-w-[140px] ${
                  selectedDifficulty === diff.id
                    ? `border-[var(--color-bone)] ${diff.color} scale-105`
                    : 'border-[var(--color-bone)]/20 text-[var(--color-bone)]/40 hover:border-[var(--color-bone)]/40'
                }`}
              >
                <div className="font-bold tracking-wider">{diff.name}</div>
                <div className="text-xs mt-1 opacity-60">{diff.maxMistakes} lives</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowMode('main')}
            className="text-[var(--color-bone)]/40 hover:text-[var(--color-bone)]/60 text-sm"
          >
            ← Back
          </button>
        </>
      )}

      {showMode === 'stats' && stats && (
        <div className="w-full max-w-md">
          <div className="bg-[#111] border border-[var(--color-bone)]/20 rounded-lg p-6 mb-4">
            <h2 className="text-[var(--color-bone)] font-bold text-lg mb-4">Your Stats</h2>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[var(--color-bone)]">{stats.totalGames}</div>
                <div className="text-xs text-[var(--color-bone)]/50">Games Played</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{stats.bestLevel}</div>
                <div className="text-xs text-[var(--color-bone)]/50">Best Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{stats.bestWpm}</div>
                <div className="text-xs text-[var(--color-bone)]/50">Best WPM</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">{stats.bestCombo}x</div>
                <div className="text-xs text-[var(--color-bone)]/50">Best Combo</div>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-[var(--color-bone)]/20 rounded-lg p-6 mb-4">
            <h2 className="text-[var(--color-bone)] font-bold text-lg mb-4">
              Achievements ({stats.unlockedAchievements?.length || 0})
            </h2>
            
            {stats.unlockedAchievements?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {stats.unlockedAchievements.map(id => {
                  const achievement = require('../config/achievements').ACHIEVEMENTS[id];
                  return achievement ? (
                    <div 
                      key={id} 
                      className="bg-[var(--color-bone)]/10 px-3 py-2 rounded text-sm"
                      title={achievement.description}
                    >
                      {achievement.icon} {achievement.name}
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="text-[var(--color-bone)]/40 text-sm">
                No achievements yet. Keep playing!
              </div>
            )}
          </div>

          <button
            onClick={() => setShowMode('main')}
            className="w-full py-3 text-[var(--color-bone)]/40 hover:text-[var(--color-bone)]/60 text-sm"
          >
            ← Back
          </button>
        </div>
      )}

      {showMode === 'main' && (
        <div className="absolute bottom-8 text-[var(--color-bone)]/20 text-xs text-center">
          <div>type fast • survive long • don't die</div>
        </div>
      )}
    </div>
  );
}
