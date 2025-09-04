import { Challenge, Category, Player, GameStats } from '../types';

// Utility functions for game logic
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getRandomChallenge = (
  challenges: Challenge[], 
  usedChallenges: number[] = [],
  category?: Category
): Challenge | null => {
  let availableChallenges = challenges.filter((_, index) => !usedChallenges.includes(index));
  
  if (category) {
    availableChallenges = availableChallenges.filter(c => c.category === category);
  }
  
  if (availableChallenges.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * availableChallenges.length);
  return availableChallenges[randomIndex];
};

export const calculateGameDuration = (startTime: number, endTime?: number): number => {
  if (!endTime) return 0;
  return Math.floor((endTime - startTime) / 1000 / 60); // in minutes
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
};

export const getWinner = (players: Player[]): Player | null => {
  if (players.length === 0) return null;
  
  const maxScore = Math.max(...players.map(p => p.score));
  const winners = players.filter(p => p.score === maxScore);
  
  return winners.length === 1 ? winners[0] : null; // null if tie
};

export const updateGameStats = (
  category: Category,
  duration: number,
  challengesCompleted: number
): void => {
  const stats = getGameStats();
  
  const updatedStats: GameStats = {
    gamesPlayed: stats.gamesPlayed + 1,
    totalChallengesCompleted: stats.totalChallengesCompleted + challengesCompleted,
    favoriteCategory: category, // Could be improved with better logic
    longestSession: Math.max(stats.longestSession, duration),
    lastPlayedDate: new Date().toISOString()
  };
  
  localStorage.setItem('gameStats', JSON.stringify(updatedStats));
};

export const getGameStats = (): GameStats => {
  const saved = localStorage.getItem('gameStats');
  if (saved) {
    return JSON.parse(saved);
  }
  
  return {
    gamesPlayed: 0,
    totalChallengesCompleted: 0,
    favoriteCategory: 'soft',
    longestSession: 0,
    lastPlayedDate: new Date().toISOString()
  };
};

export const validatePlayerName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 20;
};

export const generateSessionCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const isValidSessionCode = (code: string): boolean => {
  return /^[A-Z0-9]{6}$/.test(code);
};