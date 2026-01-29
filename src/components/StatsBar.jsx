export function StatsBar({ level, mistakes, maxMistakes, bestScore, timeLeft, maxTime }) {
  const timePercent = (timeLeft / maxTime) * 100;
  const isLowTime = timeLeft <= 3;
  
  return (
    <div className="space-y-4">
      {/* Timer bar */}
      <div className="w-full h-2 bg-[var(--color-bone)]/10 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-100 ${
            isLowTime 
              ? 'bg-[var(--color-blood-bright)] animate-pulse' 
              : 'bg-[var(--color-bone)]/40'
          }`}
          style={{ width: `${timePercent}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="flex justify-between items-center text-sm md:text-base opacity-70">
        <div className="flex gap-6">
          <span>LEVEL <span className="text-[var(--color-bone)] font-bold">{level}</span></span>
          <span>BEST <span className="text-green-400 font-bold">{bestScore}</span></span>
        </div>

        <div className={`font-mono text-lg ${isLowTime ? 'text-[var(--color-blood-bright)] animate-pulse font-bold' : ''}`}>
          {timeLeft.toFixed(1)}s
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-blood-bright)]">LIVES</span>
          <div className="flex gap-1">
            {Array.from({ length: maxMistakes }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  i < (maxMistakes - mistakes)
                    ? 'bg-[var(--color-blood-bright)] shadow-[0_0_10px_var(--color-blood-bright)]' 
                    : 'bg-[var(--color-bone)]/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
