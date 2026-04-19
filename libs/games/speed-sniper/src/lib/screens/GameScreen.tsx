import React from 'react';
import { SniperState } from '../types';
import GameArena from '../components/GameArena';
import { getMultiplierLabel } from '../scorer';

interface GameScreenProps {
  state: SniperState;
  onTokenClick: (isCorrect: boolean, text: string) => void;
  onTokenExit: () => void;
  onPause: () => void;
  onResume: () => void;
}

export default function GameScreen({ state, onTokenClick, onTokenExit, onPause, onResume }: GameScreenProps) {
  const currentRoundData = state.content!.rounds[state.currentRound - 1];
  const isPaused = state.status === 'paused';
  const showFireEffect = state.comboCount >= 3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#0a0a1a', color: '#f8fafc', overflow: 'hidden', position: 'relative' }}>
      
      {/* Sleek Top Bar with Gradient */}
      <div style={{ 
        padding: '1.25rem 2rem', 
        background: 'linear-gradient(180deg, #0f172a 0%, transparent 100%)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        zIndex: 20 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#6366f1', textShadow: '0 0 15px rgba(99, 102, 241, 0.5)', letterSpacing: '-0.02em' }}>⚡ SNIPER</span>
          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 700, border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(4px)' }}>
            ROUND {state.currentRound} <span style={{ color: '#64748b', margin: '0 0.4rem' }}>/</span> 8
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {/* Glowing Score */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>Score</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f8fafc', textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}>{state.totalScore}</div>
          </div>
          
          {/* Dynamic Combo Bar */}
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>Combo</div>
            <div 
              className={showFireEffect ? "combo-fire" : ""}
              style={{ 
                fontSize: '1.75rem', 
                fontWeight: 900, 
                color: state.comboCount > 0 ? '#fbbf24' : '#475569',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: state.comboCount > 0 ? 'scale(1.1)' : 'scale(1)',
                textShadow: state.comboCount > 0 ? '0 0 20px rgba(251, 191, 36, 0.5)' : 'none'
              }}
            >
              {getMultiplierLabel(state.comboCount)}
            </div>
          </div>
          
          <button 
            onClick={isPaused ? onResume : onPause}
            style={{ 
              backgroundColor: 'rgba(51, 65, 85, 0.5)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              color: '#f8fafc', 
              padding: '0.6rem 1.25rem', 
              borderRadius: '0.75rem', 
              cursor: 'pointer', 
              fontSize: '0.875rem',
              fontWeight: 700,
              backdropFilter: 'blur(4px)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(51, 65, 85, 0.8)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(51, 65, 85, 0.5)'}
          >
            {isPaused ? '▶ RESUME' : '‖ PAUSE'}
          </button>
        </div>
      </div>

      {/* Question Banner */}
      <div style={{ padding: '2rem', textAlign: 'center', zIndex: 10 }}>
        <h2 style={{ 
          fontSize: '2rem', 
          margin: 0, 
          color: '#f8fafc', 
          maxWidth: '900px', 
          marginInline: 'auto',
          fontWeight: 800,
          lineHeight: 1.2,
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
        }}>
          {currentRoundData.question}
        </h2>
      </div>

      {/* Arena Area with Vignette */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Vignette Overlay */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          boxShadow: 'inset 0 0 150px 50px rgba(10, 10, 26, 0.9)', 
          pointerEvents: 'none', 
          zIndex: 5 
        }} />

        <GameArena 
          key={state.currentRound}
          answers={[currentRoundData.correctToken, ...currentRoundData.distractors]}
          correctAnswer={currentRoundData.correctToken}
          round={state.currentRound}
          onCorrectHit={() => onTokenClick(true, currentRoundData.correctToken)}
          onMiss={onTokenExit}
        />
        
        {isPaused && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10, 10, 26, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(8px)' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '2.5rem', letterSpacing: '0.1em' }}>PAUSED</h2>
              <button 
                onClick={onResume}
                style={{ 
                  padding: '1.25rem 4rem', 
                  borderRadius: '1rem', 
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
                  color: '#ffffff', 
                  fontSize: '1.5rem', 
                  fontWeight: 900, 
                  border: 'none', 
                  cursor: 'pointer',
                  boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)'
                }}
              >
                RESUME MISSION
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Progress Dots with Pulsing Active State */}
      <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.75rem', zIndex: 10 }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const isActive = i + 1 === state.currentRound;
          const isDone = i + 1 < state.currentRound;
          
          return (
            <div 
              key={i}
              style={{ 
                width: '14px', 
                height: '14px', 
                borderRadius: '50%', 
                backgroundColor: isDone ? '#22c55e' : isActive ? '#6366f1' : '#1e293b',
                border: isActive ? '2px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: isActive ? '0 0 15px #6366f1' : 'none',
                animation: isActive ? 'pulse-dot 1.5s infinite' : 'none',
                transition: 'all 0.3s'
              }} 
            />
          );
        })}
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.8; }
        }
        @keyframes fire-glow {
          0%, 100% { text-shadow: 0 0 20px #fbbf24, 0 0 40px #f59e0b; }
          50% { text-shadow: 0 0 30px #fbbf24, 0 0 60px #f59e0b, 0 0 80px #ea580c; transform: scale(1.2); }
        }
        .combo-fire {
          animation: fire-glow 0.8s ease-in-out infinite;
          color: #fca5a5 !important;
        }
      `}</style>
    </div>
  );
}
