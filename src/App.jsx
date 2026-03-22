import { useEffect, useState } from 'react';
import { useGame } from './hooks/useGame';
import { useSound } from './hooks/useSound';
import { useStats } from './hooks/useStats';
import { useAuth } from './hooks/useAuth';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { AchievementPopup } from './components/AchievementPopup';
import { StatsDialog } from './components/StatsDialog';
import { testFirebaseConnection } from './services/leaderboard';
import { initTheme } from './config/themes';
import { setGlobalVolume } from './hooks/useSound';

function App() {
  const sound = useSound();
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const { 
    stats, 
    newAchievements, 
    recordGame, 
    recordPractice, 
    recordKonami, 
    recordEasterEgg, 
    clearNewAchievements,
    updatePreference,
    updatePersonalization,
    toggleFavoriteTheme,
  } = useStats(user);
  const [showDeathScreen, setShowDeathScreen] = useState(false);
  const [gameRecorded, setGameRecorded] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  
  // Initialize theme and (optionally) test Firebase on app load
  useEffect(() => {
    initTheme();
    const enableTest = import.meta.env.DEV && import.meta.env.VITE_ENABLE_FIREBASE_TEST === 'true';
    if (enableTest) {
      testFirebaseConnection();
    }
  }, []);

  useEffect(() => {
    const currentVolume = stats.preferences?.volume;
    if (currentVolume !== undefined) {
      setGlobalVolume(currentVolume);
    }
  }, [stats.preferences?.volume]);
  
  const {
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
    isPowerUpShaking,
    isPowerUpFlashing,
    isLevelTransitioning,
    timeLeft,
    maxTime,
    combo,
    maxCombo,
    wpm,
    accuracy,
    perfectStreak,
    bestScore,
    handleType,
    startGame,
    startDailyChallenge,
    startEndlessMode,
    startStoryMode,
    allStories,
    activePowerUps,
    currentLevelPowerUp,
    streakMultiplier,
    selectedTheme,
    setSelectedTheme,
    isPaused,
    togglePause,
    endlessLives,
    currentStoryId,
    isStoryComplete,
    sentencesUsed,
  } = useGame(
    sound, 
    stats.recentlyUsedSentences || [],
    stats.preferences?.personalization?.useName 
      ? (user?.displayName || stats.preferences?.guestName || 'Player') 
      : null,
    stats.preferences?.favoriteThemes || []
  );

  // Mode specific ambience and button clicks
  useEffect(() => {
    if (gameState === 'playing') {
      sound.playModeAmbience(gameMode);
    }
  }, [gameState, gameMode, sound]);

  useEffect(() => {
    const handleGlobalClick = () => {
      sound.playClick();
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, [sound]);

  // Record game stats when game ends
  useEffect(() => {
    if (gameState === 'gameover' && !gameRecorded) {
      recordGame({
        level,
        wpm,
        accuracy,
        maxCombo,
        difficulty,
        perfectStreak,
        gameMode,
        storyId: currentStoryId,
        isStoryComplete,
        sentencesUsed,
      });

      if (level === 40) {
        recordEasterEgg('error404');
      }

      setGameRecorded(true);
    } else if (gameState === 'playing') {
      setGameRecorded(false);
    }
  }, [gameState, gameRecorded, recordGame, recordEasterEgg, level, wpm, accuracy, maxCombo, difficulty, perfectStreak, gameMode, currentStoryId, isStoryComplete, sentencesUsed]);

  // Delay showing game over screen for death animation
  useEffect(() => {
    if (gameState === 'gameover') {
      const timer = setTimeout(() => {
        setShowDeathScreen(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowDeathScreen(false);
    }
  }, [gameState]);

  // Handle Enter to restart when game over
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showDeathScreen && gameMode !== 'daily' && e.key === 'Enter') {
        startGame(difficulty);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDeathScreen, gameMode, difficulty, startGame]);

  // Handle restart
  const handleRestart = (selectedDifficulty) => {
    if (selectedDifficulty === null) {
      window.location.reload();
    } else if (gameMode === 'endless') {
      startEndlessMode(selectedDifficulty);
    } else {
      startGame(selectedDifficulty);
    }
  };

  // Handle quit from pause
  const handleQuitGame = () => {
    window.location.reload();
  };

  if (gameState === 'idle') {
    return (
      <>
        <StartScreen 
          onStart={startGame} 
          onStartDaily={startDailyChallenge}
          onStartEndless={startEndlessMode}
          onStartStory={startStoryMode}
          allStories={allStories}
          stats={stats}
          user={user}
          onSignIn={signInWithGoogle}
          onSignOut={signOut}
          authLoading={authLoading}
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
          onRecordPractice={recordPractice}
          onRecordKonami={recordKonami}
          onRecordEasterEgg={recordEasterEgg}
          updatePreference={updatePreference}
          updatePersonalization={updatePersonalization}
          toggleFavoriteTheme={toggleFavoriteTheme}
          onOpenStats={() => setShowStats(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenPractice={() => setShowPractice(true)}
          onOpenLeaderboard={() => {}} // Handle separately if needed
        />
        
        {/* Settings Dialog modal */}
        {showSettings && (
          <SettingsDialog
            onClose={() => setShowSettings(false)}
            stats={stats}
            user={user}
            onSignOut={signOut}
            selectedTheme={selectedTheme}
            onThemeChange={setSelectedTheme}
            updatePreference={updatePreference}
            updatePersonalization={updatePersonalization}
            toggleFavoriteTheme={toggleFavoriteTheme}
            onOpenPractice={() => setShowPractice(true)}
            onOpenCredits={() => setShowCredits(true)}
            onOpenStats={() => setShowStats(true)}
          />
        )}

        {/* Practice Mode modal */}
        {showPractice && (
          <PracticeMode
            onClose={() => setShowPractice(false)}
            onRecordPractice={recordPractice}
          />
        )}

        {/* Credits Dialog modal */}
        {showCredits && (
          <CreditsDialog
            onClose={() => setShowCredits(false)}
          />
        )}

        <AchievementPopup 
          achievements={newAchievements} 
          onDone={clearNewAchievements}
        />

        {/* Stats Dialog modal */}
        {showStats && (
          <StatsDialog
            stats={stats}
            user={user}
            onClose={() => setShowStats(false)}
            readOnly={false}
          />
        )}
      </>
    );
  }

  if (gameState === 'gameover') {
    if (!showDeathScreen) {
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
          isPowerUpShaking={false}
          isPowerUpFlashing={false}
          isLevelTransitioning={false}
          timeLeft={0}
          maxTime={maxTime}
          combo={combo}
          wpm={wpm}
          difficulty={difficulty}
          isGameOver={true}
          onType={() => {}}
          streakMultiplier={streakMultiplier}
          gameMode={gameMode}
          activePowerUps={activePowerUps}
          currentLevelPowerUp={currentLevelPowerUp}
          isPaused={isPaused}
          onTogglePause={togglePause}
          onQuitGame={handleQuitGame}
          endlessLives={endlessLives}
        />
      );
    }
    
    return (
      <>
        <GameOverScreen 
          level={level} 
          bestScore={bestScore}
          maxCombo={maxCombo}
          wpm={wpm}
          accuracy={accuracy}
          difficulty={difficulty}
          gameMode={gameMode}
          onRestart={handleRestart}
          perfectStreak={perfectStreak}
        />
        <AchievementPopup 
          achievements={newAchievements} 
          onDone={clearNewAchievements}
        />
      </>
    );
  }

  return (
    <>
      <GameScreen
        level={level}
        mistakes={totalMistakes}
        maxMistakes={maxMistakes}
        bestScore={bestScore}
        sentence={currentSentence}
        typed={typed}
        isShaking={isShaking}
        isFlashing={isFlashing}
        isPowerUpShaking={isPowerUpShaking}
        isPowerUpFlashing={isPowerUpFlashing}
        isLevelTransitioning={isLevelTransitioning}
        timeLeft={timeLeft}
        maxTime={maxTime}
        combo={combo}
        wpm={wpm}
        difficulty={difficulty}
        isGameOver={false}
        onType={handleType}
        streakMultiplier={streakMultiplier}
        gameMode={gameMode}
        activePowerUps={activePowerUps}
        currentLevelPowerUp={currentLevelPowerUp}
        isPaused={isPaused}
        onTogglePause={togglePause}
        onQuitGame={handleQuitGame}
        endlessLives={endlessLives}
      />
      <AchievementPopup 
        achievements={newAchievements} 
        onDone={clearNewAchievements}
      />
    </>
  );
}

export default App;
