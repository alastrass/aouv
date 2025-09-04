import React from 'react';
import { X, Volume2, VolumeX, Vibrate, VibrateOff, BookOpen, BookOpenCheck, BarChart3, Trophy, Calendar, Target } from 'lucide-react';
import { useAppSettings } from '../hooks/useAppSettings';
import { useGameStats } from '../hooks/useGameStats';
import { formatDuration } from '../utils/gameUtils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, toggleSound, toggleVibration, toggleTutorials } = useAppSettings();
  const { stats, resetStats } = useGameStats();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold text-xl">Paramètres</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Audio Settings */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-4">Audio et Vibrations</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-purple-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                )}
                <span className="text-white">Sons</span>
              </div>
              <button
                onClick={toggleSound}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.soundEnabled ? 'bg-purple-500' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                {settings.vibrationEnabled ? (
                  <Vibrate className="w-5 h-5 text-purple-400" />
                ) : (
                  <VibrateOff className="w-5 h-5 text-slate-400" />
                )}
                <span className="text-white">Vibrations</span>
              </div>
              <button
                onClick={toggleVibration}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.vibrationEnabled ? 'bg-purple-500' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Interface Settings */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-4">Interface</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                {settings.showTutorials ? (
                  <BookOpen className="w-5 h-5 text-purple-400" />
                ) : (
                  <BookOpenCheck className="w-5 h-5 text-slate-400" />
                )}
                <span className="text-white">Tutoriels</span>
              </div>
              <button
                onClick={toggleTutorials}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showTutorials ? 'bg-purple-500' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showTutorials ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Game Statistics */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Statistiques
          </h3>
          <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-purple-200 text-sm">Parties jouées</span>
              </div>
              <span className="text-white font-semibold">{stats.gamesPlayed}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-purple-200 text-sm">Défis relevés</span>
              </div>
              <span className="text-white font-semibold">{stats.totalChallengesCompleted}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-purple-200 text-sm">Plus longue session</span>
              </div>
              <span className="text-white font-semibold">
                {formatDuration(stats.longestSession)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-purple-200 text-sm">Mode préféré</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                stats.favoriteCategory === 'soft' 
                  ? 'bg-purple-500/20 text-purple-300' 
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {stats.favoriteCategory === 'soft' ? 'Soft' : 'Intense'}
              </span>
            </div>
          </div>
        </div>

        {/* Reset Data */}
        <div className="border-t border-slate-700 pt-6">
          <button
            onClick={() => {
              if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes vos statistiques ?')) {
                resetStats();
              }
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm"
          >
            Réinitialiser les statistiques
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;