export function SentenceDisplay({ sentence, typed }) {
  return (
    <div className="text-2xl md:text-4xl leading-relaxed tracking-wide select-none">
      {sentence.split('').map((char, index) => {
        let className = 'transition-colors duration-100 ';
        
        if (index < typed.length) {
          // Already typed - green
          className += 'text-green-400';
        } else if (index === typed.length) {
          // Current character - highlighted
          className += 'text-[var(--color-bone)] bg-[var(--color-bone)]/20 cursor-blink';
        } else {
          // Not yet typed - dim
          className += 'text-[var(--color-bone)]/40';
        }

        return (
          <span key={index} className={className}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
}
