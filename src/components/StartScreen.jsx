import { useEffect, useState } from 'react';

export function StartScreen({ onStart }) {
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key) onStart();
    };
    const handleClick = () => onStart();
    
    window.addEventListener('keydown', handleKey);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('click', handleClick);
    };
  }, [onStart]);

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
      <h1 className="text-5xl md:text-8xl font-bold tracking-[0.3em] mb-4 text-[var(--color-bone)]">
        ONE WAY OUT
      </h1>
      
      <p className="text-[var(--color-bone)]/40 text-lg md:text-xl mb-16 tracking-widest">
        TYPE OR DIE
      </p>

      <div className="space-y-6 text-center text-[var(--color-bone)]/60 text-sm md:text-base">
        <p>Type each sentence exactly as shown</p>
        <p>5 mistakes and it's over</p>
        <p>The clock is always ticking</p>
      </div>

      <p className="mt-20 text-[var(--color-blood-bright)] animate-pulse tracking-[0.2em]">
        PRESS ANY KEY TO BEGIN
      </p>

      <div className="absolute bottom-8 text-[var(--color-bone)]/20 text-xs">
        use keyboard • no touchscreen
      </div>
    </div>
  );
}
