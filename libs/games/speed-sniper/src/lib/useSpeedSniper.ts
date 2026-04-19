import { useReducer, useCallback } from 'react';
import { SniperState, SniperAction, SniperContent, RoundResult } from './types';
import { calculateRoundScore } from './scorer';

const initialState: SniperState = {
  screen: 'upload',
  resource: null,
  content: null,
  currentRound: 0,
  comboCount: 0,
  longestCombo: 0,
  totalScore: 0,
  roundResults: [],
  status: 'playing',
  errorMessage: null,
};

function reducer(state: SniperState, action: SniperAction): SniperState {
  switch (action.type) {
    case 'UPLOAD_SUCCESS':
      return { ...state, resource: action.payload, screen: 'generating' };
    case 'GENERATION_START':
      return { ...state, screen: 'generating' };
    case 'GENERATION_SUCCESS':
      return { ...state, content: action.payload, screen: 'game', currentRound: 1 };
    case 'SET_ERROR':
      return { ...state, errorMessage: action.payload, screen: 'error' };
    case 'START_ROUND':
      return { ...state, status: 'playing' };
    case 'TOKEN_CLICKED': {
      if (!state.content) return state;
      const { isCorrect } = action.payload;
      
      if (!isCorrect) {
        return {
          ...state,
          comboCount: 0,
          status: 'playing',
          // Round does NOT advance
        };
      }

      const newCombo = state.comboCount + 1;
      const score = calculateRoundScore(true, newCombo);
      const currentRoundData = state.content.rounds[state.currentRound - 1];
      
      const result: RoundResult = {
        roundNumber: state.currentRound,
        question: currentRoundData.question,
        correctToken: currentRoundData.correctToken,
        hit: true,
        clickedToken: action.payload.tokenText,
        pointsEarned: score,
        comboAtRound: newCombo,
        roundDurationMs: 0, // Simplified for now
      };

      const isLastRound = state.currentRound === 8;
      
      return {
        ...state,
        comboCount: newCombo,
        longestCombo: Math.max(state.longestCombo, newCombo),
        totalScore: state.totalScore + score,
        roundResults: [...state.roundResults, result],
        status: 'playing',
        currentRound: isLastRound ? state.currentRound : state.currentRound + 1,
        screen: isLastRound ? 'results' : 'game',
      };
    }
    case 'TOKEN_EXITED': {
      if (!state.content) return state;
      const newCombo = 0;
      const currentRoundData = state.content.rounds[state.currentRound - 1];
      
      const result: RoundResult = {
        roundNumber: state.currentRound,
        question: currentRoundData.question,
        correctToken: currentRoundData.correctToken,
        hit: false,
        clickedToken: null,
        pointsEarned: 0,
        comboAtRound: 0,
        roundDurationMs: 0,
      };

      const isLastRound = state.currentRound === 8;

      return {
        ...state,
        comboCount: newCombo,
        roundResults: [...state.roundResults, result],
        currentRound: isLastRound ? state.currentRound : state.currentRound + 1,
        screen: isLastRound ? 'results' : 'game',
      };
    }
    case 'PAUSE':
      return { ...state, status: 'paused' };
    case 'RESUME':
      return { ...state, status: 'playing' };
    case 'RETRY':
      return { ...state, screen: 'generating', errorMessage: null };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useSpeedSniper() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setUploadSuccess = useCallback((text: string, name: string) => {
    dispatch({ type: 'UPLOAD_SUCCESS', payload: { text, name } });
  }, []);

  const setGenerationSuccess = useCallback((content: SniperContent) => {
    dispatch({ type: 'GENERATION_SUCCESS', payload: content });
  }, []);

  const setError = useCallback((msg: string) => {
    dispatch({ type: 'SET_ERROR', payload: msg });
  }, []);

  const handleTokenClick = useCallback((isCorrect: boolean, tokenText: string) => {
    dispatch({ type: 'TOKEN_CLICKED', payload: { isCorrect, tokenText } });
  }, []);

  const handleTokenExit = useCallback(() => {
    dispatch({ type: 'TOKEN_EXITED' });
  }, []);

  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const resume = useCallback(() => dispatch({ type: 'RESUME' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    state,
    setUploadSuccess,
    setGenerationSuccess,
    setError,
    handleTokenClick,
    handleTokenExit,
    pause,
    resume,
    reset,
  };
}
