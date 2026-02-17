import React, { useState, useEffect } from 'react';
import { RotateCcw, Check, X, ArrowLeft } from 'lucide-react';
import { Player, Challenge, Category } from '../types';
import { challenges } from '../data/challenges';
import PlayerSetup from './PlayerSetup';
import IntensitySpinner from './IntensitySpinner';
import ScoreBoard from './ScoreBoard';

interface StopTergiverserGameProps {
  onBack: () => void;
  onGameOver?: () => void;
  targetScore?: number | string | null;
  prizes?: { [playerId: number]: { prize: string; isVisible: boolean } } | null;
}

const StopTergiverserGame: React.FC<StopTergiverserGameProps> = ({ onBack, onGameOver, targetScore, prizes }) => {
  const [gameState, setGameState] = useState<'setup' | 'playing'>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [category, setCategory] = useState<Category>('soft');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [usedChallenges, setUsedChallenges] = useState<number[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const [customChallenges, setCustomChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const savedPlayers = localStorage.getItem('stopTergiverser_players');
    const savedCategory = localStorage.getItem('stopTergiverser_category');
    const savedUsed = localStorage.getItem('stopTergiverser_usedChallenges');
    const savedCustom = localStorage.getItem('stopTergiverser_customChallenges');

    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedCategory) setCategory(savedCategory as Category);
    if (savedUsed) setUsedChallenges(JSON.parse(savedUsed));
    if (savedCustom) setCustomChallenges(JSON.parse(savedCustom));
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem('stopTergiverser_players', JSON.stringify(players));
    }
  }, [players]);

  useEffect(() => {
    localStorage.setItem('stopTergiverser_category', category);
  }, [category]);

  useEffect(() => {
    localStorage.setItem('stopTergiverser_usedChallenges', JSON.stringify(usedChallenges));
  }, [usedChallenges]);

  useEffect(() => {
    localStorage.setItem('stopTergiverser_customChallenges', JSON.stringify(customChallenges));
  }, [customChallenges]);

  useEffect(() => {
    if (targetScore && players.length > 0 && gameState === 'playing') {
      const winner = players.find(p => typeof targetScore === 'number' ? p.score >= targetScore : p.score >= 2);
      if (winner && onGameOver) {
        onGameOver();
      }
    }
  }, [players, targetScore, gameState, onGameOver]);

  const handlePlayersSetup = (setupPlayers: Player[], selectedCategory: Category, customs: Challenge[]) => {
    setPlayers(setupPlayers);
    setCategory(selectedCategory);
    setCustomChallenges(customs);
    setGameState('playing');
  };

  const getAvailableChallenges = (): Challenge[] => {
    const baseChallenges = challenges[category].filter(c => c.type === 'dare');
    const allChallenges = [...baseChallenges, ...customChallenges.filter(c => c.category === category && c.type === 'dare')];
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
      }, 500);
    }, 2000);
  };

  const handleChallengeDone = () => {
    const currentPlayer = players[currentPlayerIndex];
    const newPlayers = [...players];
    newPlayers[currentPlayerIndex] = { ...currentPlayer, score: currentPlayer.score + 1 };
    setPlayers(newPlayers);

    setCurrentChallenge(null);
    setShowWheel(false);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  const handleReset = () => {
    const resetPlayers = players.map(p => ({ ...p, score: 0 }));
    setPlayers(resetPlayers);
    setUsedChallenges([]);
    setCurrentChallenge(null);
    setCurrentPlayerIndex(0);
    setShowWheel(false);
  };

  if (gameState === 'setup') {
    return (
      <PlayerSetup
        gameType="stop-tergiverser"
        onComplete={handlePlayersSetup}
        onBack={onBack}
        targetScore={targetScore}
        prizes={prizes}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-6 safe-area-inset">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-400">
            Arrête de Tergiverser
          </h1>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
            title="Recommencer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <ScoreBoard players={players} />

        {showWheel ? (
          <div className="mb-8">
            <IntensitySpinner isSpinning={isSpinning} />
          </div>
        ) : null}

        {currentChallenge ? (
          <div className="mb-6 sm:mb-8">
            <div className="max-w-2xl mx-auto px-2 sm:px-0">
              <div className="text-center mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-rose-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-rose-500/30">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    C'est au tour de <span className="text-amber-400">{players[currentPlayerIndex].name}</span>
                  </h2>
                  <p className="text-rose-200 text-sm sm:text-base">
                    Prêt(e) à relever ce défi ?
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-block px-6 py-2 rounded-full text-sm font-semibold mb-4 bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    💫 Défi d'Action
                  </div>
                </div>

                <p className="text-white text-lg sm:text-xl leading-relaxed text-center mb-6 sm:mb-8 px-2">
                  {currentChallenge.text}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                    onClick={handleChallengeDone}
                    className="flex items-center justify-center gap-3 px-6 sm:px-8 py-4 bg-green-600 active:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg mobile-button touch-action-none"
                  >
                    <Check className="w-5 h-5" />
                    <span className="text-sm sm:text-base">Défi Relevé !</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentChallenge(null);
                      setShowWheel(false);
                      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
                    }}
                    className="flex items-center justify-center gap-3 px-6 sm:px-8 py-4 bg-red-600 active:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg mobile-button touch-action-none"
                  >
                    <X className="w-5 h-5" />
                    <span className="text-sm sm:text-base">Passer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={spinWheel}
              disabled={isSpinning || getAvailableChallenges().length === 0}
              className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-6 px-12 rounded-2xl text-xl sm:text-2xl transition-all duration-300 shadow-xl hover:shadow-2xl mobile-button touch-action-none"
            >
              {getAvailableChallenges().length === 0 ? 'Tous les défis utilisés' : 'Lancer le défi'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StopTergiverserGame;
