export function GameOverScreen({ level, bestScore, onRestart }) {
  const isNewBest = level >= bestScore;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <h1 className="text-6xl md:text-8xl font-bold text-[var(--color-blood-bright)] tracking-widest">
        NO WAY OUT
      </h1>
      
      <div className="text-center space-y-2">
        <p className="text-2xl">
          You reached level <span className="text-[var(--color-bone)] font-bold">{level}</span>
        </p>
        {isNewBest && level > 1 && (
          <p className="text-green-400 text-lg animate-pulse">NEW BEST!</p>
        )}
        <p className="text-[var(--color-bone)]/50">
          Best: {bestScore}
        </p>
      </div>

      <button
        onClick={onRestart}
        className="mt-8 px-8 py-4 text-xl border-2 border-[var(--color-bone)]/30 hover:border-[var(--color-blood-bright)] hover:text-[var(--color-blood-bright)] transition-colors duration-200 tracking-widest"
      >
        TRY AGAIN
      </button>

      <p className="text-[var(--color-bone)]/30 text-sm mt-8">
        Press ENTER to restart
      </p>
    </div>
  );
}
