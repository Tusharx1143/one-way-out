export const DIFFICULTIES = {
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

export function getTimerDuration(level, difficulty, sentenceLength = 20) {
  const config = DIFFICULTIES[difficulty];
  
  // Base characters per second (how fast player is expected to type)
  // Nightmare: 5-8 cps (60-96 WPM), Normal: 3.5-5.5 cps (42-66 WPM)
  let baseCps = 3.5;
  if (difficulty === 'nightmare') baseCps = 5 + (level / 12);
  else baseCps = 3.5 + (level / 18);

  // Time = Length / CPS + Level-based buffer
  const buffer = Math.max(3, 7 - (level / 8)); // Decaying buffer starting at 7s, min 3s
  const duration = (sentenceLength / baseCps) + buffer;
  
  return Math.max(config.minTime, duration);
}

export function getMaxMistakes(difficulty) {
  return DIFFICULTIES[difficulty].maxMistakes;
}

export function getMinSentenceLevel(difficulty) {
  return DIFFICULTIES[difficulty].minSentenceLevel;
}
