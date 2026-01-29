import { useEffect, useState } from 'react';
import { useGame } from './hooks/useGame';
import { useSound } from './hooks/useSound';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';

function App() {
  const sound = useSound();
  const [showDeathScreen, setShowDeathScreen] = useState(false);
  
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

  // Delay showing game over screen for death animation
  useEffect(() => {
    if (gameState === 'gameover') {
      // Show death animation first
      const timer = setTimeout(() => {
        setShowDeathScreen(true);
      }, 1500); // Wait for creature attack animation
      return () => clearTimeout(timer);
    } else {
      setShowDeathScreen(false);
    }
  }, [gameState]);

  // Handle Enter to restart when game over
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showDeathScreen && e.key === 'Enter') {
        startGame(difficulty);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDeathScreen, difficulty, startGame]);

  // Handle restart - null difficulty means go back to menu
  const handleRestart = (selectedDifficulty) => {
    if (selectedDifficulty === null) {
      window.location.reload();
    } else {
      startGame(selectedDifficulty);
    }
  };

  if (gameState === 'idle') {
    return <StartScreen onStart={startGame} />;
  }

  // Show game screen during death animation, then game over
  if (gameState === 'gameover') {
    if (!showDeathScreen) {
      // Still showing death animation
      return (
        <GameScreen
          level={level}
          mistakes={totalMistakes}
          maxMistakes={maxMistakes}
          bestScore={bestScore}
          sentence={currentSentence}
          typed={typed}
          isShaking={false}
          isFlashing={false}
          timeLeft={0}
          maxTime={maxTime}
          combo={combo}
          wpm={wpm}
          difficulty={difficulty}
          isGameOver={true}
          onType={() => {}}
        />
      );
    }
    
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
      isGameOver={false}
      onType={handleType}
    />
  );
}

export default App;
