import { useState, useCallback, useEffect, useRef } from 'react';
import sentences from '../data/sentences.json';

const MAX_MISTAKES = 5;

// Timer duration decreases with level (starts at 15s, minimum 5s)
function getTimerDuration(level) {
  return Math.max(5, 15 - Math.floor(level / 3));
}

function getSentenceForLevel(level) {
  const available = sentences.filter(s => s.level <= level);
  if (available.length === 0) return sentences[0];
  
  const weighted = available.filter(s => s.level >= level - 3);
  const pool = weighted.length > 0 ? weighted : available;
  
  return pool[Math.floor(Math.random() * pool.length)];
}

export function useGame(soundHooks = {}) {
  const { playKeystroke, playError, playSuccess, playGameOver, playTick, playWarningTick, startHeartbeat, updateHeartbeat, stopHeartbeat } = soundHooks;

  const [gameState, setGameState] = useState('idle'); // idle, playing, gameover
  const [level, setLevel] = useState(1);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [currentSentence, setCurrentSentence] = useState('');
  const [typed, setTyped] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [maxTime, setMaxTime] = useState(15);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('oneWayOut_bestScore') || '0', 10);
  });

  const timerRef = useRef(null);
  const lastTickRef = useRef(0);

  // Clear timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start timer for current level
  const startTimer = useCallback((duration) => {
    clearTimer();
    setTimeLeft(duration);
    setMaxTime(duration);
    lastTickRef.current = 0;
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 0.1;
        
        // Play tick sounds
        const wholeSecond = Math.ceil(newTime);
        if (wholeSecond !== lastTickRef.current && wholeSecond > 0) {
          lastTickRef.current = wholeSecond;
          if (wholeSecond <= 3) {
            playWarningTick?.();
          } else {
            playTick?.();
          }
        }
        
        if (newTime <= 0) {
          return 0;
        }
        return newTime;
      });
    }, 100);
  }, [clearTimer, playTick, playWarningTick]);

  // Handle timer expiry (counts as a mistake)
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    if (timeLeft <= 0) {
      const newMistakes = totalMistakes + 1;
      setTotalMistakes(newMistakes);
      
      setIsShaking(true);
      setIsFlashing(true);
      setTimeout(() => setIsShaking(false), 150);
      setTimeout(() => setIsFlashing(false), 200);
      
      playError?.();
      updateHeartbeat?.(newMistakes);
      
      if (newMistakes >= MAX_MISTAKES) {
        clearTimer();
        stopHeartbeat?.();
        playGameOver?.();
        setGameState('gameover');
      } else {
        // Move to next sentence
        const newLevel = level + 1;
        setLevel(newLevel);
        setTyped('');
        setCurrentSentence(getSentenceForLevel(newLevel).text);
        startTimer(getTimerDuration(newLevel));
      }
    }
  }, [timeLeft, gameState, totalMistakes, level, clearTimer, startTimer, playError, playGameOver, updateHeartbeat, stopHeartbeat]);

  // Start new game
  const startGame = useCallback(() => {
    setLevel(1);
    setTotalMistakes(0);
    setTyped('');
    setGameState('playing');
    const sentence = getSentenceForLevel(1);
    setCurrentSentence(sentence.text);
    const duration = getTimerDuration(1);
    startTimer(duration);
    startHeartbeat?.(0);
  }, [startTimer, startHeartbeat]);

  // Handle typing
  const handleType = useCallback((input) => {
    if (gameState !== 'playing') return;

    const newChar = input.slice(-1);
    const expectedChar = currentSentence[typed.length];

    if (newChar === expectedChar) {
      playKeystroke?.();
      const newTyped = typed + newChar;
      setTyped(newTyped);

      if (newTyped === currentSentence) {
        playSuccess?.();
        const newLevel = level + 1;
        setLevel(newLevel);
        setTyped('');
        setCurrentSentence(getSentenceForLevel(newLevel).text);
        
        // Reset timer with new duration
        startTimer(getTimerDuration(newLevel));
        
        if (newLevel > bestScore) {
          setBestScore(newLevel);
          localStorage.setItem('oneWayOut_bestScore', newLevel.toString());
        }
      }
    } else {
      playError?.();
      const newMistakes = totalMistakes + 1;
      setTotalMistakes(newMistakes);
      updateHeartbeat?.(newMistakes);
      
      setIsShaking(true);
      setIsFlashing(true);
      setTimeout(() => setIsShaking(false), 150);
      setTimeout(() => setIsFlashing(false), 200);

      if (newMistakes >= MAX_MISTAKES) {
        clearTimer();
        stopHeartbeat?.();
        playGameOver?.();
        setGameState('gameover');
      }
    }
  }, [gameState, currentSentence, typed, level, totalMistakes, bestScore, playKeystroke, playError, playSuccess, playGameOver, updateHeartbeat, stopHeartbeat, clearTimer, startTimer]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearTimer();
      stopHeartbeat?.();
    };
  }, [clearTimer, stopHeartbeat]);

  return {
    gameState,
    level,
    totalMistakes,
    maxMistakes: MAX_MISTAKES,
    currentSentence,
    typed,
    isShaking,
    isFlashing,
    timeLeft,
    maxTime,
    bestScore,
    handleType,
    startGame,
  };
}
