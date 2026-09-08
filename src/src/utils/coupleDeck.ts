import { FantasyCard } from '../types';
import { systemFantasies } from '../data/fantasies';

const SYSTEM_PER_USER = 2;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const periodFriendlyFantasies = [
  'Se faire un massage des épaules et de la nuque avec une musique apaisante',
  'Préparer une boisson chaude et se blottir ensemble sous un plaid',
  'Prendre un bain relaxant ensemble, sans objectif autre que se détendre',
  'Échanger un long câlin et respirer ensemble pendant quelques minutes',
  'Se faire des compliments sincères et raconter son meilleur souvenir à deux',
  'Regarder un film choisi ensemble, avec des caresses et des pauses câlins',
  'Se masser les mains et les pieds à tour de rôle',
  'Organiser une soirée cocooning avec une playlist douce et une lumière tamisée',
  'Écrire chacun trois petites attentions qui feraient plaisir cette semaine',
  'Explorer les caresses et les bisous, en respectant immédiatement chaque limite'
];

export function buildDeck(userTexts: string[], periodFriendly: boolean): FantasyCard[] {
  const userCards: FantasyCard[] = userTexts.map((text, i) => ({
    id: `user-${i}-${Date.now()}`,
    text,
    isUserSubmitted: true,
  }));

  const systemPool = periodFriendly
    ? shuffle(periodFriendlyFantasies).map((text, index) => ({ id: index + 1, text }))
    : shuffle(systemFantasies);
  const systemCount = Math.min(Math.max(userCards.length * SYSTEM_PER_USER, 10), systemPool.length);
  const systemCards: FantasyCard[] = systemPool.slice(0, systemCount).map(s => ({
    id: `sys-${s.id}`,
    text: s.text,
    isUserSubmitted: false,
  }));

  const deck: FantasyCard[] = [];
  let sIdx = 0;
  for (const uc of userCards) {
    for (let k = 0; k < SYSTEM_PER_USER && sIdx < systemCards.length; k++, sIdx++) {
      deck.push(systemCards[sIdx]);
    }
    deck.push(uc);
  }
  while (sIdx < systemCards.length) deck.push(systemCards[sIdx++]);

  return shuffle(deck);
}

export function generateSessionCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generatePlayerId(): string {
  return 'player_' + Math.random().toString(36).substr(2, 9);
}
