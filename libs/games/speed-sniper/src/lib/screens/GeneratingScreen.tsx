import React, { useState, useEffect } from 'react';

const MESSAGES = [
  'Analyzing your content... 🔍',
  'Generating 8 unique questions... 🧠',
  'Creating tricky distractors... 🎯',
  'Almost ready to snipe... ⚡',
];

const TIPS = [
  '💡 Tip: Click the correct token before it drifts away!',
  '💡 Tip: Build combos for higher multipliers (x1.5, x2.0)',
  '💡 Tip: Wrong clicks reset your combo - choose wisely!',
  '💡 Tip: Tokens get faster every round - stay sharp!',
  '💡 Tip: You have 8 rounds - every point counts!',
];

export function GeneratingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex(i => (i + 1) % TIPS.length);
    }, 4000);
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) return 90;
        return p + (90 / (20 * 10));
      });
    }, 100);
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#0a0a1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        fontSize: '72px',
        animation: 'spin 2s linear infinite',
      }}>🎯</div>

      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#818cf8',
        margin: 0,
      }}>Preparing Your Challenge</h2>

      <p style={{
        fontSize: '16px',
        color: '#a5b4fc',
        margin: 0,
        minHeight: '24px',
        transition: 'opacity 0.3s',
      }}>{MESSAGES[msgIndex]}</p>

      <div style={{
        width: '300px',
        height: '6px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: progress + '%',
          height: '100%',
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          borderRadius: '10px',
          transition: 'width 0.1s linear',
        }} />
      </div>

      <div style={{
        marginTop: '32px',
        padding: '16px 24px',
        background: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '12px',
        maxWidth: '400px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#94a3b8',
        minHeight: '48px',
        transition: 'opacity 0.3s',
      }}>
        {TIPS[tipIndex]}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default GeneratingScreen;
