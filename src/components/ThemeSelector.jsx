import { THEMES, getUnlockedThemes, applyTheme } from '../config/themes';

export function ThemeSelector({ selectedTheme, achievements, onThemeChange }) {
  const unlockedThemes = getUnlockedThemes(achievements);
  
  const handleThemeChange = (themeId) => {
    applyTheme(themeId);
    onThemeChange(themeId);
  };
  
  return (
    <div className="w-full max-w-2xl bg-[#111] border border-[var(--color-bone)]/20 rounded-lg p-6">
      <h2 className="text-[var(--color-bone)] font-bold text-lg mb-4">⚙️ Themes</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(THEMES).map(([id, theme]) => {
          const isUnlocked = !!unlockedThemes[id];
          const isSelected = selectedTheme === id;
          
          return (
            <button
              key={id}
              onClick={() => isUnlocked && handleThemeChange(id)}
              disabled={!isUnlocked}
              className={`p-4 border-2 rounded transition-all ${
                isSelected
                  ? 'border-[var(--color-bone)] bg-[var(--color-bone)]/10'
                  : isUnlocked
                  ? 'border-[var(--color-bone)]/30 hover:border-[var(--color-bone)]/60'
                  : 'border-[var(--color-bone)]/10 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-2xl mb-2">{theme.icon}</div>
              <div className="text-sm font-bold text-[var(--color-bone)]">{theme.name}</div>
              {!isUnlocked && (
                <div className="text-xs text-[var(--color-bone)]/50 mt-1">
                  Locked
                </div>
              )}
              {isSelected && (
                <div className="text-xs text-green-400 mt-1">✓ Active</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
