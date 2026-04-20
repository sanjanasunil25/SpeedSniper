import React, { useState, useEffect } from 'react';
import { SniperState } from '../types';

interface ResultsScreenProps {
  state: SniperState;
  onReset: () => void;
}

export default function ResultsScreen({ state, onReset }: ResultsScreenProps) {
  const hits = state.roundResults.filter(r => r.hit).length;
  const [displayScore, setDisplayScore] = useState(0);
  const [showRows, setShowRows] = useState(false);

  useEffect(() => {
    // Score count-up
    const duration = 1500;
    const steps = 60;
    const increment = state.totalScore / steps;
    let current = 0;
    
    const interval = setInterval(() => {
      current += increment;
      if (current >= state.totalScore) {
        setDisplayScore(state.totalScore);
        clearInterval(interval);
        setShowRows(true);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [state.totalScore]);
  
  const getTagline = () => {
    if (hits >= 8) return "Sniper Elite! 🏆";
    if (hits >= 6) return "Sharp Reflexes! ⚡";
    if (hits >= 4) return "Nice Shooting! 🎯";
    return "Keep Practicing! 📚";
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      padding: '24px 16px 80px',
      textAlign: 'center',
      backgroundColor: '#0a0a1a',
      color: '#f8fafc',
      position: 'relative',
      boxSizing: 'border-box',
    }}>
      {/* Background Star Burst Effect */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i}
            style={{ 
              position: 'absolute',
              width: '2px',
              height: '2px',
              backgroundColor: '#6366f1',
              borderRadius: '50%',
              left: '50%',
              top: '50%',
              boxShadow: '0 0 10px #6366f1',
              animation: `star-burst ${Math.random() * 2 + 1}s ease-out forwards`,
              animationDelay: `${Math.random() * 1}s`
            }}
          />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 4rem)',
          fontWeight: 900,
          color: '#f1f5f9',
          marginBottom: '0.5rem',
          textShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
          letterSpacing: '-0.02em'
        }}>MISSION COMPLETE</h1>
        <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)', marginBottom: '2rem', color: '#6366f1', fontWeight: 700 }}>{getTagline()}</h2>
        
        {/* Main Stats with Glowing Value */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '100%', marginBottom: '2rem' }}>
          {[
            { label: 'Total Score', value: displayScore, color: '#f8fafc', glow: 'rgba(255, 255, 255, 0.3)' },
            { label: 'Accuracy', value: `${hits} / 8`, color: '#6366f1', glow: 'rgba(99, 102, 241, 0.3)' },
            { label: 'Longest Combo', value: `${state.longestCombo}x`, color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.3)' },
            { label: 'Target Ratio', value: `${Math.round((hits/8)*100)}%`, color: '#f1f5f9', glow: 'rgba(255, 255, 255, 0.2)' }
          ].map((stat, i) => (
            <div key={i} style={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.4)', 
              padding: '2rem 1rem', 
              borderRadius: '1.5rem', 
              border: '1px solid rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              animation: `slide-up 0.5s ease-out forwards`,
              animationDelay: `${i * 0.1}s`,
              opacity: 0
            }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, marginBottom: '0.75rem' }}>{stat.label}</div>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 900, 
                color: stat.color,
                textShadow: `0 0 20px ${stat.glow}`
              }}>{stat.value}</div>
            </div>
          ))}
        </div>
        
        {/* Round Breakdown with Staggered Slide-in */}
        <div style={{ 
          width: '100%', 
          maxWidth: '700px', 
          marginInline: 'auto',
          backgroundColor: 'rgba(30, 41, 59, 0.2)', 
          borderRadius: '1.5rem', 
          padding: '2.5rem', 
          textAlign: 'left', 
          marginBottom: '4rem', 
          border: '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(8px)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ width: '8px', height: '24px', backgroundColor: '#6366f1', borderRadius: '4px' }} />
            Performance Intel
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {state.roundResults.map((result, i) => (
              <div 
                key={i} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem 1.5rem', 
                  backgroundColor: 'rgba(15, 23, 42, 0.4)',
                  borderRadius: '0.75rem',
                  borderLeft: `4px solid ${result.hit ? '#22c55e' : '#ef4444'}`,
                  boxShadow: result.hit ? '0 0 15px rgba(34, 197, 94, 0.1)' : '0 0 15px rgba(239, 68, 68, 0.1)',
                  transform: showRows ? 'translateX(0)' : 'translateX(-30px)',
                  opacity: showRows ? 1 : 0,
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transitionDelay: `${i * 0.1}s`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: result.hit ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem'
                  }}>
                    {result.hit ? '🎯' : '⭕'}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>Round {result.roundNumber}</span>
                </div>
                <div style={{ 
                  fontWeight: 900, 
                  fontSize: '1.125rem',
                  color: result.hit ? '#4ade80' : '#475569'
                }}>
                  {result.hit ? `+${result.pointsEarned}` : '0'} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>PTS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Play Again */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', paddingBottom: '24px' }}>
          <button
            onClick={onReset}
            className="play-again-btn"
            style={{
              padding: '1rem 3rem',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#ffffff',
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              fontWeight: 900,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'pulse-glow 2s infinite',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            NEW MISSION
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.4); }
          50% { box-shadow: 0 0 50px rgba(99, 102, 241, 0.7); transform: scale(1.02); }
        }
        .play-again-btn:hover {
          filter: brightness(1.2);
          transform: translateY(-4px) !important;
        }
        @media (min-width: 600px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
