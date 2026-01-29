import { useEffect, useState } from 'react';

// SVG creature - shadowy horror figure
const CreatureSVG = ({ opacity, scale }) => (
  <svg 
    viewBox="0 0 200 400" 
    className="w-full h-full"
    style={{ 
      filter: `blur(${Math.max(0, 3 - scale * 2)}px) drop-shadow(0 0 20px rgba(139, 0, 0, ${opacity * 0.5}))`,
    }}
  >
    {/* Shadow base */}
    <ellipse cx="100" cy="380" rx={60 * scale} ry="15" fill="rgba(0,0,0,0.5)" />
    
    {/* Body - tall shadowy form */}
    <path
      d={`
        M 100 50
        C 60 80, 50 150, 55 250
        C 50 300, 60 350, 80 380
        L 120 380
        C 140 350, 150 300, 145 250
        C 150 150, 140 80, 100 50
      `}
      fill="rgba(10, 10, 10, 0.95)"
      stroke="rgba(139, 0, 0, 0.3)"
      strokeWidth="1"
    />
    
    {/* Tattered edges */}
    <path
      d={`
        M 55 250 Q 40 270, 50 290 Q 35 310, 55 330
        M 145 250 Q 160 270, 150 290 Q 165 310, 145 330
      `}
      fill="none"
      stroke="rgba(10, 10, 10, 0.9)"
      strokeWidth="8"
    />
    
    {/* Eyes - glowing red */}
    <ellipse cx="80" cy="120" rx="8" ry="12" fill={`rgba(139, 0, 0, ${0.8 + opacity * 0.2})`}>
      <animate attributeName="ry" values="12;10;12" dur="3s" repeatCount="indefinite" />
    </ellipse>
    <ellipse cx="120" cy="120" rx="8" ry="12" fill={`rgba(139, 0, 0, ${0.8 + opacity * 0.2})`}>
      <animate attributeName="ry" values="12;10;12" dur="3s" repeatCount="indefinite" />
    </ellipse>
    
    {/* Eye glow */}
    <ellipse cx="80" cy="120" rx="4" ry="6" fill={`rgba(255, 50, 50, ${opacity})`} />
    <ellipse cx="120" cy="120" rx="4" ry="6" fill={`rgba(255, 50, 50, ${opacity})`} />
    
    {/* Mouth - jagged */}
    {opacity > 0.5 && (
      <path
        d="M 75 170 L 85 180 L 95 170 L 105 180 L 115 170 L 125 180"
        fill="none"
        stroke={`rgba(139, 0, 0, ${opacity})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
    )}
    
    {/* Reaching hands */}
    {opacity > 0.3 && (
      <>
        <path
          d={`M 50 200 Q 30 220, 25 250 Q 20 260, 15 255 M 25 250 Q 22 265, 18 262 M 25 250 Q 28 268, 23 265`}
          fill="none"
          stroke="rgba(10, 10, 10, 0.9)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d={`M 150 200 Q 170 220, 175 250 Q 180 260, 185 255 M 175 250 Q 178 265, 182 262 M 175 250 Q 172 268, 177 265`}
          fill="none"
          stroke="rgba(10, 10, 10, 0.9)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </>
    )}
  </svg>
);

export function Creature({ mistakes, maxMistakes, isGameOver }) {
  const [deathAnimation, setDeathAnimation] = useState(false);
  const [visible, setVisible] = useState(false);

  // Calculate creature proximity (0 = far, 1 = very close)
  const proximity = mistakes / maxMistakes;
  
  // Start showing after first mistake
  useEffect(() => {
    if (mistakes > 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [mistakes]);

  // Death animation
  useEffect(() => {
    if (isGameOver) {
      setDeathAnimation(true);
    } else {
      setDeathAnimation(false);
    }
  }, [isGameOver]);

  if (!visible && !isGameOver) return null;

  // Position: starts far right, moves closer to center
  const xPosition = deathAnimation ? 50 : 85 - (proximity * 35); // 85% -> 50%
  const scale = deathAnimation ? 1.5 : 0.3 + (proximity * 0.7); // Gets bigger as it approaches
  const opacity = deathAnimation ? 1 : 0.3 + (proximity * 0.7);

  return (
    <>
      {/* Creature */}
      <div
        className={`fixed top-0 bottom-0 pointer-events-none transition-all ${
          deathAnimation ? 'duration-700' : 'duration-500'
        } ease-out z-40`}
        style={{
          left: `${xPosition}%`,
          transform: `translateX(-50%) scale(${scale})`,
          opacity: opacity,
          width: '200px',
        }}
      >
        <div className={`h-full flex items-center ${deathAnimation ? 'animate-pulse' : ''}`}>
          <CreatureSVG opacity={opacity} scale={scale} />
        </div>
      </div>

      {/* Death overlay - creature attacks */}
      {deathAnimation && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Blood red vignette */}
          <div 
            className="absolute inset-0 animate-pulse"
            style={{
              background: 'radial-gradient(circle at center, transparent 0%, rgba(139, 0, 0, 0.8) 100%)',
              animation: 'pulse 0.5s ease-in-out infinite',
            }}
          />
          
          {/* Claw marks */}
          <svg className="absolute inset-0 w-full h-full opacity-0 animate-[fadeIn_0.3s_0.5s_forwards]">
            <line x1="20%" y1="10%" x2="40%" y2="90%" stroke="rgba(139, 0, 0, 0.8)" strokeWidth="4" />
            <line x1="35%" y1="5%" x2="55%" y2="95%" stroke="rgba(139, 0, 0, 0.6)" strokeWidth="3" />
            <line x1="60%" y1="8%" x2="80%" y2="92%" stroke="rgba(139, 0, 0, 0.8)" strokeWidth="4" />
            <line x1="75%" y1="3%" x2="95%" y2="88%" stroke="rgba(139, 0, 0, 0.6)" strokeWidth="3" />
          </svg>
        </div>
      )}

      {/* Ambient dread - edges darken with proximity */}
      {!deathAnimation && (
        <div 
          className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, ${proximity * 0.6}) 100%)`,
            opacity: proximity,
          }}
        />
      )}
    </>
  );
}
