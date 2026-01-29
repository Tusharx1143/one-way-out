export const DIFFICULTIES = {
  casual: {
    id: 'casual',
    name: 'CASUAL',
    description: 'For beginners',
    maxMistakes: 7,
    baseTime: 20,
    minTime: 8,
    timeLevelDivisor: 4, // Slower time decrease
    minSentenceLevel: 1,
    color: 'text-green-400',
  },
  normal: {
    id: 'normal',
    name: 'NORMAL',
    description: 'The standard experience',
    maxMistakes: 5,
    baseTime: 15,
    minTime: 5,
    timeLevelDivisor: 3,
    minSentenceLevel: 1,
    color: 'text-yellow-400',
  },
  nightmare: {
    id: 'nightmare',
    name: 'NIGHTMARE',
    description: 'No mercy',
    maxMistakes: 3,
    baseTime: 12,
    minTime: 4,
    timeLevelDivisor: 2, // Faster time decrease
    minSentenceLevel: 5, // Start with harder sentences
    color: 'text-[var(--color-blood-bright)]',
  },
};

export function getTimerDuration(level, difficulty) {
  const config = DIFFICULTIES[difficulty];
  return Math.max(config.minTime, config.baseTime - Math.floor(level / config.timeLevelDivisor));
}

export function getMaxMistakes(difficulty) {
  return DIFFICULTIES[difficulty].maxMistakes;
}

export function getMinSentenceLevel(difficulty) {
  return DIFFICULTIES[difficulty].minSentenceLevel;
}
