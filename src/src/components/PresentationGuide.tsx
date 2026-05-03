import React, { useState } from 'react';
import { ArrowLeft, Heart, Sparkles, Clock, Users, Star, Shield, Download, Zap, BookOpen } from 'lucide-react';

interface PresentationGuideProps {
  onBack: () => void;
}

type TabId = 'overview' | 'games' | 'features' | 'howto';

const PresentationGuide: React.FC<PresentationGuideProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Apercu' },
    { id: 'games', label: 'Jeux' },
    { id: 'features', label: 'Fonctions' },
    { id: 'howto', label: 'Comment jouer' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6 safe-area-inset">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 active:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour</span>
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">Guide de Presentation</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-xl p-1 border border-slate-700/50 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[80px] py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'games' && <GamesTab />}
          {activeTab === 'features' && <FeaturesTab />}
          {activeTab === 'howto' && <HowToTab />}
        </div>

        {/* Footer */}
        <div className="text-center mt-10 pt-6 border-t border-slate-700/50">
          <p className="text-slate-400 text-xs">
            Le Temple des Plaisirs - Cree par Jerome Joly - 2025
          </p>
        </div>
      </div>
    </div>
  );
};

function OverviewTab() {
  return (
    <>
      <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Le Temple des Plaisirs</h2>
            <p className="text-amber-300 text-sm">Votre destination pour des jeux intimes et passionnants</p>
          </div>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Une collection de jeux intimes concus specialement pour les couples qui souhaitent pimenter leur relation.
          Contrairement aux autres applications du marche, Le Temple des Plaisirs n'a pas de limites :
          du contenu audacieux, des defis sensuels et des experiences immersives pour des soirees inoubliables.
        </p>
      </section>

      <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400" />
          Points Forts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: '5 jeux disponibles', desc: 'Variete et renouvellement garanti' },
            { title: 'Contenu sans limites', desc: 'Plus audacieux que la concurrence' },
            { title: 'Personnalisable', desc: 'Ajoutez vos propres defis et images' },
            { title: 'Installable (PWA)', desc: 'Fonctionne comme une app native' },
            { title: 'Mode hors-ligne', desc: 'Jouez partout, sans connexion' },
            { title: '18+ uniquement', desc: 'Reserve aux adultes consentants' },
          ].map((item) => (
            <div key={item.title} className="bg-slate-700/30 rounded-lg p-3">
              <p className="text-white font-medium text-sm">{item.title}</p>
              <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-amber-900/20 rounded-2xl p-6 border border-amber-500/30">
        <h3 className="text-lg font-semibold text-amber-200 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          Avertissement
        </h3>
        <p className="text-amber-100 text-sm leading-relaxed">
          Ce jeu contient du contenu a caractere intime et sensuel. Il est destine exclusivement aux adultes
          ages de 18 ans et plus. En utilisant cette application, vous confirmez etre majeur(e) et consentant(e).
          Jouez toujours dans le respect mutuel et la communication.
        </p>
      </section>
    </>
  );
}

function GamesTab() {
  const games = [
    {
      title: 'Action ou Verite',
      color: 'from-rose-500 to-pink-600',
      players: '2 joueurs',
      duration: '15-30 min',
      description: 'Le classique des jeux de couple, revisite avec des questions intimes et des defis sensuels. Choisissez entre le mode Soft (romantique et suggestif) ou le mode Intense (audacieux et sensuel).',
      features: [
        'Mode Soft et mode Intense',
        'Systeme de points et de manches',
        'Defis personnalises (apparaissent a la 3e manche)',
        'Roue aleatoire pour selectionner les defis',
        'Definition de prix pour le gagnant',
      ],
    },
    {
      title: 'Kiffe ou Kiffe Pas ?',
      color: 'from-amber-500 to-orange-600',
      players: '2+ joueurs',
      duration: '10-20 min',
      description: 'Un jeu de compatibilite intime. Chaque joueur swipe independamment sur des scenarios intimes. Les matchs ne sont reveles que lorsque les deux partenaires sont d\'accord.',
      features: [
        'Swipe intuitif (j\'aime / j\'aime pas)',
        'Revelation des matchs uniquement mutuels',
        'Phrases personnalisables',
        'Sessions a distance avec code',
        'Plus de 20 scenarios pre-charges',
      ],
    },
    {
      title: 'Karma ? Sutra !',
      color: 'from-red-500 to-orange-500',
      players: '2 joueurs',
      duration: 'Illimite',
      description: 'Un guide chronometre des positions du Kamasutra. L\'application selectionne aleatoirement des positions et vous guide avec un timer et des signaux audio pour une rotation automatique.',
      features: [
        'Rotation automatique des positions',
        'Timer configurable (2-5 min par position)',
        'Signaux audio pour les transitions',
        'Pause et reprise possibles',
        'Positions variees par difficulte',
      ],
    },
    {
      title: 'Puzzle !',
      color: 'from-blue-500 to-cyan-500',
      players: '2 joueurs',
      duration: '10-30 min',
      description: 'Creez des puzzles a partir de vos propres photos intimes. Un joueur cree le puzzle, l\'autre le resout. Quatre niveaux de difficulte du 3x3 au 6x6.',
      features: [
        'Import de vos propres images',
        'Difficulte : Facile, Moyen, Difficile, Expert',
        'Glisser-deposer pour resoudre',
        'Sessions partagees via code',
        'Roles createur / solveur',
      ],
    },
    {
      title: 'Arrete de Tergiverser',
      color: 'from-rose-500 to-red-600',
      players: '2 joueurs',
      duration: '15-30 min',
      description: 'Un jeu d\'action pure. Pas de questions, uniquement des defis sensuels et oses. Les deux joueurs alternent et relevent des defis de plus en plus audacieux.',
      features: [
        'Que de l\'action, pas de questions',
        'Defis sensuels et oses',
        'Mode Soft et Intense',
        'Defis personnalises (a partir de la 3e manche)',
        'Systeme de score',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {games.map((game) => (
        <section key={game.title} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${game.color} flex items-center justify-center flex-shrink-0`}>
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{game.title}</h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {game.players}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {game.duration}
                </span>
              </div>
            </div>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">{game.description}</p>
          <ul className="space-y-1.5">
            {game.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function FeaturesTab() {
  const features = [
    {
      icon: Shield,
      title: 'Verification d\'age',
      description: 'L\'application demande une confirmation d\'age avant de donner acces au contenu. Seuls les adultes de 18 ans et plus peuvent jouer.',
    },
    {
      icon: Download,
      title: 'Application installable (PWA)',
      description: 'Installez Le Temple des Plaisirs sur votre ecran d\'accueil comme une application native. Fonctionne hors-ligne et offre une experience fluide.',
    },
    {
      icon: Zap,
      title: 'Defis personnalises',
      description: 'Ajoutez vos propres defis et questions pour personnaliser l\'experience. Vos creations apparaissent a partir de la 3e manche pour laisser le temps de se mettre dans l\'ambiance.',
    },
    {
      icon: Star,
      title: 'Systeme de score et prix',
      description: 'Definissez un score cible et des prix pour le gagnant. Les prix peuvent etre visibles ou caches jusqu\'a la victoire pour ajouter du suspense.',
    },
    {
      icon: Users,
      title: 'Sessions a distance',
      description: 'Certains jeux supportent le jeu a distance via des codes de session. Partagez le code avec votre partenaire pour jouer depuis deux appareils differents.',
    },
    {
      icon: Heart,
      title: 'Deux modes d\'intensite',
      description: 'Mode Soft pour les decouverts romantiques et suggestives. Mode Intense pour les couples experimentes qui souhaitent aller plus loin.',
    },
  ];

  return (
    <div className="space-y-4">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <section key={feature.title} className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-600/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function HowToTab() {
  const steps = [
    {
      step: 1,
      title: 'Verification d\'age',
      description: 'Au lancement, confirmez que vous avez 18 ans ou plus. Cette etape est obligatoire pour acceder aux jeux.',
    },
    {
      step: 2,
      title: 'Choisissez un jeu',
      description: 'Depuis l\'ecran principal, selectionnez le jeu qui vous convient parmi les 5 disponibles. Chaque jeu a ses propres regles et sa propre ambiance.',
    },
    {
      step: 3,
      title: 'Configurez la partie',
      description: 'Entrez les noms des joueurs, choisissez le mode (Soft ou Intense), definissez un score cible et optionnellement des prix et des defis personnalises.',
    },
    {
      step: 4,
      title: 'Jouez !',
      description: 'Alternez les tours en relevant les defis proposes. Les defis personnalises apparaissent a partir de la 3e manche. Validez ou passez les defis selon votre envie.',
    },
    {
      step: 5,
      title: 'Fin de partie',
      description: 'La partie se termine quand un joueur atteint le score cible. Le gagnant remporte le prix defini au debut. Vous pouvez relancer une partie ou changer de jeu.',
    },
  ];

  return (
    <div className="space-y-4">
      <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Demarrage rapide</h3>
        <div className="space-y-4">
          {steps.map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{item.step}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm">{item.title}</h4>
                <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Conseils pour une bonne experience</h3>
        <ul className="space-y-3">
          {[
            'Jouez dans un environnement confortable et intime',
            'Communiquez ouvertement avec votre partenaire',
            'Respectez toujours les limites de chacun',
            'Commencez par le mode Soft si c\'est votre premiere fois',
            'Utilisez les defis personnalises pour adapter le jeu a vos envies',
            'Installez l\'application pour une meilleure experience',
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-amber-400 mt-0.5">-</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default PresentationGuide;
