import React, { useEffect, useMemo } from 'react';
import { useSpeedSniper } from './useSpeedSniper';
import { SpeedSniperService } from './service';
import UploadScreen from './screens/UploadScreen';
import GeneratingScreen from './screens/GeneratingScreen';
import GameScreen from './screens/GameScreen';
import ResultsScreen from './screens/ResultsScreen';
import ErrorScreen from './screens/ErrorScreen';

export interface SpeedSniperProps {
  apiKey?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  onGameComplete?: (result: any) => void;
}

export function SpeedSniper({ apiKey, difficulty = 'easy', onGameComplete }: SpeedSniperProps) {
  const {
    state,
    setUploadSuccess,
    setGenerationSuccess,
    setError,
    handleTokenClick,
    handleTokenExit,
    pause,
    resume,
    reset,
  } = useSpeedSniper();

  const service = useMemo(() => new SpeedSniperService(), []);

  // Handle generation when resource is uploaded
  useEffect(() => {
    if (state.screen === 'generating' && state.resource && !state.content) {
      const activeApiKey = apiKey || (import.meta as any).env.VITE_OPENROUTER_API_KEY || '';
      
      if (!activeApiKey) {
        setError('API Key is missing. Please provide it via props or environment variables.');
        return;
      }

      service.generateContent(state.resource.text, activeApiKey, difficulty)
        .then(content => {
          setGenerationSuccess(content);
        })
        .catch(err => {
          setError(err.message || 'Failed to generate game content.');
        });
    }
  }, [state.screen, state.resource, state.content, apiKey, difficulty, service, setGenerationSuccess, setError]);

  // Handle game completion callback
  useEffect(() => {
    if (state.screen === 'results' && onGameComplete) {
      onGameComplete({
        totalScore: state.totalScore,
        roundsHit: state.roundResults.filter(r => r.hit).length,
        longestCombo: state.longestCombo,
      });
    }
  }, [state.screen, state.totalScore, state.roundResults, state.longestCombo, onGameComplete]);

  if (!state) return <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Initializing Mission Ops...</div>;

  return (
    <div className="speed-sniper-root" style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0, backgroundColor: '#0a0a1a', color: '#f8fafc', overflow: 'hidden', position: 'relative' }}>
      {state.screen === 'upload' && (
        <UploadScreen onUpload={setUploadSuccess} />
      )}
      {state.screen === 'generating' && (
        <GeneratingScreen />
      )}
      {state.screen === 'game' && state.content && (
        <GameScreen 
          state={state} 
          onTokenClick={handleTokenClick} 
          onTokenExit={handleTokenExit}
          onPause={pause}
          onResume={resume}
        />
      )}
      {state.screen === 'results' && (
        <ResultsScreen state={state} onReset={reset} />
      )}
      {state.screen === 'error' && (
        <ErrorScreen message={state.errorMessage || 'An unknown error occurred'} onRetry={reset} />
      )}
    </div>
  );
}

export default SpeedSniper;
