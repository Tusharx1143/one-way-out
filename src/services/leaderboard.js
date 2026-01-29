import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Save user profile and stats
export async function saveUserProfile(userId, data) {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving user profile:', err);
    return false;
  }
}

// Get user profile
export async function getUserProfile(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (err) {
    console.error('Error getting user profile:', err);
    return null;
  }
}

// Submit score to leaderboard
export async function submitScore(userId, userData) {
  try {
    const { displayName, photoURL, level, wpm, maxCombo, difficulty } = userData;
    
    // Save to main leaderboard
    const leaderboardRef = doc(db, 'leaderboard', `${difficulty}_${userId}`);
    
    // Get existing score
    const existing = await getDoc(leaderboardRef);
    const existingLevel = existing.exists() ? existing.data().level : 0;
    
    // Only update if new score is higher
    if (level > existingLevel) {
      await setDoc(leaderboardRef, {
        displayName: displayName || 'Anonymous',
        photoURL: photoURL || null,
        level,
        wpm,
        maxCombo,
        difficulty,
        userId,
        updatedAt: serverTimestamp(),
      });
    }
    
    return true;
  } catch (err) {
    console.error('Error submitting score:', err);
    return false;
  }
}

// Get leaderboard
export async function getLeaderboard(difficulty = 'normal', maxResults = 50) {
  try {
    const leaderboardRef = collection(db, 'leaderboard');
    const q = query(
      leaderboardRef,
      where('difficulty', '==', difficulty),
      orderBy('level', 'desc'),
      orderBy('wpm', 'desc'),
      limit(maxResults)
    );
    
    const snapshot = await getDocs(q);
    const results = [];
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    
    return results;
  } catch (err) {
    console.error('Error getting leaderboard:', err);
    return [];
  }
}

// Submit daily challenge score
export async function submitDailyScore(userId, userData, dailyId) {
  try {
    const { displayName, photoURL, level, wpm, maxCombo } = userData;
    
    const dailyRef = doc(db, 'daily', `${dailyId}_${userId}`);
    
    // Get existing score
    const existing = await getDoc(dailyRef);
    const existingLevel = existing.exists() ? existing.data().level : 0;
    
    // Only update if new score is higher
    if (level > existingLevel) {
      await setDoc(dailyRef, {
        displayName: displayName || 'Anonymous',
        photoURL: photoURL || null,
        level,
        wpm,
        maxCombo,
        dailyId,
        userId,
        updatedAt: serverTimestamp(),
      });
    }
    
    return true;
  } catch (err) {
    console.error('Error submitting daily score:', err);
    return false;
  }
}

// Get daily leaderboard
export async function getDailyLeaderboard(dailyId, maxResults = 50) {
  try {
    const dailyRef = collection(db, 'daily');
    const q = query(
      dailyRef,
      where('dailyId', '==', dailyId),
      orderBy('level', 'desc'),
      orderBy('wpm', 'desc'),
      limit(maxResults)
    );
    
    const snapshot = await getDocs(q);
    const results = [];
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    
    return results;
  } catch (err) {
    console.error('Error getting daily leaderboard:', err);
    return [];
  }
}

// Save achievements to user profile
export async function saveAchievements(userId, achievements) {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      achievements,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving achievements:', err);
    return false;
  }
}
