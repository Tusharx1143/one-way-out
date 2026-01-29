import { useState } from 'react';

export function ShareCard({ level, wpm, maxCombo, difficulty, onClose }) {
  const [copied, setCopied] = useState(false);

  const shareText = `☠️ ONE WAY OUT ☠️

I reached Level ${level}
⌨️ ${wpm} WPM
🔥 ${maxCombo}x Max Combo
💀 ${difficulty.toUpperCase()} Mode

Can you survive longer?
🎮 Play now: one-way-out.vercel.app`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-[#111] border border-[var(--color-bone)]/20 p-6 max-w-sm w-full rounded-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Preview Card */}
        <div className="bg-[var(--color-void)] border border-[var(--color-blood)]/30 p-4 rounded mb-4">
          <div className="text-center">
            <div className="text-2xl mb-2">☠️ ONE WAY OUT ☠️</div>
            <div className="text-4xl font-bold text-[var(--color-bone)] mb-3">Level {level}</div>
            <div className="flex justify-center gap-6 text-sm text-[var(--color-bone)]/70">
              <span>⌨️ {wpm} WPM</span>
              <span>🔥 {maxCombo}x</span>
            </div>
            <div className="text-xs text-[var(--color-blood-bright)] mt-2 uppercase tracking-wider">
              {difficulty} mode
            </div>
          </div>
        </div>

        {/* Share buttons */}
        <div className="space-y-2">
          <button
            onClick={handleCopy}
            className="w-full py-3 bg-[var(--color-bone)]/10 hover:bg-[var(--color-bone)]/20 transition-colors rounded text-[var(--color-bone)]"
          >
            {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
          </button>
          
          <button
            onClick={handleTwitter}
            className="w-full py-3 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 transition-colors rounded text-[#1DA1F2]"
          >
            𝕏 Share on Twitter
          </button>
          
          <button
            onClick={handleWhatsApp}
            className="w-full py-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 transition-colors rounded text-[#25D366]"
          >
            💬 Share on WhatsApp
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 text-[var(--color-bone)]/40 hover:text-[var(--color-bone)]/60 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}
