import { useCallback, useRef, useEffect } from 'react';

// Create audio context lazily (browsers require user interaction first)
let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// Generate sounds programmatically (no external files needed)
function playTone(frequency, duration, type = 'square', volume = 0.1) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio not supported or blocked
  }
}

function playNoise(duration, volume = 0.1) {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    
    noise.buffer = buffer;
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    noise.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    noise.start();
  } catch (e) {
    // Audio not supported
  }
}

export function useSound() {
  const heartbeatRef = useRef(null);
  const heartbeatSpeed = useRef(1000);

  // Keystroke sound - subtle click
  const playKeystroke = useCallback(() => {
    playTone(800 + Math.random() * 200, 0.05, 'square', 0.03);
  }, []);

  // Error sound - harsh buzz
  const playError = useCallback(() => {
    playNoise(0.15, 0.2);
    playTone(150, 0.15, 'sawtooth', 0.15);
  }, []);

  // Success sound - gentle chime
  const playSuccess = useCallback(() => {
    playTone(523, 0.1, 'sine', 0.08); // C5
    setTimeout(() => playTone(659, 0.1, 'sine', 0.08), 50); // E5
    setTimeout(() => playTone(784, 0.15, 'sine', 0.08), 100); // G5
  }, []);

  // Game over sound - descending doom
  const playGameOver = useCallback(() => {
    playTone(400, 0.3, 'sawtooth', 0.15);
    setTimeout(() => playTone(300, 0.3, 'sawtooth', 0.15), 200);
    setTimeout(() => playTone(200, 0.5, 'sawtooth', 0.2), 400);
    setTimeout(() => playNoise(0.5, 0.15), 600);
  }, []);

  // Tick sound for timer
  const playTick = useCallback(() => {
    playTone(1000, 0.02, 'square', 0.02);
  }, []);

  // Warning tick (when time is low)
  const playWarningTick = useCallback(() => {
    playTone(200, 0.1, 'square', 0.1);
  }, []);

  // Heartbeat - gets faster with more mistakes
  const startHeartbeat = useCallback((mistakes) => {
    // Speed up based on mistakes: 1000ms -> 400ms
    heartbeatSpeed.current = Math.max(400, 1000 - (mistakes * 150));
    
    if (heartbeatRef.current) return; // Already running
    
    const beat = () => {
      playTone(60, 0.1, 'sine', 0.1);
      setTimeout(() => playTone(50, 0.15, 'sine', 0.08), 100);
      
      heartbeatRef.current = setTimeout(beat, heartbeatSpeed.current);
    };
    beat();
  }, []);

  const updateHeartbeat = useCallback((mistakes) => {
    heartbeatSpeed.current = Math.max(400, 1000 - (mistakes * 150));
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearTimeout(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopHeartbeat();
  }, [stopHeartbeat]);

  return {
    playKeystroke,
    playError,
    playSuccess,
    playGameOver,
    playTick,
    playWarningTick,
    startHeartbeat,
    updateHeartbeat,
    stopHeartbeat,
  };
}
