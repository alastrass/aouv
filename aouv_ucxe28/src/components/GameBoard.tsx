import React from 'react';
import { Play, Check, X, Sparkles } from 'lucide-react';
import { Player, Challenge } from '../types';

interface GameBoardProps {
  currentPlayer: Player;
  currentChallenge: Challenge | null;
  onSpin: () => void;
  onValidation: (isValid: boolean) => void;
  isSpinning: boolean;
  showWheel: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  currentPlayer,
  currentChallenge,
  onSpin,
  onValidation,
  isSpinning,
  showWheel
}) => {
  if (showWheel) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-0">
      {/* Current Player */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-purple-500/30">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            C'est au tour de <span className="text-amber-400">{currentPlayer.name}</span>
          </h2>
          <p className="text-purple-200 text-sm sm:text-base">
            Prêt(e) à relever un défi ?
          </p>
        </div>
      </div>

      {/* Challenge Display */}
      {currentChallenge ? (
        <div className="mb-6 sm:mb-8">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl">
            <div className="text-center mb-4 sm:mb-6">
              <div className={`inline-block px-6 py-2 rounded-full text-sm font-semibold mb-4 ${
                currentChallenge.type === 'truth' 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {currentChallenge.type === 'truth' ? '🤔 Vérité' : '💫 Action'}
              </div>
            </div>
            
            <p className="text-white text-lg sm:text-xl leading-relaxed text-center mb-6 sm:mb-8 px-2">
              {currentChallenge.text}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => onValidation(true)}
                className="flex items-center justify-center gap-3 px-6 sm:px-8 py-4 bg-green-600 active:bg-green-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg mobile-button touch-action-none"
              >
                <Check className="w-5 h-5" />
                <span className="text-sm sm:text-base">Défi Relevé !</span>
              </button>
              <button
                onClick={() => onValidation(false)}
                className="flex items-center justify-center gap-3 px-6 sm:px-8 py-4 bg-red-600 active:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg mobile-button touch-action-none"
              >
                <X className="w-5 h-5" />
                <span className="text-sm sm:text-base">Défi Refusé</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-purple-500/30">
            <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-amber-400 mx-auto mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              Prêt pour un nouveau défi ?
            </h3>
            <p className="text-purple-200 mb-6 sm:mb-8 text-sm sm:text-base">
              Appuyez sur le bouton pour découvrir votre prochaine mission !
            </p>
            <button
              onClick={onSpin}
              disabled={isSpinning}
              className="bg-gradient-to-r from-amber-500 to-orange-500 active:from-amber-600 active:to-orange-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-4 px-6 sm:px-8 rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg flex items-center gap-3 mx-auto mobile-button touch-action-none"
            >
              <Play className="w-6 h-6" />
              <span className="text-sm sm:text-base">{isSpinning ? 'Sélection en cours...' : 'Tourner la Roue'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
