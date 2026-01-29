import { useState, useCallback, useEffect } from 'react';
import { getNewAchievements } from '../config/achievements';
import { saveUserProfile, getUserProfile, submitScore, submitDailyScore, saveAchievements } from '../services/leaderboard';
import { getDailyChallengeId } from '../config/dailyChallenge';

const STORAGE_KEY = 'oneWayOut_stats';

function loadLocalStats() {
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

function saveLocalStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {}
}

export function useStats(user) {
  const [stats, setStats] = useState(loadLocalStats);
  const [newAchievements, setNewAchievements] = useState([]);
  const [syncing, setSyncing] = useState(false);

  // Load stats from Firebase when user logs in
  useEffect(() => {
    async function syncFromCloud() {
      if (!user) return;
      
      setSyncing(true);
      const cloudStats = await getUserProfile(user.uid);
      
      if (cloudStats) {
        // Merge local and cloud stats (take the best)
        setStats(prev => {
          const merged = {
            totalGames: Math.max(prev.totalGames, cloudStats.totalGames || 0),
            bestLevel: Math.max(prev.bestLevel, cloudStats.bestLevel || 0),
            bestWpm: Math.max(prev.bestWpm, cloudStats.bestWpm || 0),
            bestCombo: Math.max(prev.bestCombo, cloudStats.bestCombo || 0),
            totalLevels: Math.max(prev.totalLevels, cloudStats.totalLevels || 0),
            unlockedAchievements: [...new Set([
              ...(prev.unlockedAchievements || []),
              ...(cloudStats.achievements || [])
            ])],
            lastPlayed: Date.now(),
          };
          saveLocalStats(merged);
          return merged;
        });
      }
      
      setSyncing(false);
    }
    
    syncFromCloud();
  }, [user]);

  // Save to local storage whenever stats change
  useEffect(() => {
    saveLocalStats(stats);
  }, [stats]);

  const recordGame = useCallback(async (gameStats) => {
    const { level, wpm, maxCombo, difficulty, perfectStreak, gameMode } = gameStats;
    
    let newStats;
    
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

      newStats = updated;
      return updated;
    });

    // Sync to Firebase if logged in
    if (user && newStats) {
      // Save user profile
      await saveUserProfile(user.uid, {
        displayName: user.displayName,
        photoURL: user.photoURL,
        ...newStats,
        achievements: newStats.unlockedAchievements,
      });

      // Submit to leaderboard
      if (gameMode === 'daily') {
        await submitDailyScore(user.uid, {
          displayName: user.displayName,
          photoURL: user.photoURL,
          level,
          wpm,
          maxCombo,
        }, getDailyChallengeId());
      } else {
        await submitScore(user.uid, {
          displayName: user.displayName,
          photoURL: user.photoURL,
          level,
          wpm,
          maxCombo,
          difficulty,
        });
      }
    }
  }, [user]);

  const clearNewAchievements = useCallback(() => {
    setNewAchievements([]);
  }, []);

  return {
    stats,
    newAchievements,
    syncing,
    recordGame,
    clearNewAchievements,
  };
}
