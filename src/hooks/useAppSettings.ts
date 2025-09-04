import { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { getAppSettings, updateAppSettings as updateStorageSettings } from '../utils/storageUtils';

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(getAppSettings());

  useEffect(() => {
    const savedSettings = getAppSettings();
    setSettings(savedSettings);
  }, []);

  const updateSettings = (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    updateStorageSettings(updates);
  };

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const toggleVibration = () => {
    updateSettings({ vibrationEnabled: !settings.vibrationEnabled });
  };

  const toggleTutorials = () => {
    updateSettings({ showTutorials: !settings.showTutorials });
  };

  return {
    settings,
    updateSettings,
    toggleSound,
    toggleVibration,
    toggleTutorials
  };
};