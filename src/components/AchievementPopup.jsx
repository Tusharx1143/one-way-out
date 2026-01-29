import { useEffect, useState } from 'react';

export function AchievementPopup({ achievements, onDone }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (achievements.length > 0) {
      setShow(true);
    }
  }, [achievements]);

  useEffect(() => {
    if (show && currentIndex < achievements.length) {
      const timer = setTimeout(() => {
        if (currentIndex < achievements.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setShow(false);
          onDone();
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, currentIndex, achievements.length, onDone]);

  if (!show || achievements.length === 0) return null;

  const achievement = achievements[currentIndex];

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-[slideDown_0.3s_ease-out]">
      <div className="bg-[#111] border-2 border-yellow-500/50 rounded-lg px-6 py-4 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{achievement.icon}</div>
          <div>
            <div className="text-yellow-500 text-xs uppercase tracking-wider mb-1">
              Achievement Unlocked!
            </div>
            <div className="text-[var(--color-bone)] font-bold text-lg">
              {achievement.name}
            </div>
            <div className="text-[var(--color-bone)]/60 text-sm">
              {achievement.description}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
