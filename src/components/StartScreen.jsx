import { useEffect, useState } from 'react';
import { DIFFICULTIES } from '../config/difficulty';
import { hasDailyBeenPlayed, getDailyBest, getTimeUntilNextDaily } from '../config/dailyChallenge';
import { AuthButton } from './AuthButton';
import { Leaderboard } from './Leaderboard';
import { PracticeMode } from './PracticeMode';
import { StatsDialog } from './StatsDialog';
import { SettingsDialog } from './SettingsDialog';
import { CreditsDialog } from './CreditsDialog';
import { ACHIEVEMENTS } from '../config/achievements';
import pkg from '../../package.json';

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const SECRET_CREATORS = ['tusharx1143', 'shubhamtaral'];
const SECRET_JUMPSCARE = 'jumpscare';

export function StartScreen({ 
  onStart, 
  onStartDaily, 
  onStartEndless, 
  onStartStory, 
  allStories, 
  stats, 
  user, 
  onSignIn, 
  onSignOut, 
  authLoading, 
  onRecordKonami, 
  onRecordEasterEgg, 
  onOpenStats, 
  onOpenSettings 
}) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal');
  const [flicker, setFlicker] = useState(false);
  const [ready, setReady] = useState(false);
  const [showMode, setShowMode] = useState('main');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const dailyPlayed = hasDailyBeenPlayed();
  const dailyBest = getDailyBest();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (showMode === 'main') {
        if (key === 'p') setShowMode('difficulty');
        if (key === 'd') !dailyPlayed && onStartDaily();
        if (key === 'e') onStartEndless('normal');
        if (key === 's') setShowMode('stories');
        if (key === 'l') setShowLeaderboard(true);
        if (key === 'g') onOpenSettings();
        if (key === 't') onOpenStats();
      } else if (showMode === 'difficulty') {
        if (key === 'escape') setShowMode('main');
        if (key === '1') onStart('casual');
        if (key === '2') onStart('normal');
        if (key === '3') onStart('nightmare');
      } else if (showMode === 'stories') {
        if (key === 'escape') setShowMode('main');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMode, onStart, onStartDaily, onStartEndless, dailyPlayed, onOpenSettings, onOpenStats]);

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const handleKey = (e) => {
      if (showLeaderboard) return;

      if (showMode === 'difficulty') {
        if (e.key === 'Enter' || e.key === ' ') {
          onStart(selectedDifficulty);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          const keys = Object.keys(DIFFICULTIES);
          const idx = keys.indexOf(selectedDifficulty);
          setSelectedDifficulty(keys[Math.max(0, idx - 1)]);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          const keys = Object.keys(DIFFICULTIES);
          const idx = keys.indexOf(selectedDifficulty);
          setSelectedDifficulty(keys[Math.min(keys.length - 1, idx + 1)]);
        } else if (e.key === 'Escape') {
          setShowMode('main');
        }
      }

      // Konami Code logic
      if (showMode === 'main' && !showLeaderboard) {
        if (e.key === KONAMI_CODE[konamiIndex]) {
          const newIndex = konamiIndex + 1;
          if (newIndex === KONAMI_CODE.length) {
            // Unlocked Konami!
            if (onRecordKonami) {
              onRecordKonami();
            }
            // Add a visual flash effect for finding the easter egg
            setFlicker(true);
            setTimeout(() => setFlicker(false), 500);
            setKonamiIndex(0); // Reset
          } else {
            setKonamiIndex(newIndex);
          }
        } else {
          setKonamiIndex(0); // Failed sequence, reset
        }
      }

      // Word tracking for other easter eggs
      if (showMode === 'main' && !showLeaderboard && e.key.length === 1) {
        setTypedBuffer(prev => {
          const newBuffer = (prev + e.key.toLowerCase()).slice(-20); // Keep last 20 chars

          if (SECRET_CREATORS.some(creator => newBuffer.includes(creator))) {
            if (onRecordEasterEgg) onRecordEasterEgg('creator');
            setFlicker(true);
            setTimeout(() => setFlicker(false), 800);
            return ''; // Reset buffer
          }

          if (newBuffer.includes(SECRET_JUMPSCARE)) {
            if (onRecordEasterEgg) onRecordEasterEgg('jumpscare');
            setFlicker(true);
            setTimeout(() => setFlicker(false), 200);
            return ''; // Reset buffer
          }

          return newBuffer;
        });
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onStart, selectedDifficulty, ready, showMode, showLeaderboard, konamiIndex, onRecordKonami, onRecordEasterEgg]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(true);
      setTimeout(() => setFlicker(false), 100);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.getModifierState) {
        setCapsLockActive(e.getModifierState('CapsLock'));
      }
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
    };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-8 transition-opacity duration-100 ${flicker ? 'opacity-70' : 'opacity-100'}`}>
      {/* Caps lock warning for start screen */}
      {capsLockActive && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 animate-pulse">
          <div className="bg-red-500/20 border border-red-500/50 text-red-500 px-4 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            CAPS LOCK ACTIVE
          </div>
        </div>
      )}

      {/* Auth button in top right */}
      <div className="absolute top-4 right-4">
        <AuthButton
          user={user}
          onSignIn={onSignIn}
          onSignOut={onSignOut}
          loading={authLoading}
        />
      </div>

      <h1 className="text-4xl md:text-8xl font-bold tracking-[0.2em] md:tracking-[0.3em] mb-4 text-[var(--color-bone)] uppercase">
        ONE WAY OUT
      </h1>

      <p className="text-[var(--color-bone)]/40 text-lg md:text-xl mb-12 tracking-widest uppercase">
        TYPE OR DIE
      </p>

      {showMode === 'main' && (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => setShowMode('difficulty')}
            className="py-4 px-8 border-2 border-[var(--color-bone)] text-[var(--color-bone)] hover:bg-[var(--color-bone)] hover:text-[var(--color-void)] transition-all font-bold tracking-wider text-lg uppercase"
          >
            PLAY
          </button>

          <button
            onClick={() => setShowMode('endless')}
            className="py-4 px-8 border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-[var(--color-void)] transition-all font-bold tracking-wider text-lg"
          >
            ♾️ ENDLESS MODE
          </button>

          <button
            disabled
            className="py-4 px-8 border-2 border-red-500/20 text-red-500/30 relative group cursor-not-allowed font-bold tracking-wider text-lg uppercase bg-red-950/5"
          >
            📖 STORY MODE
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[8px] px-2 py-1 rounded font-black tracking-widest opacity-90 uppercase animate-pulse whitespace-nowrap">
              LOCKED: Reach 1000 Likes On LinkedIn Post
            </span>
          </button>

          <button
            onClick={() => !dailyPlayed && onStartDaily()}
            disabled={dailyPlayed}
            className={`py-4 px-8 border-2 transition-all font-bold tracking-wider uppercase ${dailyPlayed
                ? 'border-[var(--color-bone)]/20 text-[var(--color-bone)]/30 cursor-not-allowed'
                : 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-[var(--color-void)]'
              }`}
          >
            <div>📅 DAILY CHALLENGE</div>
            {dailyPlayed ? (
              <div className="text-xs mt-1 font-normal">
                Completed! Best: Level {dailyBest} • Next in {getTimeUntilNextDaily()}
              </div>
            ) : (
              <div className="text-xs mt-1 font-normal opacity-70">
                Same sentences for everyone today
              </div>
            )}
          </button>

          <button
            onClick={() => setShowLeaderboard(true)}
            className="py-3 px-8 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 transition-all text-sm tracking-wider uppercase"
          >
            🏆 LEADERBOARD
          </button>

          {stats && stats.totalGames > 0 && (
            <button
              onClick={onOpenStats}
              className="py-3 px-8 border border-[var(--color-bone)]/30 text-[var(--color-bone)]/60 hover:border-[var(--color-bone)]/60 hover:text-[var(--color-bone)] transition-all text-sm tracking-wider uppercase"
            >
              📊 YOUR STATS
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="py-3 px-8 border border-[var(--color-bone)]/30 text-[var(--color-bone)]/60 hover:border-[var(--color-bone)]/60 hover:text-[var(--color-bone)] transition-all text-sm tracking-wider uppercase"
          >
            ⚙️ SETTINGS
          </button>
          
          <div className="text-[var(--color-bone)]/10 text-[8px] uppercase tracking-widest text-center mt-1">
            v{pkg.version}
          </div>
        </div>
      )}

      {showMode === 'difficulty' && (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {Object.values(DIFFICULTIES).map((diff) => (
              <button
                key={diff.id}
                onClick={() => {
                  setSelectedDifficulty(diff.id);
                  if (ready) onStart(diff.id);
                }}
                className={`px-6 py-4 border-2 transition-all duration-200 min-w-[140px] ${selectedDifficulty === diff.id
                    ? `border-[var(--color-bone)] ${diff.color} scale-105`
                    : 'border-[var(--color-bone)]/20 text-[var(--color-bone)]/40 hover:border-[var(--color-bone)]/40'
                  }`}
              >
                <div className="font-bold tracking-wider">{diff.name}</div>
                <div className="text-xs mt-1 opacity-60 uppercase">{diff.maxMistakes} LIVES</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowMode('main')}
            className="text-[var(--color-bone)]/40 hover:text-[var(--color-bone)]/60 text-sm uppercase"
          >
            ← Back
          </button>
        </>
      )}

      {showMode === 'endless' && (
        <>
          <div className="mb-6 text-center">
            <h2 className="text-2xl text-purple-500 font-bold mb-2">ENDLESS MODE</h2>
            <p className="text-[var(--color-bone)]/50 text-sm">
              No timer. 10 lives. Type forever.
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-8 w-full max-w-xs">
            <button
              onClick={() => {
                if (ready) onStartEndless('normal');
              }}
              className="px-8 py-4 border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-[var(--color-void)] transition-all font-bold tracking-wider text-lg"
            >
              START
            </button>
          </div>

          <button
            onClick={() => setShowMode('main')}
            className="text-[var(--color-bone)]/40 hover:text-[var(--color-bone)]/60 text-sm"
          >
            ← Back
          </button>
        </>
      )}

      {showMode === 'stories' && (
        <>
          <div className="mb-6 text-center">
            <h2 className="text-2xl text-orange-500 font-bold mb-2 uppercase">STORY MODE</h2>
            <p className="text-[var(--color-bone)]/50 text-sm uppercase tracking-wider">
              Experience the narrative one sentence at a time.
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-8 w-full max-w-sm">
            {allStories.map((story) => (
              <button
                key={story.id}
                onClick={() => {
                  if (ready) onStartStory(story.id);
                }}
                className="group p-4 border-2 border-orange-500/30 hover:border-orange-500 text-left transition-all"
              >
                <div className="text-orange-500 font-bold tracking-wider uppercase mb-1">{story.name}</div>
                <div className="text-xs text-[var(--color-bone)]/60 group-hover:text-[var(--color-bone)]/80 uppercase">{story.description}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowMode('main')}
            className="text-[var(--color-bone)]/40 hover:text-[var(--color-bone)]/60 text-sm"
          >
            ← Back
          </button>
        </>
      )}

      {showMode === 'main' && (
        <div className="absolute bottom-8 text-[var(--color-bone)]/20 text-xs text-center">
          <div>type fast • survive long • don't die</div>
          {!user && <div className="mt-2">Sign in to save progress & compete on leaderboard</div>}
        </div>
      )}

      {/* Leaderboard modal */}
      {showLeaderboard && (
        <Leaderboard
          onClose={() => setShowLeaderboard(false)}
          currentUserId={user?.uid}
        />
      )}
    </div>
  );
}
