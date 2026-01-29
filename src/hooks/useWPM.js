import { useState, useCallback, useRef } from 'react';

export function useWPM() {
  const [wpm, setWpm] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  
  const startTimeRef = useRef(null);
  const totalCharsRef = useRef(0);

  const startTracking = useCallback(() => {
    startTimeRef.current = Date.now();
    totalCharsRef.current = 0;
    setWpm(0);
    setCombo(0);
  }, []);

  const recordKeystroke = useCallback(() => {
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }
    
    totalCharsRef.current += 1;
    
    // Calculate WPM (assuming average word = 5 characters)
    const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    if (elapsedMinutes > 0.01) { // At least 0.6 seconds
      const words = totalCharsRef.current / 5;
      const currentWpm = Math.round(words / elapsedMinutes);
      setWpm(Math.min(currentWpm, 200)); // Cap at 200 WPM
    }
  }, []);

  const incrementCombo = useCallback(() => {
    setCombo(prev => {
      const newCombo = prev + 1;
      setMaxCombo(current => Math.max(current, newCombo));
      return newCombo;
    });
  }, []);

  const resetCombo = useCallback(() => {
    setCombo(0);
  }, []);

  const reset = useCallback(() => {
    startTimeRef.current = null;
    totalCharsRef.current = 0;
    setWpm(0);
    setCombo(0);
    setMaxCombo(0);
  }, []);

  return {
    wpm,
    combo,
    maxCombo,
    startTracking,
    recordKeystroke,
    incrementCombo,
    resetCombo,
    reset,
  };
}
