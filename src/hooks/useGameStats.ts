import { useState, useEffect } from 'react';
import { GameStats, Category } from '../types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storageUtils';

const defaultStats: GameStats = {
  gamesPlayed: 0,
  totalChallengesCompleted: 0,
  favoriteCategory: 'soft',
  longestSession: 0,
  lastPlayedDate: new Date().toISOString()
};

export const useGameStats = () => {
  const [stats, setStats] = useState<GameStats>(defaultStats);

  useEffect(() => {
    const savedStats = getStorageItem(STORAGE_KEYS.GAME_STATS, defaultStats);
    setStats(savedStats);
  }, []);

  const updateStats = (updates: Partial<GameStats>) => {
    const newStats = { ...stats, ...updates };
    setStats(newStats);
    setStorageItem(STORAGE_KEYS.GAME_STATS, newStats);
  };

  const recordGameSession = (
    category: Category,
    duration: number,
    challengesCompleted: number
  ) => {
    updateStats({
      gamesPlayed: stats.gamesPlayed + 1,
      totalChallengesCompleted: stats.totalChallengesCompleted + challengesCompleted,
      favoriteCategory: category,
      longestSession: Math.max(stats.longestSession, duration),
      lastPlayedDate: new Date().toISOString()
    });
  };

  const resetStats = () => {
    setStats(defaultStats);
    setStorageItem(STORAGE_KEYS.GAME_STATS, defaultStats);
  };

  return {
    stats,
    updateStats,
    recordGameSession,
    resetStats
  };
};