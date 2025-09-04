export type AppState =
  | 'welcome'
  | 'age-verification'
  | 'game-selection'
  | 'truth-or-dare'
  | 'kiffe-ou-kiffe-pas'
  | 'karma-sutra'
  | 'puzzle';

export type GameType = 'truth-or-dare' | 'kiffe-ou-kiffe-pas' | 'karma-sutra' | 'puzzle';

export type GameState = 'setup' | 'playing' | 'paused' | 'completed';

export type Category = 'soft' | 'intense';

export interface Challenge {
  id: number;
  type: 'truth' | 'dare';
  category: Category;
  text: string;
  isCustom?: boolean;
  recipients?: ('self' | 'other')[];
  target?: 'player1' | 'player2' | 'both';
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

// Kiffe ou Kiffe Pas types
export type KiffeGameState = 'session-setup' | 'waiting-partner' | 'playing' | 'results';
export type SwipeDirection = 'kiffe' | 'kiffe-pas';

export interface KiffePhrase {
  id: number;
  text: string;
  isCustom?: boolean;
  addedBy: 'system' | 'player1' | 'player2';
}

export interface KiffePlayer {
  id: string;
  name: string;
  connected: boolean;
  responses: Record<number, SwipeDirection>;
}

export interface KiffeSession {
  code: string;
  player1: KiffePlayer;
  player2: KiffePlayer;
  phrases: KiffePhrase[];
  currentPhraseIndex: number;
  matches: KiffePhrase[];
  state: 'waiting' | 'playing' | 'completed';
}

// Karma Sutra types
export type KarmaSutraGameState = 'welcome' | 'playing' | 'paused' | 'completed';

export interface KarmaSutraPosition {
  id: number;
  name: string;
  description: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  illustration: string;
  imageUrl?: string;
  benefits: string[];
}

export interface KarmaSutraSession {
  currentPositionIndex: number;
  usedPositions: number[];
  sessionCount: number;
  timeRemaining: number;
  isPlaying: boolean;
  soundEnabled: boolean;
}

// Puzzle Game types
export type PuzzleGameState = 'session-setup' | 'image-selection' | 'waiting-player' | 'playing' | 'completed';

export interface PuzzlePiece {
  id: number;
  correctX: number;
  correctY: number;
  currentX: number;
  currentY: number;
  imageData: string;
  isPlaced: boolean;
  width: number;
  height: number;
}

export interface PuzzleDifficulty {
  gridSize: number;
  label: string;
  pieces: number;
}

export interface PuzzlePlayer {
  id: string;
  name: string;
  connected: boolean;
}

export interface PuzzleSession {
  code: string;
  creator: PuzzlePlayer;
  solver?: PuzzlePlayer;
  originalImage: string;
  gridSize: number;
  pieces: PuzzlePiece[];
  isCompleted: boolean;
  state: 'waiting' | 'playing' | 'completed';
  startTime: number;
  endTime?: number;
}

// Remote Game types
export interface RemotePlayer {
  id: string;
  name: string;
  connected: boolean;
  ready: boolean;
}

export interface RemoteGameSession {
  code: string;
  host: RemotePlayer;
  guest?: RemotePlayer;
  category: Category;
  customChallenges: Challenge[];
  state: 'waiting-guest' | 'waiting-ready' | 'ready' | 'playing' | 'completed';
}

// Game Statistics
export interface GameStats {
  gamesPlayed: number;
  totalChallengesCompleted: number;
  favoriteCategory: Category;
  longestSession: number; // in minutes
  lastPlayedDate: string;
}

// Settings
export interface AppSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  theme: 'dark' | 'light' | 'auto';
  language: 'fr' | 'en';
  ageVerified: boolean;
  showTutorials: boolean;
}