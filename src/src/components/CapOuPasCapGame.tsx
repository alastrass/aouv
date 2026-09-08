import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Check, X, Clock, History, Users, Layers, Sparkles, Flame, Heart, Zap } from 'lucide-react';
import { CapOuPasCapPhase, CapIntensity, CapChallenge, CapHistoryEntry, Player } from '../types';
import { capChallenges, capIntensityConfig } from '../data/capChallenges';
import ChallengeStopwatch from './ChallengeStopwatch';

interface CapOuPasCapGameProps {
  onBack: () => void;
}

const STORAGE_KEY = 'capOuPasCap_session';

const intensityOrder: CapIntensity[] = ['romantique', 'coquin', 'chaud', 'extreme'];

const intensityIcons: Record<CapIntensity, React.FC<{ className?: string }>> = {
  romantique: Heart,
  coquin: Sparkles,
  chaud: Flame,
  extreme: Zap,
};

const CapOuPasCapGame: React.FC<CapOuPasCapGameProps> = ({ onBack }) => {
  const [phase, setPhase] = useState<CapOuPasCapPhase>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedIntensities, setSelectedIntensities] = useState<CapIntensity[]>(['romantique', 'coquin']);
  const [deck, setDeck] = useState<CapChallenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<CapChallenge | null>(null);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [usedIds, setUsedIds] = useState<number[]>([]);
  const [history, setHistory] = useState<CapHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [targetScore, setTargetScore] = useState(10);

  // Setup form state
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  // Load saved session
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.players?.length >= 2) {
          setPlayers(data.players);
          setPlayer1Name(data.players[0]?.name ?? '');
          setPlayer2Name(data.players[1]?.name ?? '');
        }
        if (data.selectedIntensities) setSelectedIntensities(data.selectedIntensities);
        if (data.targetScore) setTargetScore(data.targetScore);
        if (data.history) setHistory(data.history);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save session
  const saveSession = useCallback((updates: Partial<{ players: Player[]; selectedIntensities: CapIntensity[]; targetScore: number; history: CapHistoryEntry[] }>) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const existing = saved ? JSON.parse(saved) : {};
      const merged = { ...existing, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // ignore
    }
  }, []);

  const toggleIntensity = (intensity: CapIntensity) => {
    setSelectedIntensities(prev =>
      prev.includes(intensity)
        ? prev.filter(i => i !== intensity)
        : [...prev, intensity]
    );
  };

  const buildDeck = useCallback((intensities: CapIntensity[]): CapChallenge[] => {
    const pool = capChallenges.filter(c => intensities.includes(c.intensity));
    // Shuffle
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const handleStart = () => {
    if (!player1Name.trim() || !player2Name.trim() || selectedIntensities.length === 0) return;
    const newPlayers: Player[] = [
      { id: 1, name: player1Name.trim(), score: 0 },
      { id: 2, name: player2Name.trim(), score: 0 },
    ];
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setDeck(buildDeck(selectedIntensities));
    setUsedIds([]);
    setHistory([]);
    setTargetScore(10);
    saveSession({ players: newPlayers, selectedIntensities, targetScore: 10, history: [] });
    setPhase('playing');
  };

  const drawCard = useCallback(() => {
    const available = deck.filter(c => !usedIds.includes(c.id));
    if (available.length === 0) {
      // Reshuffle
      const reshuffled = buildDeck(selectedIntensities);
      setDeck(reshuffled);
      setUsedIds([]);
      const next = reshuffled[0];
      setCurrentChallenge(next);
      setUsedIds([next.id]);
    } else {
      const next = available[Math.floor(Math.random() * available.length)];
      setCurrentChallenge(next);
      setUsedIds(prev => [...prev, next.id]);
    }
    setCardRevealed(false);
  }, [deck, usedIds, selectedIntensities, buildDeck]);

  // Auto-draw first card when entering playing phase
  useEffect(() => {
    if (phase === 'playing' && !currentChallenge) {
      drawCard();
    }
  }, [phase, currentChallenge, drawCard]);

  const handleReleve = () => {
    if (!currentChallenge) return;
    const entry: CapHistoryEntry = {
      challengeId: currentChallenge.id,
      text: currentChallenge.text,
      intensity: currentChallenge.intensity,
      result: 'releve',
      playerName: players[currentPlayerIndex].name,
      timestamp: Date.now(),
    };
    const newHistory = [entry, ...history];
    setHistory(newHistory);
    saveSession({ history: newHistory });

    setPlayers(prev => prev.map((p, i) =>
      i === currentPlayerIndex ? { ...p, score: p.score + 1 } : p
    ));
    saveSession({ players: players.map((p, i) => i === currentPlayerIndex ? { ...p, score: p.score + 1 } : p) });

    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    setCurrentChallenge(null);
  };

  const handleForfait = () => {
    if (!currentChallenge) return;
    const entry: CapHistoryEntry = {
      challengeId: currentChallenge.id,
      text: currentChallenge.text,
      intensity: currentChallenge.intensity,
      result: 'forfait',
      playerName: players[currentPlayerIndex].name,
      timestamp: Date.now(),
    };
    const newHistory = [entry, ...history];
    setHistory(newHistory);
    saveSession({ history: newHistory });

    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    setCurrentChallenge(null);
  };

  const handleRestart = () => {
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
    setUsedIds([]);
    setHistory([]);
    setCurrentChallenge(null);
    setCurrentPlayerIndex(0);
    setDeck(buildDeck(selectedIntensities));
    saveSession({ history: [], players: players.map(p => ({ ...p, score: 0 })) });
  };

  const handleBackToSetup = () => {
    setPhase('setup');
    setCurrentChallenge(null);
  };

  const remainingInDeck = deck.filter(c => !usedIds.includes(c.id)).length;

  // ── SETUP PHASE ──────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 safe-area-inset">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Retour</span>
            </button>
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-teal-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">Cap ou pas Cap</h1>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-500/20 shadow-2xl">
            <p className="text-purple-200 text-sm sm:text-base leading-relaxed mb-6">
              Des cartes mystères à retourner unes à unes. Chaque joueur tente sa chance : relève le défi ou déclare forfait.
              Choisissez l'intensité, et laissez le hasard décider de votre prochaine aventure.
            </p>

            {/* Player names */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Joueurs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={player1Name}
                  onChange={e => setPlayer1Name(e.target.value)}
                  placeholder="Joueur 1"
                  maxLength={20}
                  className="px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition-colors"
                />
                <input
                  type="text"
                  value={player2Name}
                  onChange={e => setPlayer2Name(e.target.value)}
                  placeholder="Joueur 2"
                  maxLength={20}
                  className="px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>
            </div>

            {/* Intensity selection */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Niveau d'intensité</h2>
              <p className="text-purple-200 text-sm mb-4">Sélectionnez un ou plusieurs niveaux. Les cartes seront tirées parmi les niveaux choisis.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {intensityOrder.map(intensity => {
                  const config = capIntensityConfig[intensity];
                  const Icon = intensityIcons[intensity];
                  const isSelected = selectedIntensities.includes(intensity);
                  return (
                    <button
                      key={intensity}
                      onClick={() => toggleIntensity(intensity)}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                        isSelected
                          ? `${config.border} bg-gradient-to-br ${config.gradient} bg-opacity-20`
                          : 'border-purple-500/20 bg-slate-700/50 hover:border-purple-400/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : config.color}`} />
                        <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-purple-200'}`}>{config.label}</h3>
                      </div>
                      <p className="text-sm text-purple-200/80">
                        {intensity === 'romantique' && 'Tendresse, regards, mots doux et premières caresses'}
                        {intensity === 'coquin' && 'Baisers passionnés, caresses sensuelles et jeux de séduction'}
                        {intensity === 'chaud' && 'Déshabillage, caresses osées et désir qui monte'}
                        {intensity === 'extreme' && 'Jeux de rôle, mise en scène et scénarios audacieux'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={!player1Name.trim() || !player2Name.trim() || selectedIntensities.length === 0}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              Commencer la partie
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAYING PHASE ────────────────────────────────────────────────────────────
  const config = currentChallenge ? capIntensityConfig[currentChallenge.intensity] : null;
  const Icon = currentChallenge ? intensityIcons[currentChallenge.intensity] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 safe-area-inset">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBackToSetup}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Retour</span>
          </button>

          <div className="text-center flex-1 mx-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Layers className="w-5 h-5 text-teal-400" />
              <h1 className="text-lg sm:text-xl font-bold text-white">Cap ou pas Cap</h1>
            </div>
            <p className="text-purple-200 text-xs sm:text-sm">
              Tour de <span className="font-bold text-amber-400">{players[currentPlayerIndex]?.name}</span>
            </p>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
            aria-label="Historique"
          >
            <History className="w-4 h-4" />
          </button>
        </div>

        {/* Score Board */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {players.map((player, i) => (
            <div key={player.id} className={`text-center px-4 py-3 rounded-xl border-2 transition-all ${
              i === currentPlayerIndex
                ? 'border-amber-400 bg-amber-500/10'
                : 'border-purple-500/20 bg-slate-800/50'
            }`}>
              <p className={`text-sm font-medium ${i === currentPlayerIndex ? 'text-amber-300' : 'text-purple-200'}`}>
                {player.name}
              </p>
              <p className="text-2xl font-bold text-white">{player.score}</p>
            </div>
          ))}
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="mb-6 bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20 shadow-xl animate-slide-up">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              Historique de la session
            </h3>
            {history.length === 0 ? (
              <p className="text-purple-300 text-sm text-center py-4">Aucun défi relevé pour le moment.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.map((entry, idx) => {
                  const entryConfig = capIntensityConfig[entry.intensity];
                  return (
                    <div key={idx} className={`flex items-start gap-3 rounded-lg p-3 border ${
                      entry.result === 'releve'
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-rose-500/10 border-rose-500/30'
                    }`}>
                      <div className="flex-shrink-0 mt-0.5">
                        {entry.result === 'releve'
                          ? <Check className="w-4 h-4 text-emerald-400" />
                          : <X className="w-4 h-4 text-rose-400" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm leading-snug">{entry.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-medium ${entryConfig.color}`}>{entryConfig.icon} {entryConfig.label}</span>
                          <span className="text-xs text-purple-300">· {entry.playerName}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Card Area */}
        {currentChallenge && config && Icon && (
          <div className="flex flex-col items-center">
            {/* Mystery Card */}
            <div
              className="relative w-full max-w-sm aspect-[3/4] mb-6"
              style={{ perspective: '1000px' }}
            >
              <div
                className={`relative w-full h-full transition-transform duration-700`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: cardRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Card Back (mystery) */}
                <div
                  className="absolute inset-0 rounded-2xl border-2 border-purple-500/40 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl flex flex-col items-center justify-center cursor-pointer"
                  style={{ backfaceVisibility: 'hidden' }}
                  onClick={() => setCardRevealed(true)}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/10 to-transparent" />
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                      <Layers className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-purple-200 font-semibold text-lg">Carte mystère</p>
                    <p className="text-purple-300 text-sm mt-1">Touche pour révéler</p>
                  </div>
                  <div className="absolute bottom-3 left-0 right-0 text-center">
                    <p className="text-purple-400/60 text-xs">{remainingInDeck} carte{remainingInDeck > 1 ? 's' : ''} restante{remainingInDeck > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Card Front (revealed challenge) */}
                <div
                  className={`absolute inset-0 rounded-2xl border-2 ${config.border} bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl flex flex-col items-center justify-center p-6`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <p className={`text-xs uppercase tracking-widest font-bold mb-3 ${config.color}`}>
                    {config.icon} {config.label}
                  </p>
                  <p className="text-white text-base sm:text-lg leading-relaxed text-center font-medium">
                    {currentChallenge.text}
                  </p>
                  {currentChallenge.timed && currentChallenge.durationSeconds && (
                    <div className="mt-4 flex items-center gap-1.5 text-sky-300 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Chronométré · {Math.floor(currentChallenge.durationSeconds / 60)}:{(currentChallenge.durationSeconds % 60).toString().padStart(2, '0')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stopwatch (only for timed challenges after reveal) */}
            {cardRevealed && currentChallenge.timed && currentChallenge.durationSeconds && (
              <div className="w-full max-w-sm mb-6">
                <ChallengeStopwatch
                  key={currentChallenge.id}
                  durationSeconds={currentChallenge.durationSeconds}
                  autoStart
                />
              </div>
            )}

            {/* Action Buttons (only after reveal) */}
            {cardRevealed && (
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm animate-slide-up">
                <button
                  onClick={handleReleve}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-600 active:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 mobile-button touch-action-none"
                >
                  <Check className="w-5 h-5" />
                  Relevé !
                </button>
                <button
                  onClick={handleForfait}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-rose-600 active:bg-rose-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 mobile-button touch-action-none"
                >
                  <X className="w-5 h-5" />
                  Forfait
                </button>
              </div>
            )}

            {/* Draw next card button (only after action) */}
            {!cardRevealed && currentChallenge && (
              <p className="text-purple-300 text-sm text-center mt-2">Touchez la carte pour la révéler.</p>
            )}
          </div>
        )}

        {/* Draw next card */}
        {!currentChallenge && phase === 'playing' && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-purple-200 text-lg mb-6 text-center">Préparez-vous pour la prochaine carte !</p>
            <button
              onClick={drawCard}
              className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-lg rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 mobile-button touch-action-none"
            >
              <Layers className="w-6 h-6" />
              Piocher une carte
            </button>
          </div>
        )}

        {/* Footer controls */}
        <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-purple-800">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-3 bg-amber-600 active:bg-amber-700 text-white font-semibold rounded-lg transition-colors mobile-button touch-action-none text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Nouvelle partie
          </button>
        </div>
      </div>
    </div>
  );
};

export default CapOuPasCapGame;
