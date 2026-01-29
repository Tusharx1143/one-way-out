// Seeded random number generator
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Get today's date as a seed number (YYYYMMDD)
function getTodaySeed() {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

// Shuffle array with seed
function shuffleWithSeed(array, seed) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get daily challenge sentences
export function getDailyChallengeSentences(allSentences) {
  const seed = getTodaySeed();
  
  // Shuffle all sentences with today's seed
  const shuffled = shuffleWithSeed(allSentences, seed);
  
  // Return first 50 sentences (enough for a good run)
  return shuffled.slice(0, 50);
}

// Get daily challenge ID (for tracking completion)
export function getDailyChallengeId() {
  return getTodaySeed().toString();
}

// Check if daily has been played today
export function hasDailyBeenPlayed() {
  const todayId = getDailyChallengeId();
  const lastPlayed = localStorage.getItem('oneWayOut_dailyPlayed');
  return lastPlayed === todayId;
}

// Mark daily as played
export function markDailyPlayed() {
  localStorage.setItem('oneWayOut_dailyPlayed', getDailyChallengeId());
}

// Get daily best score
export function getDailyBest() {
  const todayId = getDailyChallengeId();
  const data = localStorage.getItem('oneWayOut_dailyBest');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (parsed.id === todayId) {
        return parsed.level;
      }
    } catch (e) {}
  }
  return 0;
}

// Save daily best score
export function saveDailyBest(level) {
  const todayId = getDailyChallengeId();
  const current = getDailyBest();
  if (level > current) {
    localStorage.setItem('oneWayOut_dailyBest', JSON.stringify({
      id: todayId,
      level,
    }));
  }
}

// Format time until next daily
export function getTimeUntilNextDaily() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}
