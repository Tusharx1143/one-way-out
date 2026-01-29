import { useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';

function App() {
  const {
    level,
    totalMistakes,
    maxMistakes,
    currentSentence,
    typed,
    isShaking,
    isFlashing,
    gameOver,
    bestScore,
    handleType,
    startGame,
  } = useGame();

  // Handle Enter to restart when game over
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver && e.key === 'Enter') {
        startGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, startGame]);

  if (gameOver) {
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
      onType={handleType}
    />
  );
}

export default App;
