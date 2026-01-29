export const ACHIEVEMENTS = {
  // Level achievements
  survivor: {
    id: 'survivor',
    name: 'Survivor',
    description: 'Reach level 5',
    icon: '🌟',
    check: (stats) => stats.level >= 5,
  },
  fighter: {
    id: 'fighter',
    name: 'Fighter',
    description: 'Reach level 10',
    icon: '⚔️',
    check: (stats) => stats.level >= 10,
  },
  warrior: {
    id: 'warrior',
    name: 'Warrior',
    description: 'Reach level 20',
    icon: '🛡️',
    check: (stats) => stats.level >= 20,
  },
  legend: {
    id: 'legend',
    name: 'Legend',
    description: 'Reach level 30',
    icon: '👑',
    check: (stats) => stats.level >= 30,
  },
  immortal: {
    id: 'immortal',
    name: 'Immortal',
    description: 'Reach level 50',
    icon: '💀',
    check: (stats) => stats.level >= 50,
  },

  // Combo achievements
  combo3: {
    id: 'combo3',
    name: 'Combo Starter',
    description: 'Get a 3x combo',
    icon: '🔥',
    check: (stats) => stats.maxCombo >= 3,
  },
  combo5: {
    id: 'combo5',
    name: 'On Fire',
    description: 'Get a 5x combo',
    icon: '🔥',
    check: (stats) => stats.maxCombo >= 5,
  },
  combo10: {
    id: 'combo10',
    name: 'Unstoppable',
    description: 'Get a 10x combo',
    icon: '💥',
    check: (stats) => stats.maxCombo >= 10,
  },

  // WPM achievements
  wpm50: {
    id: 'wpm50',
    name: 'Quick Fingers',
    description: 'Reach 50 WPM',
    icon: '⌨️',
    check: (stats) => stats.wpm >= 50,
  },
  wpm80: {
    id: 'wpm80',
    name: 'Speed Demon',
    description: 'Reach 80 WPM',
    icon: '⚡',
    check: (stats) => stats.wpm >= 80,
  },
  wpm100: {
    id: 'wpm100',
    name: 'Lightning Hands',
    description: 'Reach 100 WPM',
    icon: '🌩️',
    check: (stats) => stats.wpm >= 100,
  },

  // Difficulty achievements
  nightmareWin: {
    id: 'nightmareWin',
    name: 'Nightmare Survivor',
    description: 'Reach level 10 on Nightmare',
    icon: '😈',
    check: (stats) => stats.difficulty === 'nightmare' && stats.level >= 10,
  },
  casualMaster: {
    id: 'casualMaster',
    name: 'Casual Master',
    description: 'Reach level 30 on Casual',
    icon: '🎮',
    check: (stats) => stats.difficulty === 'casual' && stats.level >= 30,
  },

  // Special achievements
  perfect5: {
    id: 'perfect5',
    name: 'Perfect Run',
    description: 'Complete 5 levels without mistakes',
    icon: '✨',
    check: (stats) => stats.perfectStreak >= 5,
  },
  dedicated: {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Play 10 games',
    icon: '🎯',
    check: (stats) => stats.totalGames >= 10,
  },
  veteran: {
    id: 'veteran',
    name: 'Veteran',
    description: 'Play 50 games',
    icon: '🏅',
    check: (stats) => stats.totalGames >= 50,
  },
};

export function getUnlockedAchievements(stats) {
  return Object.values(ACHIEVEMENTS).filter(a => a.check(stats));
}

export function getNewAchievements(stats, previouslyUnlocked = []) {
  const currentUnlocked = getUnlockedAchievements(stats);
  return currentUnlocked.filter(a => !previouslyUnlocked.includes(a.id));
}
