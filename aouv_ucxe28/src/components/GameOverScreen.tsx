import React from 'react';
import { Player } from '../types';
import { Trophy } from 'lucide-react';

interface GameOverScreenProps {
  players: Player[];
  targetScore: number;
  prizes: { [playerId: number]: { prize: string; isVisible: boolean } };
  onBack: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ players, targetScore, prizes, onBack }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winningScore = sortedPlayers[0].score;
  const winners = sortedPlayers.filter(player => player.score === winningScore);
  const isTie = winners.length > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/20">
          <div className="text-center mb-8">
            <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white">
              {isTie ? 'Égalité !' : 'Partie Terminée !'}
            </h1>
            <p className="text-purple-200">
              {isTie
                ? 'Match nul ! Tous les gagnants ont atteint le score cible.'
                : `Félicitations à ${winners[0].name} pour avoir atteint ${targetScore} points !`}
            </p>
          </div>

          {/* Podium */}
          <div className="relative grid grid-cols-3 gap-4 mb-8">
            {sortedPlayers.map((player, index) => (
              <div key={player.id} className="text-center">
                {/* Podium Base */}
                <div
                  className={`relative z-10 mx-auto rounded-t-xl transition-all duration-300 ${
                    index === 0
                      ? 'bg-amber-500 h-32 w-24'
                      : index === 1
                      ? 'bg-gray-500 h-24 w-20'
                      : 'bg-bronze-500 h-16 w-16'
                  }`}
                >
                  {/* Player Info */}
                  <div className="absolute top-[-3rem] left-1/2 transform -translate-x-1/2">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-purple-400 flex items-center justify-center text-white font-semibold">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm text-purple-200 mt-2">{player.name}</p>
                      <p className="text-lg font-bold text-purple-300">{player.score} points</p>
                    </div>
                  </div>
                </div>
                {/* Podium Label */}
                <p className="text-xs text-purple-300 mt-2">
                  {index === 0 ? 'Vainqueur' : `Place #${index + 1}`}
                </p>
              </div>
            ))}
          </div>

          {/* Prizes */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Prix</h2>
            {winners.map(winner => (
              <div key={winner.id} className="mb-4">
                <h3 className="text-xl font-semibold text-amber-300">
                  Prix pour {winner.name}:
                </h3>
                <p className="text-purple-200">
                  {prizes[winner.id]?.isVisible
                    ? prizes[winner.id]?.prize || 'Aucun prix défini'
                    : 'Prix caché'}
                </p>
              </div>
            ))}
          </div>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Retour à la sélection du jeu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
