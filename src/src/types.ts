export type AppState =
  | 'welcome'
  | 'age-verification'
  | 'game-selection'
  | 'truth-or-dare'
  | 'kiffe-ou-kiffe-pas'
  | 'karma-sutra'
  | 'puzzle'
  | 'stop-tergiverser'
  | 'store'
  | 'guide'
  | 'game-over';

export type GameType = 'truth-or-dare' | 'kiffe-ou-kiffe-pas' | 'karma-sutra' | 'puzzle' | 'stop-tergiverser';

export type GameState = 'setup' | 'playing';

export type Category = 'soft' | 'intense';

export type SwipeDirection = 'left' | 'right';

export type KiffeGameState = 'setup' | 'playing' | 'results';

export type KarmaSutraGameState = 'setup' | 'playing' | 'paused';

export type PuzzleGameState = 'setup' | 'playing' | 'completed';

export type PuzzleDifficulty = 'easy' | 'medium' | 'hard';

export interface Challenge {
  id: number;
  type: 'truth' | 'dare';
  category: Category;
  text: string;
  isCustom?: boolean;
}

export interface CustomChallengeInput {
  type: 'truth' | 'dare';
  category: Category;
  text: string;
  recipients?: ('self' | 'other')[];
  target: 'player1' | 'player2' | 'both';
}

export interface Player {
  id: number;
  name: string;
  score: number;
}

export interface KiffePhrase {
  id: number;
  text: string;
  category: string;
}

export interface KiffeSession {
  id: string;
  players: Player[];
  phrases: KiffePhrase[];
  currentPhraseIndex: number;
  responses: {
    [playerId: number]: {
      [phraseId: number]: 'kiffe' | 'kiffe-pas' | null;
    };
  };
  state: KiffeGameState;
}

export interface KarmaSutraPosition {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
}

export interface KarmaSutraSession {
  id: string;
  positions: KarmaSutraPosition[];
  currentPositionIndex: number;
  state: KarmaSutraGameState;
  startTime?: number;
  pausedAt?: number;
  elapsedTime: number;
}

export interface PuzzlePiece {
  id: number;
  correctX: number;
  correctY: number;
  currentX: number;
  currentY: number;
  isPlaced: boolean;
}

export interface PuzzleSession {
  id: string;
  imageUrl: string;
  difficulty: PuzzleDifficulty;
  pieces: PuzzlePiece[];
  state: PuzzleGameState;
  startTime?: number;
  endTime?: number;
  isCompleted: boolean;
}
