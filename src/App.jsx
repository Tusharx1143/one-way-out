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
  } = useGame(sound);

  // Handle Enter to restart when game over
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState === 'gameover' && e.key === 'Enter') {
        startGame(difficulty);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, difficulty, startGame]);

  // Handle restart - null difficulty means go back to menu
  const handleRestart = (selectedDifficulty) => {
    if (selectedDifficulty === null) {
      // Go back to start screen by refreshing state
      window.location.reload();
    } else {
      startGame(selectedDifficulty);
    }
  };

  if (gameState === 'idle') {
    return <StartScreen onStart={startGame} />;
  }

  if (gameState === 'gameover') {
    return (
      <GameOverScreen 
        level={level} 
        bestScore={bestScore}
        maxCombo={maxCombo}
        wpm={wpm}
        difficulty={difficulty}
        onRestart={handleRestart} 
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
      combo={combo}
      wpm={wpm}
      difficulty={difficulty}
      onType={handleType}
    />
  );
}

export default App;
