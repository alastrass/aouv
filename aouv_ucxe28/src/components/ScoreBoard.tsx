import React from 'react';
import { Trophy, Crown } from 'lucide-react';
import { Player } from '../types';

interface ScoreBoardProps {
  players: Player[];
  currentPlayerIndex: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ players, currentPlayerIndex }) => {
  const [player1, player2] = players;
  const leader = player1.score === player2.score ? null : (player1.score > player2.score ? player1 : player2);

  return (
    <div className="mb-6 sm:mb-8 px-2 sm:px-0">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-purple-500/20">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Trophy className="w-6 h-6 text-amber-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white">Tableau des Scores</h2>
          <Trophy className="w-6 h-6 text-amber-400" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                index === currentPlayerIndex
                  ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/20'
                  : 'border-purple-500/30 bg-slate-700/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  {leader && leader.id === player.id && (
                    <Crown className="w-5 h-5 text-amber-400" />
                  )}
                  <span className={`font-semibold text-sm sm:text-base ${
                    index === currentPlayerIndex ? 'text-amber-300' : 'text-white'
                  }`}>
                    {player.name}
                  </span>
                  {index === currentPlayerIndex && (
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full whitespace-nowrap">
                      À jouer
                    </span>
                  )}
                </div>
                <div className={`text-xl sm:text-2xl font-bold ${
                  index === currentPlayerIndex ? 'text-amber-400' : 'text-purple-300'
                }`}>
                  {player.score}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {leader && (
          <div className="text-center mt-4">
            <p className="text-amber-300 text-xs sm:text-sm">
              🏆 <span className="font-semibold">{leader.name}</span> mène le jeu !
            </p>
          </div>
        )}
        
        {player1.score === player2.score && player1.score > 0 && (
          <div className="text-center mt-4">
            <p className="text-purple-300 text-xs sm:text-sm">
              🤝 Égalité parfaite ! Le match est serré !
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreBoard;
