import React from 'react';
import { Heart, Sparkles, Lock, Play, ShoppingCart, BookOpen, Zap } from 'lucide-react';
import { GameType } from '../types';

interface GameSelectionProps {
  onGameSelect: (gameType: GameType) => void;
  onStoreOpen?: () => void;
  onGuideOpen?: () => void;
  onClassicOpen?: () => void;
}

const GameSelection: React.FC<GameSelectionProps> = ({ onGameSelect, onStoreOpen, onGuideOpen, onClassicOpen }) => {
  const allGames = [
    {
      id: 'truth-or-dare' as GameType,
      title: 'Action ou Vérité',
      description: 'Le jeu classique revisité pour les couples. Questions intimes et défis sensuels pour pimenter votre relation.',
      icon: Heart,
      color: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-500/30',
      available: true,
      players: '2 joueurs',
      duration: '15-30 min'
    },
    {
      id: 'kiffe-ou-kiffe-pas' as GameType,
      title: 'Kiffe ou Kiffe Pas ?',
      description: 'Découvrez vos affinités secrètes ! Swipez sur des phrases intimes et révélez vos matchs uniquement quand vous êtes sur la même longueur d\'onde.',
      icon: Sparkles,
      color: 'from-amber-600 to-orange-600',
      borderColor: 'border-amber-500/30',
      available: true,
      players: '2+ joueurs',
      duration: '10-20 min'
    }
    ,
    {
      id: 'karma-sutra' as GameType,
      title: 'Karma ? Sutra !',
      description: 'Explorez l\'art de l\'amour avec un guide chronométré des positions du Kamasutra. Rotation automatique et signaux audio pour une expérience immersive.',
      icon: Heart,
      color: 'from-red-600 to-orange-600',
      borderColor: 'border-red-500/30',
      available: true,
      players: '2 joueurs',
      duration: 'Illimité'
    },
    {
      id: 'puzzle' as GameType,
      title: 'Puzzle !',
      description: 'Créez des puzzles personnalisés avec vos propres images ! Un joueur crée le puzzle, l\'autre le résout. Parfait pour défier votre partenaire.',
      icon: Sparkles,
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-500/30',
      available: true,
      players: '2 joueurs',
      duration: '10-30 min'
    },
    {
      id: 'stop-tergiverser' as GameType,
      title: 'Arrête de Tergiverser',
      description: 'Un jeu d\'action pur ! Des défis sensuels et osés qui mettent l\'ambiance. Pas de questions, que de l\'action pour pimenter votre soirée.',
      icon: Heart,
      color: 'from-rose-600 to-red-600',
      borderColor: 'border-rose-500/30',
      available: true,
      players: '2 joueurs',
      duration: '15-30 min'
    }
  ];

  const games = allGames;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 safe-area-inset">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-10 h-10 sm:w-16 sm:h-16 text-amber-400" />
            <div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-400 to-purple-400">
                Le Temple des Plaisirs
              </h1>
              <p className="text-purple-200 text-sm sm:text-lg mt-2">
                Votre destination pour des jeux intimes et passionnants
              </p>
            </div>
            <Sparkles className="w-10 h-10 sm:w-16 sm:h-16 text-amber-400" />
          </div>
          
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-purple-500/20 max-w-2xl mx-auto">
            <p className="text-purple-200 text-sm sm:text-base leading-relaxed">
              Explorez notre collection de jeux conçus pour rapprocher les couples et créer des moments inoubliables. 
              Chaque jeu est pensé pour stimuler la complicité, la communication et l'intimité.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            onClick={onStoreOpen}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 mobile-button touch-action-none"
          >
            <ShoppingCart className="w-6 h-6" />
            <div className="text-left">
              <div className="text-lg">Boutique Premium</div>
              <div className="text-sm opacity-90">Débloquez du contenu exclusif</div>
            </div>
          </button>
          <button
            onClick={onGuideOpen}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 mobile-button touch-action-none"
          >
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div className="text-base">Guide</div>
              <div className="text-xs opacity-75">Découvrir l'application</div>
            </div>
          </button>
        </div>

        {/* Classic Mode – featured card */}
        <div
          className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-slate-600/50 shadow-2xl hover:scale-[1.02] hover:shadow-3xl cursor-pointer transition-all duration-300 mb-8"
          onClick={onClassicOpen}
        >
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center border border-slate-500/50 shadow-inner">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Mode Classique</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">NOUVEAU</span>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                Le vrai Action ou Vérité multi-joueurs avec 4 niveaux de piment — Soft, Hot, Hard et Extrême. Les joueurs peuvent soumettre des défis secrets approuvés à la majorité en cours de partie.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-5">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full"></span>2–8 joueurs</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full"></span>Illimité</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full"></span>Gratuit</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['Soft', 'Hot', 'Hard', 'Extrême'] as const).map(lvl => (
                  <span key={lvl} className="text-xs px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
                    {lvl}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button className="mt-5 w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-3 mobile-button touch-action-none border border-slate-500/50">
            <Play className="w-5 h-5 text-amber-400" />
            Jouer maintenant
          </button>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {games.map((game) => {
            const IconComponent = game.icon;
            
            return (
              <div
                key={game.id}
                className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 ${game.borderColor} shadow-2xl transition-all duration-300 ${
                  game.available 
                    ? 'hover:scale-105 hover:shadow-3xl cursor-pointer' 
                    : 'opacity-75'
                }`}
                onClick={() => game.available && onGameSelect(game.id)}
              >
                {!game.available && (
                  <div className="absolute top-4 right-4">
                    <Lock className="w-6 h-6 text-amber-400" />
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r ${game.color} mb-4`}>
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    {game.title}
                  </h2>
                  
                  <div className="flex items-center justify-center gap-4 mb-4 text-sm text-purple-300">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      {game.players}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      {game.duration}
                    </span>
                  </div>
                </div>
                
                <p className="text-purple-200 text-sm sm:text-base leading-relaxed text-center mb-6">
                  {game.description}
                </p>
                
                {game.available ? (
                  <button
                    className={`w-full bg-gradient-to-r ${game.color} active:opacity-90 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-3 mobile-button touch-action-none`}
                  >
                    <Play className="w-5 h-5" />
                    Jouer maintenant
                  </button>
                ) : (
                  <div className="w-full bg-slate-600/50 text-slate-400 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3">
                    <Lock className="w-5 h-5" />
                    Bientôt disponible
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto">
            <p className="text-amber-200 text-sm sm:text-base font-medium mb-2">
              ⚠️ Contenu exclusivement réservé aux adultes (18+)
            </p>
            <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
              Tous nos jeux contiennent du contenu à caractère intime destiné exclusivement aux adultes consentants. 
              Jouez dans le respect mutuel et la communication.
            </p>
          </div>
          
          <p className="text-purple-300 text-xs sm:text-sm mt-6">
            Créé avec passion par <span className="font-semibold text-amber-400">Jérôme Joly</span> - 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameSelection;
