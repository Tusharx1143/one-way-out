import { useState, useCallback, useEffect, useRef } from 'react';
import sentences from '../data/sentences.json';
import { DIFFICULTIES, getTimerDuration, getMaxMistakes, getMinSentenceLevel } from '../config/difficulty';
import { getDailyChallengeSentences, markDailyPlayed, saveDailyBest } from '../config/dailyChallenge';

function getSentenceForLevel(level, difficulty, sentencePool = null) {
  const pool = sentencePool || sentences;
  
  if (sentencePool) {
    // Daily challenge: use sentences in order
    const index = Math.min(level - 1, pool.length - 1);
    return pool[index];
  }
  
  const minLevel = getMinSentenceLevel(difficulty);
  const effectiveLevel = Math.max(level, minLevel);
  
  const available = pool.filter(s => s.level <= effectiveLevel && s.level >= minLevel);
  if (available.length === 0) return pool[0];
  
  const weighted = available.filter(s => s.level >= effectiveLevel - 5);
  const finalPool = weighted.length > 0 ? weighted : available;
  
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

export function useGame(soundHooks = {}) {
  const { playKeystroke, playError, playSuccess, playGameOver, playTick, playWarningTick, startHeartbeat, updateHeartbeat, stopHeartbeat } = soundHooks;

  const [gameState, setGameState] = useState('idle');
  const [gameMode, setGameMode] = useState('normal'); // normal, daily
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
  const [perfectStreak, setPerfectStreak] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('oneWayOut_bestScore') || '0', 10);
  });

  const timerRef = useRef(null);
  const lastTickRef = useRef(0);
  const wpmStartRef = useRef(null);
  const totalCharsRef = useRef(0);
  const sentencePoolRef = useRef(null);
  const mistakesThisLevelRef = useRef(0);

  const maxMistakes = gameMode === 'daily' ? 5 : getMaxMistakes(difficulty);

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
      mistakesThisLevelRef.current += 1;
      const newMistakes = totalMistakes + 1;
      setTotalMistakes(newMistakes);
      setCombo(0);
      setPerfectStreak(0);
      
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
        
        if (gameMode === 'daily') {
          markDailyPlayed();
          saveDailyBest(level);
        }
        
        setGameState('gameover');
      } else {
        const newLevel = level + 1;
        setLevel(newLevel);
        setTyped('');
        mistakesThisLevelRef.current = 0;
        const sentence = getSentenceForLevel(newLevel, difficulty, sentencePoolRef.current);
        setCurrentSentence(sentence.text);
        startTimer(gameMode === 'daily' ? 12 : getTimerDuration(newLevel, difficulty));
      }
    }
  }, [timeLeft, gameState, totalMistakes, level, difficulty, gameMode, maxMistakes, clearTimer, startTimer, playError, playGameOver, updateHeartbeat, stopHeartbeat]);

  const startGame = useCallback((selectedDifficulty = 'normal') => {
    setGameMode('normal');
    setDifficulty(selectedDifficulty);
    sentencePoolRef.current = null;
    setLevel(1);
    setTotalMistakes(0);
    setTyped('');
    setCombo(0);
    setMaxCombo(0);
    setWpm(0);
    setPerfectStreak(0);
    mistakesThisLevelRef.current = 0;
    wpmStartRef.current = null;
    totalCharsRef.current = 0;
    setGameState('playing');
    
    const sentence = getSentenceForLevel(1, selectedDifficulty);
    setCurrentSentence(sentence.text);
    const duration = getTimerDuration(1, selectedDifficulty);
    startTimer(duration);
    startHeartbeat?.(0);
  }, [startTimer, startHeartbeat]);

  const startDailyChallenge = useCallback(() => {
    setGameMode('daily');
    setDifficulty('normal');
    sentencePoolRef.current = getDailyChallengeSentences(sentences);
    setLevel(1);
    setTotalMistakes(0);
    setTyped('');
    setCombo(0);
    setMaxCombo(0);
    setWpm(0);
    setPerfectStreak(0);
    mistakesThisLevelRef.current = 0;
    wpmStartRef.current = null;
    totalCharsRef.current = 0;
    setGameState('playing');
    
    const sentence = sentencePoolRef.current[0];
    setCurrentSentence(sentence.text);
    startTimer(12); // Fixed timer for daily
    startHeartbeat?.(0);
  }, [startTimer, startHeartbeat]);

  const handleType = useCallback((input) => {
    if (gameState !== 'playing') return;

    const newChar = input.slice(-1);
    const expectedChar = currentSentence[typed.length];

    if (newChar === expectedChar) {
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
        
        const newCombo = combo + 1;
        setCombo(newCombo);
        setMaxCombo(prev => Math.max(prev, newCombo));
        
        // Track perfect streak (no mistakes this level)
        if (mistakesThisLevelRef.current === 0) {
          setPerfectStreak(prev => prev + 1);
        } else {
          setPerfectStreak(0);
        }
        
        const newLevel = level + 1;
        setLevel(newLevel);
        setTyped('');
        mistakesThisLevelRef.current = 0;
        
        const sentence = getSentenceForLevel(newLevel, difficulty, sentencePoolRef.current);
        setCurrentSentence(sentence.text);
        startTimer(gameMode === 'daily' ? 12 : getTimerDuration(newLevel, difficulty));
        
        if (newLevel > bestScore) {
          setBestScore(newLevel);
          localStorage.setItem('oneWayOut_bestScore', newLevel.toString());
        }
      }
    } else {
      playError?.();
      mistakesThisLevelRef.current += 1;
      setCombo(0);
      setPerfectStreak(0);
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
        
        if (gameMode === 'daily') {
          markDailyPlayed();
          saveDailyBest(level);
        }
        
        setGameState('gameover');
      }
    }
  }, [gameState, currentSentence, typed, level, difficulty, gameMode, totalMistakes, combo, maxMistakes, bestScore, playKeystroke, playError, playSuccess, playGameOver, updateHeartbeat, stopHeartbeat, clearTimer, startTimer]);

  useEffect(() => {
    return () => {
      clearTimer();
      stopHeartbeat?.();
    };
  }, [clearTimer, stopHeartbeat]);

  return {
    gameState,
    gameMode,
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
    perfectStreak,
    bestScore,
    handleType,
    startGame,
    startDailyChallenge,
  };
}
