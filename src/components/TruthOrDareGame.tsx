import React, { useState, useEffect } from 'react';
import { Heart, Users, Trophy, RotateCcw, Check, X, ArrowLeft, Settings } from 'lucide-react';
import { GameState, Player, Challenge, Category } from '../types';
import { challenges } from '../data/challenges';
import PlayerSetup from './PlayerSetup';
import GameBoard from './GameBoard';
import WheelSpinner from './WheelSpinner';
import ScoreBoard from './ScoreBoard';
import SettingsModal from './SettingsModal';
import LoadingSpinner from './LoadingSpinner';
import { useGameStats } from '../hooks/useGameStats';
import { useAppSettings } from '../hooks/useAppSettings';
import { getRandomChallenge, calculateGameDuration } from '../utils/gameUtils';
import { getStorageItem, setStorageItem } from '../utils/storageUtils';

interface TruthOrDareGameProps {
  onBack: () => void;
  onGameOver?: () => void;
}

const TruthOrDareGame: React.FC<TruthOrDareGameProps> = ({ onBack, onGameOver }) => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [category, setCategory] = useState<Category>('soft');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [usedChallenges, setUsedChallenges] = useState<number[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const [customChallenges, setCustomChallenges] = useState<Challenge[]>([]);
  const [targetScore, setTargetScore] = useState(10);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { recordGameSession } = useGameStats();
  const { settings } = useAppSettings();

  // Load data from localStorage
  useEffect(() => {
    const savedPlayers = getStorageItem('truthOrDare_players', []);
    const savedCategory = getStorageItem('truthOrDare_category', 'soft');
    const savedUsed = getStorageItem('truthOrDare_usedChallenges', []);
    const savedCustom = getStorageItem('truthOrDare_customChallenges', []);
    const savedTargetScore = getStorageItem('truthOrDare_targetScore', 10);
    const savedStartTime = getStorageItem('truthOrDare_startTime', null);
    
    if (savedPlayers.length > 0) {
      setPlayers(savedPlayers);
      setGameState('playing');
    }
    setCategory(savedCategory);
    setUsedChallenges(savedUsed);
    setCustomChallenges(savedCustom);
    setTargetScore(savedTargetScore);
    setGameStartTime(savedStartTime);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (players.length > 0) {
      setStorageItem('truthOrDare_players', players);
    }
  }, [players]);

  useEffect(() => {
    setStorageItem('truthOrDare_category', category);
  }, [category]);

  useEffect(() => {
    setStorageItem('truthOrDare_usedChallenges', usedChallenges);
  }, [usedChallenges]);

  useEffect(() => {
    setStorageItem('truthOrDare_customChallenges', customChallenges);
  }, [customChallenges]);

  useEffect(() => {
    setStorageItem('truthOrDare_targetScore', targetScore);
  }, [targetScore]);

  useEffect(() => {
    if (gameStartTime) {
      setStorageItem('truthOrDare_startTime', gameStartTime);
    }
  }, [gameStartTime]);

  // Check for game completion
  useEffect(() => {
    if (players.length > 0 && targetScore > 0) {
      const winner = players.find(p => p.score >= targetScore);
      if (winner && gameStartTime) {
        const duration = calculateGameDuration(gameStartTime, Date.now());
        const challengesCompleted = players.reduce((sum, p) => sum + p.score, 0);
        
        recordGameSession(category, duration, challengesCompleted);
        
        if (onGameOver) {
          onGameOver();
        }
      }
    }
  }, [players, targetScore, gameStartTime, category, recordGameSession, onGameOver]);

  const handlePlayersSetup = (
    setupPlayers: Player[], 
    selectedCategory: Category, 
    customs: Challenge[], 
    score: number, 
    prizes: any
  ) => {
    setPlayers(setupPlayers);
    setCategory(selectedCategory);
    setCustomChallenges(customs);
    setTargetScore(score);
    setGameStartTime(Date.now());
    setGameState('playing');
  };

  const getAvailableChallenges = (): Challenge[] => {
    const baseChallenges = challenges[category];
    const allChallenges = [...baseChallenges, ...customChallenges.filter(c => c.category === category)];
    return allChallenges.filter((_, index) => !usedChallenges.includes(index));
  };

  const spinWheel = () => {
    setIsLoading(true);
    const availableChallenges = getAvailableChallenges();
    
    if (availableChallenges.length === 0) {
      setUsedChallenges([]);
      setIsLoading(false);
      return;
    }

    setIsSpinning(true);
    setShowWheel(true);
    
    setTimeout(() => {
      const selectedChallenge = getRandomChallenge(availableChallenges);
      
      if (selectedChallenge) {
        setCurrentChallenge(selectedChallenge);
        const originalIndex = challenges[category].findIndex(c => c.id === selectedChallenge.id);
        if (originalIndex !== -1) {
          setUsedChallenges(prev => [...prev, originalIndex]);
        }
      }
      
      setIsSpinning(false);
      setIsLoading(false);
      
      setTimeout(() => {
        setShowWheel(false);
      }, 1000);
    }, 3000);
  };

  const handleValidation = (isValid: boolean) => {
    if (!currentChallenge) return;

    // Vibration feedback if enabled
    if (settings.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(isValid ? [100] : [200, 100, 200]);
    }

    setPlayers(prev => prev.map((player, index) => {
      if (index === currentPlayerIndex) {
        return { ...player, score: player.score + (isValid ? 1 : 0) };
      } else if (index === (currentPlayerIndex + 1) % 2) {
        return { ...player, score: player.score + (isValid ? 0 : 1) };
      }
      return player;
    }));

    setCurrentChallenge(null);
    setCurrentPlayerIndex((prev) => (prev + 1) % 2);
  };

  const resetGame = () => {
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
    setUsedChallenges([]);
    setCurrentChallenge(null);
    setCurrentPlayerIndex(0);
    setGameStartTime(Date.now());
  };

  const restartCompletely = () => {
    // Clear all game data
    ['truthOrDare_players', 'truthOrDare_category', 'truthOrDare_usedChallenges', 
     'truthOrDare_customChallenges', 'truthOrDare_targetScore', 'truthOrDare_startTime']
      .forEach(key => localStorage.removeItem(key));
    
    setGameState('setup');
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setCategory('soft');
    setCurrentChallenge(null);
    setUsedChallenges([]);
    setCustomChallenges([]);
    setTargetScore(10);
    setGameStartTime(null);
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Retour</span>
            </button>
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-rose-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">Action ou Vérité</h1>
            </div>
          </div>
        </div>
        <PlayerSetup 
          onComplete={handlePlayersSetup}
          initialCustomChallenges={customChallenges}
        />
      </div>
    );
  }

  if (gameState === 'playing') {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Préparation du jeu..." />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 safe-area-inset">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Temple</span>
            </button>
            
            <div className="text-center flex-1 mx-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-6 h-6 text-rose-400" />
                <h1 className="text-xl sm:text-2xl font-bold text-white">Action ou Vérité</h1>
                <Heart className="w-6 h-6 text-rose-400" />
              </div>
              <p className="text-purple-200 text-sm">Mode {category === 'soft' ? 'Soft' : 'Intense'}</p>
              <p className="text-purple-300 text-xs">Objectif : {targetScore} points</p>
            </div>
            
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Score Board */}
          <ScoreBoard players={players} currentPlayerIndex={currentPlayerIndex} />

          {/* Game Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-2 sm:px-0">
            <button
              onClick={resetGame}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 active:bg-amber-700 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm sm:text-base">Nouveau Round</span>
            </button>
            <button
              onClick={restartCompletely}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 active:bg-slate-700 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              <Users className="w-4 h-4" />
              <span className="text-sm sm:text-base">Recommencer</span>
            </button>
          </div>

          {/* Wheel Spinner */}
          {showWheel && (
            <WheelSpinner 
              isSpinning={isSpinning}
              category={category}
            />
          )}

          {/* Game Board */}
          <GameBoard
            currentPlayer={players[currentPlayerIndex]}
            currentChallenge={currentChallenge}
            onSpin={spinWheel}
            onValidation={handleValidation}
            isSpinning={isSpinning}
            showWheel={showWheel}
          />

          {/* Footer */}
          <footer className="text-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-purple-800">
            <p className="text-purple-300 text-xs sm:text-sm">
              Jeu créé par <span className="font-semibold text-amber-400">Jérôme Joly</span>
            </p>
            <p className="text-purple-400 text-xs mt-1 sm:mt-2">
              Contenu exclusivement destiné aux adultes consentants (18+)
            </p>
          </footer>

          {/* Settings Modal */}
          <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </div>
      </div>
    );
  }

  return null;
};

export default TruthOrDareGame;