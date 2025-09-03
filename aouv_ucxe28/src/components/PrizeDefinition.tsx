import React, { useState } from 'react';
import { Eye, EyeOff, Plus, Check, Edit } from 'lucide-react';

interface PrizeDefinitionProps {
  playerId: number;
  playerName: string;
  onPrizeDefined: (playerId: number, prize: string, isVisible: boolean) => void;
  initialPrize?: string;
  initialIsVisible?: boolean;
}

const PrizeDefinition: React.FC<PrizeDefinitionProps> = ({
  playerId,
  playerName,
  onPrizeDefined,
  initialPrize = '',
  initialIsVisible = false,
}) => {
  const [prize, setPrize] = useState(initialPrize);
  const [isVisible, setIsVisible] = useState(initialIsVisible);
  const [isDefined, setIsDefined] = useState(initialPrize !== '');
  const [isLocked, setIsLocked] = useState(false); // New state for validation/locking

  const handlePrizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrize(e.target.value);
  };

  const handleVisibilityToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleDefinePrize = () => {
    setIsDefined(true);
  };

  const handleValidatePrize = () => {
    setIsLocked(true);
    onPrizeDefined(playerId, prize, isVisible); // Call callback when validated
  };

  const handleEditPrize = () => {
    setIsLocked(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-purple-200 text-sm font-medium mb-2">
        Prix pour {playerName}
      </label>
      {!isDefined ? (
        <button
          onClick={handleDefinePrize}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Définir le prix
        </button>
      ) : (
        <div className="flex items-center flex-wrap gap-2">
          <input
            type="text"
            value={prize}
            onChange={handlePrizeChange}
            readOnly={isLocked}
            className={`flex-grow px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 ${
              isLocked && !isVisible ? 'filter blur-sm' : ''
            }`}
            placeholder="Définir le prix"
            maxLength={50}
          />
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isVisible}
              onChange={handleVisibilityToggle}
              disabled={isLocked}
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-400/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
            <span className="ml-3 text-sm font-medium text-purple-200">Visible</span>
          </label>

          {!isLocked ? (
            <button
              onClick={handleValidatePrize}
              disabled={prize.trim() === ''}
              className="py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Valider
            </button>
          ) : (
            <button
              onClick={handleEditPrize}
              className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PrizeDefinition;
