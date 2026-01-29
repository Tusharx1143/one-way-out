import { useEffect, useState, useRef } from 'react';

// Single arrow component
function Arrow({ id, startX, startY, delay, speed, isKillShot }) {
  const [fired, setFired] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setFired(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`absolute transition-all ${isKillShot ? 'duration-300' : 'duration-1000'} ease-in`}
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        transform: fired 
          ? `translateX(${isKillShot ? '-45vw' : '-30vw'}) rotate(-180deg) scale(${isKillShot ? 1.5 : 1})`
          : 'translateX(0) rotate(-180deg)',
        opacity: fired ? 1 : 0,
      }}
    >
      <svg 
        width={isKillShot ? "80" : "50"} 
        height={isKillShot ? "20" : "12"} 
        viewBox="0 0 50 12"
        className={isKillShot ? 'drop-shadow-[0_0_10px_rgba(139,0,0,0.8)]' : ''}
      >
        {/* Arrow shaft */}
        <line 
          x1="0" y1="6" x2="40" y2="6" 
          stroke={isKillShot ? "#8b0000" : "#f5f5dc"} 
          strokeWidth="2"
          opacity={isKillShot ? "1" : "0.6"}
        />
        {/* Arrow head */}
        <polygon 
          points="40,0 50,6 40,12" 
          fill={isKillShot ? "#8b0000" : "#f5f5dc"}
          opacity={isKillShot ? "1" : "0.7"}
        />
        {/* Fletching */}
        <polygon 
          points="0,2 8,6 0,10" 
          fill={isKillShot ? "#8b0000" : "#f5f5dc"}
          opacity={isKillShot ? "0.8" : "0.4"}
        />
      </svg>
    </div>
  );
}

export function Creature({ mistakes, maxMistakes, isGameOver }) {
  const [arrows, setArrows] = useState([]);
  const [killArrows, setKillArrows] = useState([]);
  const arrowIdRef = useRef(0);

  // Add arrows when mistakes increase
  useEffect(() => {
    if (mistakes > 0 && !isGameOver) {
      // Add multiple arrows per mistake
      const newArrows = [];
      const arrowCount = mistakes + 1; // More arrows with each mistake
      
      for (let i = 0; i < arrowCount; i++) {
        newArrows.push({
          id: arrowIdRef.current++,
          startX: 95 + Math.random() * 10,
          startY: 15 + Math.random() * 70,
          delay: i * 100 + Math.random() * 200,
          speed: 0.5 + Math.random() * 0.5,
        });
      }
      
      setArrows(prev => [...prev, ...newArrows]);
      
      // Clean up old arrows after animation
      setTimeout(() => {
        setArrows(prev => prev.slice(-20)); // Keep last 20 arrows max
      }, 2000);
    }
  }, [mistakes, isGameOver]);

  // Death sequence - barrage of arrows
  useEffect(() => {
    if (isGameOver) {
      const deathArrows = [];
      
      // First wave - immediate
      for (let i = 0; i < 8; i++) {
        deathArrows.push({
          id: arrowIdRef.current++,
          startX: 100 + Math.random() * 20,
          startY: 10 + (i * 10) + Math.random() * 5,
          delay: i * 50,
        });
      }
      
      // Second wave
      for (let i = 0; i < 10; i++) {
        deathArrows.push({
          id: arrowIdRef.current++,
          startX: 110 + Math.random() * 20,
          startY: 5 + Math.random() * 90,
          delay: 300 + i * 30,
        });
      }
      
      // Final wave - overwhelming
      for (let i = 0; i < 15; i++) {
        deathArrows.push({
          id: arrowIdRef.current++,
          startX: 120 + Math.random() * 30,
          startY: Math.random() * 100,
          delay: 500 + i * 20,
        });
      }
      
      setKillArrows(deathArrows);
    } else {
      setKillArrows([]);
      setArrows([]);
    }
  }, [isGameOver]);

  // Ambient arrows floating on right side (warning)
  const [ambientArrows, setAmbientArrows] = useState([]);
  
  useEffect(() => {
    if (mistakes > 0 && !isGameOver) {
      const ambient = [];
      const count = Math.min(mistakes * 2, 10);
      
      for (let i = 0; i < count; i++) {
        ambient.push({
          id: i,
          x: 85 + Math.random() * 15,
          y: 10 + Math.random() * 80,
          opacity: 0.2 + Math.random() * 0.3,
          scale: 0.5 + Math.random() * 0.5,
        });
      }
      setAmbientArrows(ambient);
    } else {
      setAmbientArrows([]);
    }
  }, [mistakes, isGameOver]);

  return (
    <>
      {/* Ambient arrows waiting on the right */}
      {ambientArrows.map(arrow => (
        <div
          key={`ambient-${arrow.id}`}
          className="fixed pointer-events-none z-30 animate-pulse"
          style={{
            left: `${arrow.x}%`,
            top: `${arrow.y}%`,
            opacity: arrow.opacity,
            transform: `scale(${arrow.scale}) rotate(-180deg)`,
          }}
        >
          <svg width="40" height="10" viewBox="0 0 50 12">
            <line x1="0" y1="6" x2="40" y2="6" stroke="#f5f5dc" strokeWidth="2" opacity="0.4"/>
            <polygon points="40,0 50,6 40,12" fill="#f5f5dc" opacity="0.5"/>
            <polygon points="0,2 8,6 0,10" fill="#f5f5dc" opacity="0.3"/>
          </svg>
        </div>
      ))}

      {/* Flying arrows on mistakes */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {arrows.map(arrow => (
          <Arrow
            key={arrow.id}
            id={arrow.id}
            startX={arrow.startX}
            startY={arrow.startY}
            delay={arrow.delay}
            speed={arrow.speed}
            isKillShot={false}
          />
        ))}
      </div>

      {/* Death arrows */}
      {isGameOver && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {killArrows.map(arrow => (
            <Arrow
              key={arrow.id}
              id={arrow.id}
              startX={arrow.startX}
              startY={arrow.startY}
              delay={arrow.delay}
              isKillShot={true}
            />
          ))}
          
          {/* Blood splatter on impact */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              animation: 'splatter 0.3s ease-out 0.8s forwards',
              opacity: 0,
            }}
          >
            <svg width="300" height="300" viewBox="0 0 300 300">
              <circle cx="150" cy="150" r="5" fill="#8b0000">
                <animate attributeName="r" from="5" to="100" dur="0.3s" fill="freeze" />
                <animate attributeName="opacity" from="0.8" to="0" dur="0.5s" fill="freeze" />
              </circle>
              {/* Splatter drops */}
              {[...Array(12)].map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const distance = 80 + Math.random() * 40;
                const x = 150 + Math.cos(angle) * distance;
                const y = 150 + Math.sin(angle) * distance;
                return (
                  <circle key={i} cx={x} cy={y} r="8" fill="#8b0000" opacity="0.7">
                    <animate attributeName="r" from="2" to="8" dur="0.2s" fill="freeze" />
                  </circle>
                );
              })}
            </svg>
          </div>

          {/* Screen darkens */}
          <div 
            className="absolute inset-0 bg-black"
            style={{
              animation: 'fadeIn 0.5s ease-out 1s forwards',
              opacity: 0,
            }}
          />
        </div>
      )}

      {/* Vignette that darkens with more mistakes */}
      {!isGameOver && mistakes > 0 && (
        <div 
          className="fixed inset-0 pointer-events-none z-20 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at center, transparent 40%, rgba(139, 0, 0, ${mistakes * 0.1}) 100%)`,
          }}
        />
      )}

      <style>{`
        @keyframes splatter {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.8; }
        }
      `}</style>
    </>
  );
}
