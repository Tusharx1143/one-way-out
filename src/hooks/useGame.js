import { useState, useCallback, useEffect } from 'react';
import sentences from '../data/sentences.json';

const MAX_MISTAKES = 5;

function getSentenceForLevel(level) {
  // Find sentences at or below current level, prefer higher ones
  const available = sentences.filter(s => s.level <= level);
  if (available.length === 0) return sentences[0];
  
  // Weight toward harder sentences
  const weighted = available.filter(s => s.level >= level - 3);
  const pool = weighted.length > 0 ? weighted : available;
  
  return pool[Math.floor(Math.random() * pool.length)];
}

export function useGame() {
  const [level, setLevel] = useState(1);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [currentSentence, setCurrentSentence] = useState('');
  const [typed, setTyped] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('oneWayOut_bestScore') || '0', 10);
  });

  // Start new game
  const startGame = useCallback(() => {
    setLevel(1);
    setTotalMistakes(0);
    setTyped('');
    setGameOver(false);
    setCurrentSentence(getSentenceForLevel(1).text);
  }, []);

  // Initialize
  useEffect(() => {
    startGame();
  }, [startGame]);

  // Handle typing
  const handleType = useCallback((input) => {
    if (gameOver) return;

    const newChar = input.slice(-1);
    const expectedChar = currentSentence[typed.length];

    if (newChar === expectedChar) {
      // Correct
      const newTyped = typed + newChar;
      setTyped(newTyped);

      // Check if sentence complete
      if (newTyped === currentSentence) {
        const newLevel = level + 1;
        setLevel(newLevel);
        setTyped('');
        setCurrentSentence(getSentenceForLevel(newLevel).text);
        
        // Update best score
        if (newLevel > bestScore) {
          setBestScore(newLevel);
          localStorage.setItem('oneWayOut_bestScore', newLevel.toString());
        }
      }
    } else {
      // Mistake
      const newMistakes = totalMistakes + 1;
      setTotalMistakes(newMistakes);
      
      // Trigger effects
      setIsShaking(true);
      setIsFlashing(true);
      setTimeout(() => setIsShaking(false), 150);
      setTimeout(() => setIsFlashing(false), 200);

      if (newMistakes >= MAX_MISTAKES) {
        setGameOver(true);
      }
    }
  }, [gameOver, currentSentence, typed, level, totalMistakes, bestScore]);

  return {
    level,
    totalMistakes,
    maxMistakes: MAX_MISTAKES,
    currentSentence,
    typed,
    isShaking,
    isFlashing,
    gameOver,
    bestScore,
    handleType,
    startGame,
  };
}
