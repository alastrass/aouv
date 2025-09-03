import React from 'react';

interface TargetScoreSetupProps {
  onTargetScoreDefined: (targetScore: number | 'two-parts') => void;
}

const TargetScoreSetup: React.FC<TargetScoreSetupProps> = ({ onTargetScoreDefined }) => {
  const handleScoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'two-parts') {
      onTargetScoreDefined('two-parts');
    } else {
      const score = parseInt(value, 10);
      onTargetScoreDefined(score);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">
        Score Cible
      </h2>
      <label className="block text-purple-200 text-sm font-medium mb-2">
        Sélectionnez le score à atteindre pour gagner
      </label>
      <select
        onChange={handleScoreChange}
        className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
        defaultValue="10" // Set a default value
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
        <option value="two-parts">2 parties du score à atteindre (Test)</option>
      </select>
    </div>
  );
};

export default TargetScoreSetup;
