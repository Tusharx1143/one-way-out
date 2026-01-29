import { useEffect, useState } from 'react';
import { DIFFICULTIES } from '../config/difficulty';

export function StartScreen({ onStart }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal');
  const [flicker, setFlicker] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Small delay before accepting input
    const timeout = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!ready) return;
    
    const handleKey = (e) => {
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
      }
    };
    
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onStart, selectedDifficulty, ready]);

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

      {/* Difficulty selection */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
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

      <div className="space-y-3 text-center text-[var(--color-bone)]/50 text-sm md:text-base max-w-md">
        <p>Type each sentence before time runs out</p>
        <p>Every mistake costs a life</p>
        <p>The clock gets faster</p>
      </div>

      <p className="mt-12 text-[var(--color-blood-bright)] animate-pulse tracking-[0.15em] text-sm md:text-base">
        PRESS ENTER TO BEGIN
      </p>

      <div className="absolute bottom-8 text-[var(--color-bone)]/20 text-xs">
        ← → to select difficulty
      </div>
    </div>
  );
}
