import React, { useState } from 'react';
import { Calculator, Info } from 'lucide-react';

interface PointsPerRoundSelectorProps {
  onPointsChange: (points: number) => void;
}

const PointsPerRoundSelector: React.FC<PointsPerRoundSelectorProps> = ({ onPointsChange }) => {
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const [showInfo, setShowInfo] = useState(false);

  const pointOptions = [
    { value: 1, label: '1 point', description: 'Standard - Un point par défi réussi' },
    { value: 2, label: '2 points', description: 'Double - Parties plus rapides' },
    { value: 3, label: '3 points', description: 'Triple - Parties très rapides' },
    { value: 5, label: '5 points', description: 'Turbo - Parties express' }
  ];

  const handleOptionChange = (value: number) => {
    setSelectedOption(value);
    onPointsChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-5 h-5 text-purple-400" />
        <label className="text-purple-200 text-sm font-medium">
          Points par défi réussi
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
            Modifiez le nombre de points gagnés par défi pour ajuster la durée de la partie.
            Plus de points = parties plus courtes.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {pointOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionChange(option.value)}
            className={`p-4 rounded-lg border-2 transition-all duration-300 text-center ${
              selectedOption === option.value
                ? 'border-purple-400 bg-purple-500/20 shadow-lg'
                : 'border-purple-500/30 bg-slate-700/50 hover:border-purple-400/50'
            }`}
          >
            <div className="text-lg font-bold text-white mb-1">
              {option.label}
            </div>
            <div className="text-purple-300 text-xs">
              {option.description}
            </div>
          </button>
        ))}
      </div>

      <div className="text-center mt-4">
        <p className="text-purple-300 text-sm">
          Points par défi : <span className="font-semibold text-amber-400">{selectedOption}</span>
        </p>
      </div>
    </div>
  );
};

export default PointsPerRoundSelector;