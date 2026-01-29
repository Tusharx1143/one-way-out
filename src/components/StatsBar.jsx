export function StatsBar({ level, mistakes, maxMistakes, bestScore }) {
  return (
    <div className="flex justify-between items-center text-sm md:text-base opacity-70">
      <div className="flex gap-6">
        <span>LEVEL <span className="text-[var(--color-bone)] font-bold">{level}</span></span>
        <span>BEST <span className="text-green-400 font-bold">{bestScore}</span></span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-[var(--color-blood-bright)]">MISTAKES</span>
        <div className="flex gap-1">
          {Array.from({ length: maxMistakes }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                i < mistakes 
                  ? 'bg-[var(--color-blood-bright)] shadow-[0_0_10px_var(--color-blood-bright)]' 
                  : 'bg-[var(--color-bone)]/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
