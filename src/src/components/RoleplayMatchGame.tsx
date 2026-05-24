import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Heart,
  RefreshCw,
  Sparkles,
  Shield,
  Users
} from 'lucide-react';
import {
  findScenarioForMatches,
  RoleplayMatch,
  RoleplayPreference,
  roleplayThemes
} from '../data/roleplayScenarios';

interface RoleplayMatchGameProps {
  onBack: () => void;
}

type RoleplayStep = 'intro' | 'selecting' | 'handoff' | 'results';
type PlayerResponses = Record<string, RoleplayPreference>;

const preferenceLabels: Record<RoleplayPreference, string> = {
  yes: "J'aime",
  maybe: 'A tester',
  no: 'Non'
};

const preferenceStyles: Record<RoleplayPreference, string> = {
  yes: 'border-pink-400 bg-pink-500/20 text-pink-100 shadow-lg shadow-pink-900/20',
  maybe: 'border-amber-400 bg-amber-500/20 text-amber-100 shadow-lg shadow-amber-900/20',
  no: 'border-slate-500 bg-slate-700/50 text-slate-200'
};

const intensityStyles = {
  doux: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30',
  sensuel: 'bg-pink-500/15 text-pink-200 border-pink-400/30',
  audacieux: 'bg-orange-500/15 text-orange-200 border-orange-400/30'
};

const RoleplayMatchGame: React.FC<RoleplayMatchGameProps> = ({ onBack }) => {
  const [step, setStep] = useState<RoleplayStep>('intro');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerNames, setPlayerNames] = useState(['Joueur 1', 'Joueur 2']);
  const [safeWord, setSafeWord] = useState('Pause');
  const [responses, setResponses] = useState<PlayerResponses[]>([{}, {}]);

  const currentResponses = responses[currentPlayerIndex];
  const answeredCount = Object.keys(currentResponses).length;
  const canValidateSelection = answeredCount === roleplayThemes.length;

  const matches = useMemo<RoleplayMatch[]>(() => {
    return roleplayThemes
      .map((theme) => {
        const playerOnePreference = responses[0][theme.id];
        const playerTwoPreference = responses[1][theme.id];

        if (
          playerOnePreference &&
          playerTwoPreference &&
          playerOnePreference !== 'no' &&
          playerTwoPreference !== 'no'
        ) {
          return {
            theme,
            playerOnePreference,
            playerTwoPreference
          };
        }

        return null;
      })
      .filter((match): match is RoleplayMatch => match !== null)
      .sort((a, b) => {
        const aScore = Number(a.playerOnePreference === 'yes') + Number(a.playerTwoPreference === 'yes');
        const bScore = Number(b.playerOnePreference === 'yes') + Number(b.playerTwoPreference === 'yes');
        return bScore - aScore;
      });
  }, [responses]);

  const scenario = useMemo(() => findScenarioForMatches(matches), [matches]);

  const updatePlayerName = (index: number, name: string) => {
    setPlayerNames((prev) => prev.map((playerName, playerIndex) => (
      playerIndex === index ? name : playerName
    )));
  };

  const setPreference = (themeId: string, preference: RoleplayPreference) => {
    setResponses((prev) => prev.map((playerResponses, playerIndex) => {
      if (playerIndex !== currentPlayerIndex) {
        return playerResponses;
      }

      return {
        ...playerResponses,
        [themeId]: preference
      };
    }));
  };

  const startSelection = () => {
    setCurrentPlayerIndex(0);
    setStep('selecting');
  };

  const validateCurrentPlayer = () => {
    if (!canValidateSelection) {
      return;
    }

    if (currentPlayerIndex === 0) {
      setCurrentPlayerIndex(1);
      setStep('handoff');
      return;
    }

    setStep('results');
  };

  const resetGame = () => {
    setStep('intro');
    setCurrentPlayerIndex(0);
    setResponses([{}, {}]);
  };

  const normalizedSafeWord = safeWord.trim() || 'Pause';

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-fuchsia-950 to-slate-950 px-4 py-8 safe-area-inset">
        <div className="max-w-4xl mx-auto">
          <Header onBack={onBack} />

          <div className="bg-slate-900/70 backdrop-blur-sm rounded-3xl border border-pink-500/30 shadow-2xl p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 mb-5">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-amber-200 to-purple-300 mb-4">
                Fantasmes & Roles
              </h1>
              <p className="text-purple-100 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Chacun selectionne ses envies en secret. L'application ne revele ensuite que les envies compatibles
                et propose un scenario de jeu de role adulte, complice et consentant.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <InfoCard
                icon={<Shield className="w-6 h-6" />}
                title="Confidentiel"
                text="Les refus et envies non partagees ne sont jamais affiches."
              />
              <InfoCard
                icon={<Users className="w-6 h-6" />}
                title="Deux tours"
                text="Passez le telephone apres le Joueur 1 pour garder l'effet surprise."
              />
              <InfoCard
                icon={<Sparkles className="w-6 h-6" />}
                title="Scenario"
                text="Un roleplay est choisi selon vos themes communs."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <label className="block">
                <span className="block text-sm font-medium text-purple-200 mb-2">Nom du Joueur 1</span>
                <input
                  value={playerNames[0]}
                  onChange={(event) => updatePlayerName(0, event.target.value)}
                  className="w-full bg-slate-800/80 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  maxLength={24}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-purple-200 mb-2">Nom du Joueur 2</span>
                <input
                  value={playerNames[1]}
                  onChange={(event) => updatePlayerName(1, event.target.value)}
                  className="w-full bg-slate-800/80 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  maxLength={24}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-purple-200 mb-2">Mot stop commun</span>
                <input
                  value={safeWord}
                  onChange={(event) => setSafeWord(event.target.value)}
                  className="w-full bg-slate-800/80 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  maxLength={24}
                />
              </label>
            </div>

            <div className="bg-amber-900/20 border border-amber-400/40 rounded-2xl p-4 mb-8">
              <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
                Avant de jouer, mettez-vous d'accord sur vos limites, votre mot stop et le droit de transformer
                n'importe quelle consigne. Le plaisir vient de l'accord mutuel, pas de la pression.
              </p>
            </div>

            <button
              onClick={startSelection}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-3 mobile-button"
            >
              <Heart className="w-5 h-5" />
              Commencer les selections secretes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'handoff') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 px-4 py-8 safe-area-inset flex items-center">
        <div className="max-w-2xl mx-auto w-full">
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-purple-500/30 shadow-2xl p-6 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 mb-5">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              A {playerNames[1] || 'Joueur 2'} de jouer
            </h2>
            <p className="text-purple-100 leading-relaxed mb-8">
              Les choix de {playerNames[0] || 'Joueur 1'} sont enregistres et masques.
              Passez l'appareil, puis lancez le deuxieme tour quand vous etes pret.
            </p>
            <button
              onClick={() => setStep('selecting')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg"
            >
              Je suis {playerNames[1] || 'Joueur 2'}, commencer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-fuchsia-950 to-slate-950 px-4 py-8 safe-area-inset">
        <div className="max-w-5xl mx-auto">
          <Header onBack={onBack} />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-pink-600 mb-5">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3">
              Vos envies communes
            </h1>
            <p className="text-purple-100 max-w-2xl mx-auto">
              Seuls les themes acceptes par vous deux apparaissent ici. Gardez le mot stop "{normalizedSafeWord}"
              disponible pendant tout le jeu.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1 bg-slate-900/70 backdrop-blur-sm rounded-3xl border border-pink-500/30 p-5 sm:p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-300" />
                Matches ({matches.length})
              </h2>

              {matches.length > 0 ? (
                <div className="space-y-3">
                  {matches.map((match) => (
                    <div key={match.theme.id} className="bg-slate-800/80 rounded-2xl border border-purple-500/20 p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-white font-semibold">{match.theme.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full border ${intensityStyles[match.theme.intensity]}`}>
                          {match.theme.intensity}
                        </span>
                      </div>
                      <p className="text-purple-200 text-sm mb-3">{match.theme.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <PreferencePill name={playerNames[0]} preference={match.playerOnePreference} />
                        <PreferencePill name={playerNames[1]} preference={match.playerTwoPreference} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-800/80 rounded-2xl border border-amber-500/30 p-4">
                  <p className="text-amber-100 text-sm leading-relaxed">
                    Aucun theme n'a ete coche positivement par vous deux. Le scenario propose vous aide a discuter
                    doucement de ce qui pourrait devenir un futur match.
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 bg-slate-900/70 backdrop-blur-sm rounded-3xl border border-amber-500/30 p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-7 h-7 text-amber-300" />
                <p className="text-amber-200 font-semibold uppercase tracking-[0.2em] text-xs">
                  Scenario suggere
                </p>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                {scenario.title}
              </h2>
              <p className="text-purple-100 text-base sm:text-lg leading-relaxed mb-6">
                {scenario.intro}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <RoleCard playerName={playerNames[0] || 'Joueur 1'} role={scenario.roles[0]} />
                <RoleCard playerName={playerNames[1] || 'Joueur 2'} role={scenario.roles[1]} />
              </div>

              <div className="bg-purple-900/20 border border-purple-400/30 rounded-2xl p-4 mb-6">
                <h3 className="text-white font-semibold mb-3">Regles du jeu</h3>
                <ul className="space-y-2">
                  {scenario.rules.map((rule) => (
                    <li key={rule} className="flex gap-3 text-purple-100 text-sm sm:text-base">
                      <Check className="w-5 h-5 text-pink-300 flex-shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-800/70 rounded-2xl border border-slate-600/40 p-4">
                  <h3 className="text-white font-semibold mb-2">Ambiance</h3>
                  <p className="text-purple-200 text-sm leading-relaxed">{scenario.ambiance}</p>
                </div>
                <div className="bg-amber-900/20 rounded-2xl border border-amber-400/40 p-4">
                  <h3 className="text-amber-100 font-semibold mb-2">Consentement</h3>
                  <p className="text-amber-100 text-sm leading-relaxed">
                    {scenario.consentReminder} Mot stop : <strong>{normalizedSafeWord}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={resetGame}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Refaire une selection
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-5 rounded-xl transition-colors"
                >
                  Retour aux jeux
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-fuchsia-950 to-slate-950 px-4 py-8 safe-area-inset">
      <div className="max-w-5xl mx-auto">
        <Header onBack={onBack} />

        <div className="mb-6 bg-slate-900/70 backdrop-blur-sm rounded-3xl border border-pink-500/30 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-pink-200 font-semibold uppercase tracking-[0.2em] text-xs mb-2">
                Selection secrete
              </p>
              <h1 className="text-2xl sm:text-4xl font-bold text-white">
                {playerNames[currentPlayerIndex] || `Joueur ${currentPlayerIndex + 1}`}
              </h1>
              <p className="text-purple-200 mt-2">
                Choisissez une reponse pour chaque theme. Les autres ne verront pas vos refus.
              </p>
            </div>
            <div className="bg-slate-800/80 rounded-2xl border border-purple-500/20 p-4 text-center">
              <p className="text-3xl font-bold text-white">{answeredCount}/{roleplayThemes.length}</p>
              <p className="text-purple-300 text-sm">themes notes</p>
            </div>
          </div>

          <div className="mt-5 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-amber-400 transition-all duration-300"
              style={{ width: `${(answeredCount / roleplayThemes.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {roleplayThemes.map((theme) => (
            <div key={theme.id} className="bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-lg font-bold text-white">{theme.title}</h2>
                <span className={`text-xs px-2 py-1 rounded-full border ${intensityStyles[theme.intensity]}`}>
                  {theme.intensity}
                </span>
              </div>
              <p className="text-purple-200 text-sm leading-relaxed mb-4">{theme.description}</p>

              <div className="grid grid-cols-3 gap-2">
                {(['yes', 'maybe', 'no'] as RoleplayPreference[]).map((preference) => {
                  const isSelected = currentResponses[theme.id] === preference;
                  return (
                    <button
                      key={preference}
                      onClick={() => setPreference(theme.id, preference)}
                      className={`border rounded-xl px-2 py-3 text-sm font-semibold transition-all ${
                        isSelected
                          ? preferenceStyles[preference]
                          : 'border-slate-600 bg-slate-800/60 text-slate-300 hover:border-purple-400'
                      }`}
                    >
                      {preferenceLabels[preference]}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-4 bg-slate-950/90 backdrop-blur-md border border-purple-500/30 rounded-2xl p-4 shadow-2xl">
          <button
            onClick={validateCurrentPlayer}
            disabled={!canValidateSelection}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 mobile-button"
          >
            <Check className="w-5 h-5" />
            {canValidateSelection
              ? currentPlayerIndex === 0
                ? 'Valider et passer au Joueur 2'
                : 'Reveler les matches'
              : `Encore ${roleplayThemes.length - answeredCount} theme(s) a noter`}
          </button>
        </div>
      </div>
    </div>
  );
};

interface HeaderProps {
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => (
  <button
    onClick={onBack}
    className="mb-6 flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
  >
    <ArrowLeft className="w-5 h-5" />
    Retour
  </button>
);

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, text }) => (
  <div className="bg-slate-800/60 rounded-2xl border border-purple-500/20 p-4">
    <div className="text-pink-300 mb-3">{icon}</div>
    <h3 className="text-white font-semibold mb-1">{title}</h3>
    <p className="text-purple-200 text-sm leading-relaxed">{text}</p>
  </div>
);

interface PreferencePillProps {
  name: string;
  preference: Exclude<RoleplayPreference, 'no'>;
}

const PreferencePill: React.FC<PreferencePillProps> = ({ name, preference }) => (
  <span className={`px-2 py-1 rounded-full border ${preferenceStyles[preference]}`}>
    {name || 'Joueur'} : {preferenceLabels[preference]}
  </span>
);

interface RoleCardProps {
  playerName: string;
  role: string;
}

const RoleCard: React.FC<RoleCardProps> = ({ playerName, role }) => (
  <div className="bg-slate-800/70 rounded-2xl border border-purple-500/20 p-4">
    <p className="text-pink-200 text-sm font-semibold mb-1">{playerName}</p>
    <p className="text-white">{role}</p>
  </div>
);

export default RoleplayMatchGame;
