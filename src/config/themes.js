export const THEMES = {
  normal: {
    id: 'normal',
    name: 'Normal',
    icon: '👻',
    colors: {
      bone: '#D4AF37',
      bloodBright: '#FF4444',
      void: '#0a0a0a',
    },
    unlocked: true,
  },
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    icon: '🌙',
    colors: {
      bone: '#888888',
      bloodBright: '#CC3333',
      void: '#0a0a0a',
    },
    unlockedBy: 'reach_level_20', // Achievement requirement
  },
  bloodRed: {
    id: 'bloodRed',
    name: 'Blood Red',
    icon: '🩸',
    colors: {
      bone: '#FF6666',
      bloodBright: '#FF0000',
      void: '#330000',
    },
    unlockedBy: 'reach_level_50',
  },
  neon: {
    id: 'neon',
    name: 'Neon Nightmare',
    icon: '⚡',
    colors: {
      bone: '#00FF00',
      bloodBright: '#FF00FF',
      void: '#0a0a0a',
    },
    unlockedBy: 'perfect_streak_10',
  },
  ice: {
    id: 'ice',
    name: 'Frozen Wasteland',
    icon: '❄️',
    colors: {
      bone: '#00FFFF',
      bloodBright: '#00CCFF',
      void: '#001a33',
    },
    unlockedBy: 'survive_60',
  },
};

export function getUnlockedThemes(achievements) {
  const unlocked = {};
  
  Object.entries(THEMES).forEach(([key, theme]) => {
    if (theme.unlocked) {
      unlocked[key] = theme;
    } else if (theme.unlockedBy && achievements?.includes(theme.unlockedBy)) {
      unlocked[key] = theme;
    }
  });
  
  return unlocked;
}

export function applyTheme(themeId) {
  const theme = THEMES[themeId];
  if (!theme) return;
  
  const root = document.documentElement;
  root.style.setProperty('--color-bone', theme.colors.bone);
  root.style.setProperty('--color-blood-bright', theme.colors.bloodBright);
  root.style.setProperty('--color-void', theme.colors.void);
  
  localStorage.setItem('oneWayOut_selectedTheme', themeId);
}

export function initTheme() {
  const savedTheme = localStorage.getItem('oneWayOut_selectedTheme') || 'normal';
  applyTheme(savedTheme);
  return savedTheme;
}
