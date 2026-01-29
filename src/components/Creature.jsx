import { useEffect, useState } from 'react';

export function Creature({ mistakes, maxMistakes, isGameOver }) {
  const [deathAnimation, setDeathAnimation] = useState(false);
  const [visible, setVisible] = useState(false);

  const proximity = mistakes / maxMistakes;

  useEffect(() => {
    if (mistakes > 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [mistakes]);

  useEffect(() => {
    if (isGameOver) {
      setDeathAnimation(true);
    } else {
      setDeathAnimation(false);
    }
  }, [isGameOver]);

  if (!visible && !isGameOver) return null;

  // Position and size based on proximity
  const xPosition = deathAnimation ? 50 : 90 - (proximity * 40);
  const scale = deathAnimation ? 2.5 : 0.5 + (proximity * 1);
  const opacity = deathAnimation ? 1 : 0.4 + (proximity * 0.6);
  const eyeGlow = deathAnimation ? 30 : 10 + (proximity * 20);

  return (
    <>
      {/* The Shadow */}
      <div
        className={`fixed top-1/2 -translate-y-1/2 pointer-events-none transition-all ${
          deathAnimation ? 'duration-500' : 'duration-700'
        } ease-out z-40`}
        style={{
          left: `${xPosition}%`,
          transform: `translateX(-50%) translateY(-50%) scale(${scale})`,
        }}
      >
        {/* Shadow body - simple dark blur */}
        <div
          className="relative"
          style={{
            width: '150px',
            height: '250px',
          }}
        >
          {/* Main shadow mass */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(ellipse at center, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,${opacity * 0.8}) 40%, transparent 70%)`,
              filter: `blur(${deathAnimation ? 5 : 15}px)`,
              transform: 'scaleY(1.5)',
            }}
          />
          
          {/* Eyes container */}
          <div 
            className="absolute flex gap-6 justify-center"
            style={{
              top: '35%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {/* Left eye */}
            <div
              className={`rounded-full ${deathAnimation ? 'animate-pulse' : ''}`}
              style={{
                width: deathAnimation ? '16px' : '12px',
                height: deathAnimation ? '24px' : '18px',
                backgroundColor: '#8b0000',
                boxShadow: `
                  0 0 ${eyeGlow}px ${eyeGlow / 2}px rgba(139, 0, 0, 0.8),
                  0 0 ${eyeGlow * 2}px ${eyeGlow}px rgba(139, 0, 0, 0.4),
                  inset 0 0 ${eyeGlow / 2}px rgba(255, 0, 0, 0.5)
                `,
                opacity: opacity,
              }}
            />
            
            {/* Right eye */}
            <div
              className={`rounded-full ${deathAnimation ? 'animate-pulse' : ''}`}
              style={{
                width: deathAnimation ? '16px' : '12px',
                height: deathAnimation ? '24px' : '18px',
                backgroundColor: '#8b0000',
                boxShadow: `
                  0 0 ${eyeGlow}px ${eyeGlow / 2}px rgba(139, 0, 0, 0.8),
                  0 0 ${eyeGlow * 2}px ${eyeGlow}px rgba(139, 0, 0, 0.4),
                  inset 0 0 ${eyeGlow / 2}px rgba(255, 0, 0, 0.5)
                `,
                opacity: opacity,
              }}
            />
          </div>
        </div>
      </div>

      {/* Death overlay */}
      {deathAnimation && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Darkness closing in */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.95) 60%)',
              animation: 'darknessClose 0.5s ease-out forwards',
            }}
          />
          
          {/* Red pulse */}
          <div 
            className="absolute inset-0 animate-pulse"
            style={{
              background: 'radial-gradient(circle at center, rgba(139, 0, 0, 0.3) 0%, transparent 50%)',
            }}
          />
        </div>
      )}

      {/* Ambient darkness - edges darken with proximity */}
      {!deathAnimation && (
        <div 
          className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, ${proximity * 0.7}) 100%)`,
          }}
        />
      )}

      <style>{`
        @keyframes darknessClose {
          from {
            background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0) 60%);
          }
          to {
            background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.95) 40%);
          }
        }
      `}</style>
    </>
  );
}
