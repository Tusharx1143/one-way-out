import { useState, useCallback, useEffect } from 'react';
import { getNewAchievements } from '../config/achievements';

const STORAGE_KEY = 'oneWayOut_stats';

function loadStats() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  
  return {
    totalGames: 0,
    bestLevel: 0,
    bestWpm: 0,
    bestCombo: 0,
    totalLevels: 0,
    unlockedAchievements: [],
    lastPlayed: null,
  };
}

function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {}
}

export function useStats() {
  const [stats, setStats] = useState(loadStats);
  const [newAchievements, setNewAchievements] = useState([]);

  // Save whenever stats change
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  const recordGame = useCallback((gameStats) => {
    const { level, wpm, maxCombo, difficulty, perfectStreak } = gameStats;
    
    setStats(prev => {
      const updated = {
        ...prev,
        totalGames: prev.totalGames + 1,
        bestLevel: Math.max(prev.bestLevel, level),
        bestWpm: Math.max(prev.bestWpm, wpm),
        bestCombo: Math.max(prev.bestCombo, maxCombo),
        totalLevels: prev.totalLevels + level,
        lastPlayed: Date.now(),
      };

      // Check for new achievements
      const checkStats = {
        level,
        wpm,
        maxCombo,
        difficulty,
        perfectStreak,
        totalGames: updated.totalGames,
      };

      const newlyUnlocked = getNewAchievements(checkStats, prev.unlockedAchievements);
      
      if (newlyUnlocked.length > 0) {
        updated.unlockedAchievements = [
          ...prev.unlockedAchievements,
          ...newlyUnlocked.map(a => a.id),
        ];
        setNewAchievements(newlyUnlocked);
      }

      return updated;
    });
  }, []);

  const clearNewAchievements = useCallback(() => {
    setNewAchievements([]);
  }, []);

  return {
    stats,
    newAchievements,
    recordGame,
    clearNewAchievements,
  };
}
