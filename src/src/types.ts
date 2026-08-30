export type AppState =
  | 'welcome'
  | 'age-verification'
  | 'game-selection'
  | 'truth-or-dare'
  | 'kiffe-ou-kiffe-pas'
  | 'karma-sutra'
  | 'puzzle'
  | 'stop-tergiverser'
  | 'classic'
  | 'couple'
  | 'store'
  | 'guide'
  | 'game-over';

export type GameType = 'truth-or-dare' | 'kiffe-ou-kiffe-pas' | 'karma-sutra' | 'puzzle' | 'stop-tergiverser';

export type GameState = 'setup' | 'playing';

export type Category = 'soft' | 'intense' | 'speed-extreme';

export type Orientation = 'mixed' | 'gay' | 'lesbian';

export type SwipeDirection = 'left' | 'right';

export type KiffeGameState = 'setup' | 'playing' | 'results';

export type KarmaSutraGameState = 'setup' | 'playing' | 'paused';

export type PuzzleGameState = 'session-setup' | 'image-selection' | 'waiting-player' | 'playing' | 'completed';

export interface PuzzleDifficulty {
  gridSize: number;
  label: string;
  pieces: number;
}

export interface Challenge {
  id: number;
  type: 'truth' | 'dare';
  category: Category;
  text: string;
  isCustom?: boolean;
  periodFriendly?: boolean;
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
  periodFriendly?: boolean;
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
  imageData: string;
  isPlaced: boolean;
  width: number;
  height: number;
}

// ── Classic Mode ───────────────────────────────────────────────────────────────

export type ClassicDifficulty = 'soft' | 'hot' | 'hard' | 'extreme';

export type ClassicGamePhase =
  | 'setup'       // player names + difficulty
  | 'pick'        // active player picks truth or dare
  | 'challenge'   // challenge displayed
  | 'submit'      // any player submits a custom challenge
  | 'vote';       // others vote to approve/reject submitted challenge

export interface ClassicChallenge {
  id: number;
  type: 'truth' | 'dare';
  difficulty: ClassicDifficulty;
  text: string;
  isCustom?: boolean;
  submittedBy?: number; // player id
}

export interface ClassicPlayer {
  id: number;
  name: string;
  avatar: string; // emoji
  score: number;
}

export interface PendingSubmission {
  challenge: ClassicChallenge;
  submittedByPlayerId: number;
  votes: Record<number, 'approve' | 'reject'>; // playerId → vote
}

// ── Couple Mode – Fantasmes sous couverture ────────────────────────────────────

export type CoupleGamePhase =
  | 'setup'          // player names
  | 'fantasy-input'  // each player enters fantasies secretly (one device, turn by turn)
  | 'ready'          // both players done, ready to reveal
  | 'voting'         // swipe through the merged deck
  | 'match'          // both validated — show match animation
  | 'results';       // end of deck — show all matches

export interface FantasyCard {
  id: string;
  text: string;
  isUserSubmitted: boolean; // false = system card
  // Author is deliberately NOT stored to keep submissions anonymous
}

export interface CoupleGameState {
  player1Name: string;
  player2Name: string;
  deck: FantasyCard[];
  currentIndex: number;
  // votes[cardId] stores which players have validated (1 and/or 2)
  votes: Record<string, number[]>;
  matches: FantasyCard[];
  // Tracks whose secret input phase it is (1 or 2)
  inputTurn: 1 | 2;
  player1Done: boolean;
  player2Done: boolean;
}

export interface PuzzleSession {
  code: string;
  creator: { id: string; name: string; connected: boolean };
  solver?: { id: string; name: string; connected: boolean };
  originalImage: string;
  gridSize: number;
  pieces: PuzzlePiece[];
  isCompleted: boolean;
  state: 'waiting' | 'playing' | 'completed';
  startTime: number;
  endTime?: number;
}
