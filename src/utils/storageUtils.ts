import { AppSettings, GameStats } from '../types';

// Local storage utility functions
export const STORAGE_KEYS = {
  GAME_STATS: 'gameStats',
  APP_SETTINGS: 'appSettings',
  AGE_VERIFIED: 'ageVerified',
  UNLOCKED_CONTENT: 'unlockedContentPacks',
  LIFETIME_ACCESS: 'hasLifetimeAccess',
  CUSTOM_CHALLENGES: 'customChallenges',
  PLAYER_NAMES: 'playerNames'
} as const;

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

export const clearGameData = (): void => {
  const keysToKeep = [STORAGE_KEYS.APP_SETTINGS, STORAGE_KEYS.AGE_VERIFIED];
  
  Object.keys(localStorage).forEach(key => {
    if (!keysToKeep.includes(key as any)) {
      localStorage.removeItem(key);
    }
  });
};

export const getDefaultSettings = (): AppSettings => ({
  soundEnabled: true,
  vibrationEnabled: true,
  theme: 'dark',
  language: 'fr',
  ageVerified: false,
  showTutorials: true
});

export const getAppSettings = (): AppSettings => {
  return getStorageItem(STORAGE_KEYS.APP_SETTINGS, getDefaultSettings());
};

export const updateAppSettings = (updates: Partial<AppSettings>): void => {
  const currentSettings = getAppSettings();
  const newSettings = { ...currentSettings, ...updates };
  setStorageItem(STORAGE_KEYS.APP_SETTINGS, newSettings);
};

export const isAgeVerified = (): boolean => {
  return getStorageItem(STORAGE_KEYS.AGE_VERIFIED, false);
};

export const setAgeVerified = (verified: boolean): void => {
  setStorageItem(STORAGE_KEYS.AGE_VERIFIED, verified);
};