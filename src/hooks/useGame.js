import { useState, useCallback, useEffect, useRef } from 'react';
import sentences from '../data/sentences.json';
import { DIFFICULTIES, getTimerDuration, getMaxMistakes, getMinSentenceLevel } from '../config/difficulty';

function getSentenceForLevel(level, difficulty) {
  const minLevel = getMinSentenceLevel(difficulty);
  const effectiveLevel = Math.max(level, minLevel);
  
  const available = sentences.filter(s => s.level <= effectiveLevel && s.level >= minLevel);
  if (available.length === 0) return sentences[0];
  
  const weighted = available.filter(s => s.level >= effectiveLevel - 5);
  const pool = weighted.length > 0 ? weighted : available;
  
  return pool[Math.floor(Math.random() * pool.length)];
}

export function useGame(soundHooks = {}) {
  const { playKeystroke, playError, playSuccess, playGameOver, playTick, playWarningTick, startHeartbeat, updateHeartbeat, stopHeartbeat } = soundHooks;

  const [gameState, setGameState] = useState('idle');
  const [difficulty, setDifficulty] = useState('normal');
  const [level, setLevel] = useState(1);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [currentSentence, setCurrentSentence] = useState('');
  const [typed, setTyped] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [maxTime, setMaxTime] = useState(15);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('oneWayOut_bestScore') || '0', 10);
  });

  const timerRef = useRef(null);
  const lastTickRef = useRef(0);
  const wpmStartRef = useRef(null);
  const totalCharsRef = useRef(0);

  const maxMistakes = getMaxMistakes(difficulty);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback((duration) => {
    clearTimer();
    setTimeLeft(duration);
    setMaxTime(duration);
    lastTickRef.current = 0;
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 0.1;
        
        const wholeSecond = Math.ceil(newTime);
        if (wholeSecond !== lastTickRef.current && wholeSecond > 0) {
          lastTickRef.current = wholeSecond;
          if (wholeSecond <= 3) {
            playWarningTick?.();
          } else {
            playTick?.();
          }
        }
        
        if (newTime <= 0) return 0;
        return newTime;
      });
    }, 100);
  }, [clearTimer, playTick, playWarningTick]);

  // Handle timer expiry
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    if (timeLeft <= 0) {
      const newMistakes = totalMistakes + 1;
      setTotalMistakes(newMistakes);
      setCombo(0); // Reset combo on timeout
      
      setIsShaking(true);
      setIsFlashing(true);
      setTimeout(() => setIsShaking(false), 150);
      setTimeout(() => setIsFlashing(false), 200);
      
      playError?.();
      updateHeartbeat?.(newMistakes);
      
      if (newMistakes >= maxMistakes) {
        clearTimer();
        stopHeartbeat?.();
        playGameOver?.();
        setGameState('gameover');
      } else {
        const newLevel = level + 1;
        setLevel(newLevel);
        setTyped('');
        setCurrentSentence(getSentenceForLevel(newLevel, difficulty).text);
        startTimer(getTimerDuration(newLevel, difficulty));
      }
    }
  }, [timeLeft, gameState, totalMistakes, level, difficulty, maxMistakes, clearTimer, startTimer, playError, playGameOver, updateHeartbeat, stopHeartbeat]);

  const startGame = useCallback((selectedDifficulty = 'normal') => {
    setDifficulty(selectedDifficulty);
    setLevel(1);
    setTotalMistakes(0);
    setTyped('');
    setCombo(0);
    setMaxCombo(0);
    setWpm(0);
    wpmStartRef.current = null;
    totalCharsRef.current = 0;
    setGameState('playing');
    
    const sentence = getSentenceForLevel(1, selectedDifficulty);
    setCurrentSentence(sentence.text);
    const duration = getTimerDuration(1, selectedDifficulty);
    startTimer(duration);
    startHeartbeat?.(0);
  }, [startTimer, startHeartbeat]);

  const handleType = useCallback((input) => {
    if (gameState !== 'playing') return;

    const newChar = input.slice(-1);
    const expectedChar = currentSentence[typed.length];

    if (newChar === expectedChar) {
      // Track WPM
      if (!wpmStartRef.current) {
        wpmStartRef.current = Date.now();
      }
      totalCharsRef.current += 1;
      
      const elapsedMinutes = (Date.now() - wpmStartRef.current) / 60000;
      if (elapsedMinutes > 0.01) {
        const words = totalCharsRef.current / 5;
        setWpm(Math.min(Math.round(words / elapsedMinutes), 250));
      }

      playKeystroke?.();
      const newTyped = typed + newChar;
      setTyped(newTyped);

      if (newTyped === currentSentence) {
        playSuccess?.();
        
        // Increment combo
        const newCombo = combo + 1;
        setCombo(newCombo);
        setMaxCombo(prev => Math.max(prev, newCombo));
        
        const newLevel = level + 1;
        setLevel(newLevel);
        setTyped('');
        setCurrentSentence(getSentenceForLevel(newLevel, difficulty).text);
        startTimer(getTimerDuration(newLevel, difficulty));
        
        if (newLevel > bestScore) {
          setBestScore(newLevel);
          localStorage.setItem('oneWayOut_bestScore', newLevel.toString());
        }
      }
    } else {
      playError?.();
      setCombo(0); // Reset combo on mistake
      const newMistakes = totalMistakes + 1;
      setTotalMistakes(newMistakes);
      updateHeartbeat?.(newMistakes);
      
      setIsShaking(true);
      setIsFlashing(true);
      setTimeout(() => setIsShaking(false), 150);
      setTimeout(() => setIsFlashing(false), 200);

      if (newMistakes >= maxMistakes) {
        clearTimer();
        stopHeartbeat?.();
        playGameOver?.();
        setGameState('gameover');
      }
    }
  }, [gameState, currentSentence, typed, level, difficulty, totalMistakes, combo, maxMistakes, bestScore, playKeystroke, playError, playSuccess, playGameOver, updateHeartbeat, stopHeartbeat, clearTimer, startTimer]);

  useEffect(() => {
    return () => {
      clearTimer();
      stopHeartbeat?.();
    };
  }, [clearTimer, stopHeartbeat]);

  return {
    gameState,
    difficulty,
    level,
    totalMistakes,
    maxMistakes,
    currentSentence,
    typed,
    isShaking,
    isFlashing,
    timeLeft,
    maxTime,
    combo,
    maxCombo,
    wpm,
    bestScore,
    handleType,
    startGame,
  };
}
