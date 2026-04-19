export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TokenState {
  id: string;
  text: string;
  isCorrect: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  status: 'floating' | 'hit' | 'wrong' | 'exited';
}

export interface SniperRound {
  roundNumber: number;
  question: string;
  correctToken: string;
  distractors: string[];
  speed: number;
}

export interface SniperContent {
  rounds: SniperRound[];
  difficulty: Difficulty;
  generatedAt: number;
}

export interface RoundResult {
  roundNumber: number;
  question: string;
  correctToken: string;
  hit: boolean;
  clickedToken: string | null;
  pointsEarned: number;
  comboAtRound: number;
  roundDurationMs: number;
}

export interface SniperSessionResult {
  sessionId: string;
  resourceId: string;
  totalScore: number;
  roundsHit: number;
  roundsMissed: number;
  longestCombo: number;
  timeTakenMs: number;
  roundResults: RoundResult[];
}

export type SniperScreen = 'upload' | 'generating' | 'game' | 'results' | 'error';

export interface SniperState {
  screen: SniperScreen;
  resource: { text: string; name: string } | null;
  content: SniperContent | null;
  currentRound: number;
  comboCount: number;
  longestCombo: number;
  totalScore: number;
  roundResults: RoundResult[];
  status: 'playing' | 'paused' | 'complete';
  errorMessage: string | null;
}

export type SniperAction =
  | { type: 'UPLOAD_SUCCESS'; payload: { text: string; name: string } }
  | { type: 'GENERATION_START' }
  | { type: 'GENERATION_SUCCESS'; payload: SniperContent }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'START_ROUND' }
  | { type: 'TOKEN_CLICKED'; payload: { isCorrect: boolean; tokenText: string } }
  | { type: 'TOKEN_EXITED' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RETRY' }
  | { type: 'RESET' };
