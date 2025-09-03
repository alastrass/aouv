import React, { useState } from 'react';
import { Users, Settings, Plus, Trash2, Heart } from 'lucide-react';
import { Player, Category, Challenge, CustomChallengeInput } from '../types';
import PrizeDefinition from './PrizeDefinition';
import TargetScoreSetup from './TargetScoreSetup';

interface PlayerSetupProps {
  onComplete: (players: Player[], category: Category, customChallenges: Challenge[], targetScore: number, prizes: { [playerId: number]: { prize: string; isVisible: boolean } }) => void;
  initialCustomChallenges?: Challenge[];
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onComplete, initialCustomChallenges = [] }) => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [category, setCategory] = useState<Category>('soft');
  const [customChallenges, setCustomChallenges] = useState<Challenge[]>(initialCustomChallenges);
  const [newChallenge, setNewChallenge] = useState<CustomChallengeInput>({
    type: 'truth',
    category: 'soft',
    text: ''
  });
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [targetScore, setTargetScore] = useState(10);
  const [prizes, setPrizes] = useState<{ [playerId: number]: { prize: string; isVisible: boolean } }>({});

  const handleAddCustomChallenge = () => {
    if (newChallenge.text.trim()) {
      const challenge: Challenge = {
        id: Date.now() + Math.random(),
        ...newChallenge,
        isCustom: true
      };
      setCustomChallenges(prev => [...prev, challenge]);
      setNewChallenge({
        type: 'truth',
        category: 'soft',
        text: ''
      });
      setShowCustomForm(false);
    }
  };

  const handleRemoveCustomChallenge = (id: number) => {
    setCustomChallenges(prev => prev.filter(c => c.id !== id));
  };

  const handlePrizeDefined = (playerId: number, prize: string, isVisible: boolean) => {
    setPrizes(prev => ({
      ...prev,
      [playerId]: { prize, isVisible }
    }));
  };

  const handleTargetScoreDefined = (score: number) => {
    setTargetScore(score);
  };

  const handleSubmit = () => {
    if (player1Name.trim() && player2Name.trim()) {
      const players: Player[] = [
        { id: 1, name: player1Name.trim(), score: 0 },
        { id: 2, name: player2Name.trim(), score: 0 }
      ];
      onComplete(players, category, customChallenges, targetScore, prizes);
    }
  };

  const filteredCustomChallenges = customChallenges.filter(c => c.category === category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/20">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Settings className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">Configuration du Jeu</h1>
              <Settings className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-purple-200">Personnalisez votre expérience de jeu</p>
          </div>

          {/* Player Names */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Noms des Joueurs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Joueur 1
                </label>
                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  placeholder="Entrez le nom du joueur 1"
                  maxLength={20}
                />
              </div>
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Joueur 2
                </label>
                <input
                  type="text"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  placeholder="Entrez le nom du joueur 2"
                  maxLength={20}
                />
              </div>
            </div>
          </div>

          {/* Prize Definitions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Prix
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PrizeDefinition
                playerId={1}
                playerName={player1Name}
                onPrizeDefined={handlePrizeDefined}
              />
              <PrizeDefinition
                playerId={2}
                playerName={player2Name}
                onPrizeDefined={handlePrizeDefined}
              />
            </div>
          </div>

          {/* Target Score Setup */}
          <TargetScoreSetup onTargetScoreDefined={handleTargetScoreDefined} />

          {/* Category Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Mode de Jeu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setCategory('soft')}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  category === 'soft'
                    ? 'border-purple-400 bg-purple-500/20'
                    : 'border-purple-500/30 bg-slate-700/50 hover:border-purple-400/50'
                }`}
              >
                <Heart className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Mode Soft</h3>
                <p className="text-purple-200 text-sm">
                  Contenu romantique et suggestif léger, parfait pour découvrir et se rapprocher
                </p>
              </button>
              <button
                onClick={() => setCategory('intense')}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  category === 'intense'
                    ? 'border-red-400 bg-red-500/20'
                    : 'border-purple-500/30 bg-slate-700/50 hover:border-purple-400/50'
                }`}
              >
                <Heart className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Mode Intense</h3>
                <p className="text-purple-200 text-sm">
                  Contenu plus audacieux et sensuel pour les couples expérimentés
                </p>
              </button>
            </div>
          </div>

          {/* Custom Challenges */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Défis Personnalisés (Optionnel)
            </h2>
            <p className="text-purple-200 text-sm mb-4">
              Ajoutez vos propres questions et actions pour personnaliser votre jeu
            </p>

            {!showCustomForm ? (
              <button
                onClick={() => setShowCustomForm(true)}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un défi personnalisé
              </button>
            ) : (
              <div className="bg-slate-700/50 rounded-lg p-6 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Type
                    </label>
                    <select
                      value={newChallenge.type}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, type: e.target.value as 'truth' | 'dare' }))}
                      className="w-full px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="truth">Vérité</option>
                      <option value="dare">Action</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Catégorie
                    </label>
                    <select
                      value={newChallenge.category}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, category: e.target.value as Category }))}
                      className="w-full px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="soft">Soft</option>
                      <option value="intense">Intense</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Texte du défi
                  </label>
                  <textarea
                    value={newChallenge.text}
                    onChange={(e) => setNewChallenge(prev => ({ ...prev, text: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 resize-none"
                    placeholder="Décrivez votre défi personnalisé..."
                    rows={3}
                    maxLength={200}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddCustomChallenge}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                    disabled={!newChallenge.text.trim()}
                  >
                    Ajouter
                  </button>
                  <button
                    onClick={() => setShowCustomForm(false)}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Display Custom Challenges */}
            {filteredCustomChallenges.length > 0 && (
              <div className="space-y-2">
                <p className="text-purple-200 text-sm mb-3">
                  Défis personnalisés pour le mode {category === 'soft' ? 'Soft' : 'Intense'} :
                </p>
                {filteredCustomChallenges.map((challenge) => (
                  <div key={challenge.id} className="bg-slate-700/30 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex-1">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium mr-2 ${
                        challenge.type === 'truth' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {challenge.type === 'truth' ? 'Vérité' : 'Action'}
                      </span>
                      <span className="text-purple-300 text-sm italic">
                        Défi personnalisé masqué - sera révélé pendant le jeu
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveCustomChallenge(challenge.id)}
                      className="ml-3 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Start Game Button */}
          <button
            onClick={handleSubmit}
            disabled={!player1Name.trim() || !player2Name.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            Commencer le Jeu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerSetup;
