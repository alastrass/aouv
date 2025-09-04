import React, { useState } from 'react';
import { Target, Info } from 'lucide-react';

interface TargetScoreSetupProps {
  onTargetScoreDefined: (targetScore: number) => void;
}

const TargetScoreSetup: React.FC<TargetScoreSetupProps> = ({ onTargetScoreDefined }) => {
  const [selectedScore, setSelectedScore] = useState(10);
  const [showInfo, setShowInfo] = useState(false);

  const scoreOptions = [
    { value: 5, label: '5 points', duration: '5-10 min', description: 'Partie rapide' },
    { value: 10, label: '10 points', duration: '10-20 min', description: 'Partie standard' },
    { value: 15, label: '15 points', duration: '15-30 min', description: 'Partie longue' },
    { value: 20, label: '20 points', duration: '20-40 min', description: 'Partie marathon' },
    { value: 30, label: '30 points', duration: '30-60 min', description: 'Session intensive' }
  ];

  const handleScoreChange = (score: number) => {
    setSelectedScore(score);
    onTargetScoreDefined(score);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-5 h-5 text-purple-400" />
        <label className="text-purple-200 text-sm font-medium">
          Score à atteindre pour gagner
        </label>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {showInfo && (
        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-4">
          <p className="text-blue-200 text-sm">
            <strong>Comment gagner des points :</strong><br />
            • +1 point si vous relevez le défi<br />
            • +1 point pour l'adversaire si vous refusez<br />
            • Le premier à atteindre le score cible gagne !
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {scoreOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleScoreChange(option.value)}
            className={`p-4 rounded-lg border-2 transition-all duration-300 text-center ${
              selectedScore === option.value
                ? 'border-purple-400 bg-purple-500/20 shadow-lg'
                : 'border-purple-500/30 bg-slate-700/50 hover:border-purple-400/50'
            }`}
          >
            <div className="text-lg font-bold text-white mb-1">
              {option.label}
            </div>
            <div className="text-purple-300 text-sm mb-1">
              {option.duration}
            </div>
            <div className="text-purple-400 text-xs">
              {option.description}
            </div>
          </button>
        ))}
      </div>

      <div className="text-center mt-4">
        <p className="text-purple-300 text-sm">
          Score sélectionné : <span className="font-semibold text-amber-400">{selectedScore} points</span>
        </p>
      </div>
    </div>
  );
};

export default TargetScoreSetup;