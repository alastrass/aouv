import React, { useState, useEffect } from 'react';
import { Heart, Users, Trophy, RotateCcw, Check, X, ArrowLeft } from 'lucide-react';
import { GameState, Player, Challenge, Category } from '../types';
import { challenges } from '../data/challenges';
import PlayerSetup from './PlayerSetup';
import GameBoard from './GameBoard';
import WheelSpinner from './WheelSpinner';
import ScoreBoard from './ScoreBoard';

interface TruthOrDareGameProps {
  onBack: () => void;
}

const TruthOrDareGame: React.FC<TruthOrDareGameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [category, setCategory] = useState<Category>('soft');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [usedChallenges, setUsedChallenges] = useState<number[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const [customChallenges, setCustomChallenges] = useState<Challenge[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedPlayers = localStorage.getItem('truthOrDare_players');
    const savedCategory = localStorage.getItem('truthOrDare_category');
    const savedUsed = localStorage.getItem('truthOrDare_usedChallenges');
    const savedCustom = localStorage.getItem('truthOrDare_customChallenges');
    
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedCategory) setCategory(savedCategory as Category);
    if (savedUsed) setUsedChallenges(JSON.parse(savedUsed));
    if (savedCustom) setCustomChallenges(JSON.parse(savedCustom));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem('truthOrDare_players', JSON.stringify(players));
    }
  }, [players]);

  useEffect(() => {
    localStorage.setItem('truthOrDare_category', category);
  }, [category]);

  useEffect(() => {
    localStorage.setItem('truthOrDare_usedChallenges', JSON.stringify(usedChallenges));
  }, [usedChallenges]);

  useEffect(() => {
    localStorage.setItem('truthOrDare_customChallenges', JSON.stringify(customChallenges));
  }, [customChallenges]);

  const handlePlayersSetup = (setupPlayers: Player[], selectedCategory: Category, customs: Challenge[]) => {
    setPlayers(setupPlayers);
    setCategory(selectedCategory);
    setCustomChallenges(customs);
    setGameState('playing');
  };

  const getAvailableChallenges = (): Challenge[] => {
    const baseChallenges = challenges[category];
    const allChallenges = [...baseChallenges, ...customChallenges.filter(c => c.category === category)];
    return allChallenges.filter((_, index) => !usedChallenges.includes(index));
  };

  const spinWheel = () => {
    const availableChallenges = getAvailableChallenges();
    
    if (availableChallenges.length === 0) {
      setUsedChallenges([]);
      return;
    }

    setIsSpinning(true);
    setShowWheel(true);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availableChallenges.length);
      const selectedChallenge = availableChallenges[randomIndex];
      
      setCurrentChallenge(selectedChallenge);
      setUsedChallenges(prev => [...prev, randomIndex]);
      setIsSpinning(false);
      
      setTimeout(() => {
        setShowWheel(false);
      }, 1000);
    }, 3000);
  };

  const handleValidation = (isValid: boolean) => {
    if (!currentChallenge) return;

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
  };

  const restartCompletely = () => {
    localStorage.removeItem('truthOrDare_players');
    localStorage.removeItem('truthOrDare_category');
    localStorage.removeItem('truthOrDare_usedChallenges');
    localStorage.removeItem('truthOrDare_customChallenges');
    setGameState('setup');
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setCategory('soft');
    setCurrentChallenge(null);
    setUsedChallenges([]);
    setCustomChallenges([]);
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
            </div>
            
            <div className="w-16"></div>
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
        </div>
      </div>
    );
  }

  return null;
};

export default TruthOrDareGame;
