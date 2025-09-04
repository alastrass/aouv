export type AppState =
  | 'welcome'
  | 'age-verification'
  | 'game-selection'
  | 'truth-or-dare'
  | 'kiffe-ou-kiffe-pas'
  | 'karma-sutra'
  | 'puzzle';

export type GameType = 'truth-or-dare' | 'kiffe-ou-kiffe-pas' | 'karma-sutra' | 'puzzle';

export type Category = 'soft' | 'intense';

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
