import { useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { useSound } from './hooks/useSound';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';

function App() {
  const sound = useSound();
  
  const {
    gameState,
    level,
    totalMistakes,
    maxMistakes,
    currentSentence,
    typed,
    isShaking,
    isFlashing,
    timeLeft,
    maxTime,
    bestScore,
    handleType,
    startGame,
  } = useGame(sound);

  // Handle Enter to restart when game over
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'gameover' && e.key === 'Enter') {
        startGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame]);

  if (gameState === 'idle') {
    return <StartScreen onStart={startGame} />;
  }

  if (gameState === 'gameover') {
    return (
      <GameOverScreen 
        level={level} 
        bestScore={bestScore}
        onRestart={startGame} 
      />
    );
  }

  return (
    <GameScreen
      level={level}
      mistakes={totalMistakes}
      maxMistakes={maxMistakes}
      bestScore={bestScore}
      sentence={currentSentence}
      typed={typed}
      isShaking={isShaking}
      isFlashing={isFlashing}
      timeLeft={timeLeft}
      maxTime={maxTime}
      onType={handleType}
    />
  );
}

export default App;
