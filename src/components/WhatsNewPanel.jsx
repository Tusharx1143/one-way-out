import { useState } from 'react';
import pkg from '../../package.json';

const STORAGE_KEY = 'oneWayOut_whatsNew';

const CHANGES = [
  { icon: '👻', text: 'New power-up: Phantom Keys — typos vanish for 10 seconds' },
  { icon: '🏆', text: '6 new endurance achievements (150 → 400 games)' },
  { icon: '🕐', text: 'Leaderboard shows when players were last seen' },
  { icon: '❄️', text: 'Frozen Wasteland hint now reads "Reach Level 40"' },
  { icon: '🎯', text: 'Adaptive difficulty is now off by default' },
  { icon: '🗑️', text: 'Casual mode removed — only Normal and Nightmare remain' },
  { icon: '📜', text: '180 new horror sentences added across all levels' },
];

export function WhatsNewPanel() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === pkg.version;
    } catch {
      return true;
    }
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, pkg.version);
    } catch {
      // ignore
    }
    setDismissed(true);
  };

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 w-64 bg-[#0e0e0e] border border-[var(--color-bone)]/20 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--color-bone)]/10 bg-gradient-to-r from-[var(--color-bone)]/5 to-transparent">
        <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-bone)]/40">What&apos;s New</div>
        <div className="text-xs font-bold text-[var(--color-bone)] tracking-wider">v{pkg.version}</div>
      </div>

      {/* Changes list */}
      <ul className="px-4 py-3 space-y-2 flex-1">
        {CHANGES.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[10px] text-[var(--color-bone)]/60 leading-relaxed">
            <span className="flex-shrink-0 mt-0.5">{item.icon}</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>

      {/* Dismiss button */}
      <div className="px-4 pb-3">
        <button
          onClick={handleDismiss}
          className="w-full py-1.5 text-[9px] uppercase tracking-[0.25em] font-bold border border-[var(--color-bone)]/20 text-[var(--color-bone)]/40 hover:border-[var(--color-bone)]/40 hover:text-[var(--color-bone)]/60 transition-all"
        >
          Don&apos;t show again
        </button>
      </div>
    </div>
  );
}
