import React from 'react';

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#ef4444' }}>⚠️</div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong</h1>
      <p style={{ color: '#94a3b8', fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '500px' }}>{message}</p>
      <button
        onClick={onRetry}
        style={{ padding: '0.75rem 2rem', borderRadius: '0.5rem', backgroundColor: '#38bdf8', color: '#0f172a', fontSize: '1.125rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
      >
        Try Again
      </button>
    </div>
  );
}
