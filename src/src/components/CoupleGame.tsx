import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeft, Heart, Plus, Trash2, Eye, EyeOff,
  ChevronRight, Sparkles, Lock, CheckCircle
} from 'lucide-react';
import { CoupleGamePhase, FantasyCard, CoupleGameState } from '../types';
import { systemFantasies } from '../data/fantasies';

// ── Constants ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'couple_gameState';
const SYSTEM_PER_USER = 2;

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const periodFriendlyFantasies = [
  'Se faire un massage des épaules et de la nuque avec une musique apaisante',
  'Préparer une boisson chaude et se blottir ensemble sous un plaid',
  'Prendre un bain relaxant ensemble, sans objectif autre que se détendre',
  'Échanger un long câlin et respirer ensemble pendant quelques minutes',
  'Se faire des compliments sincères et raconter son meilleur souvenir à deux',
  'Regarder un film choisi ensemble, avec des caresses et des pauses câlins',
  'Se masser les mains et les pieds à tour de rôle',
  'Organiser une soirée cocooning avec une playlist douce et une lumière tamisée',
  'Écrire chacun trois petites attentions qui feraient plaisir cette semaine',
  'Explorer les caresses et les bisous, en respectant immédiatement chaque limite'
];

function buildDeck(userTexts: string[], periodFriendly: boolean): FantasyCard[] {
  const userCards: FantasyCard[] = userTexts.map((text, i) => ({
    id: `user-${i}-${Date.now()}`,
    text,
    isUserSubmitted: true,
  }));

  const systemPool = periodFriendly
    ? shuffle(periodFriendlyFantasies).map((text, index) => ({ id: index + 1, text }))
    : shuffle(systemFantasies);
  const systemCount = Math.min(Math.max(userCards.length * SYSTEM_PER_USER, 10), systemPool.length);
  const systemCards: FantasyCard[] = systemPool.slice(0, systemCount).map(s => ({
    id: `sys-${s.id}`,
    text: s.text,
    isUserSubmitted: false,
  }));

  const deck: FantasyCard[] = [];
  let sIdx = 0;
  for (const uc of userCards) {
    for (let k = 0; k < SYSTEM_PER_USER && sIdx < systemCards.length; k++, sIdx++) {
      deck.push(systemCards[sIdx]);
    }
    deck.push(uc);
  }
  while (sIdx < systemCards.length) deck.push(systemCards[sIdx++]);

  return shuffle(deck);
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface CoupleGameProps {
  onBack: () => void;
}

// ── Floating hearts for match burst ──────────────────────────────────────────

const HEART_EMOJIS = ['❤️', '💕', '✨', '💫', '🔥', '💖', '💗'];

interface FloatHeart { id: number; emoji: string; x: number; delay: number; size: number }

const FloatingHearts: React.FC = () => {
  const hearts: FloatHeart[] = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    emoji: HEART_EMOJIS[i % HEART_EMOJIS.length],
    x: 5 + (i * 5.5) % 90,
    delay: (i * 0.12) % 1.2,
    size: 18 + (i * 7) % 22,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map(h => (
        <span
          key={h.id}
          className="absolute animate-float-up"
          style={{
            left: `${h.x}%`,
            bottom: '10%',
            fontSize: `${h.size}px`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${1.2 + h.delay}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────

const CoupleGame: React.FC<CoupleGameProps> = ({ onBack }) => {
  const [phase, setPhase] = useState<CoupleGamePhase>('setup');

  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  const [periodFriendly, setPeriodFriendly] = useState(false);

  const [inputTurn, setInputTurn] = useState<1 | 2>(1);
  const [p1Fantasies, setP1Fantasies] = useState<string[]>([]);
  const [p2Fantasies, setP2Fantasies] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string[]>(['']);
  const [showInput, setShowInput] = useState(false);

  const [gameState, setGameState] = useState<CoupleGameState | null>(null);

  const [votePhase, setVotePhase] = useState<'p1' | 'p2' | 'reveal'>('p1');
  const [p1Vote, setP1Vote] = useState<'validate' | 'pass' | null>(null);

  // Card animation: we track the current card key to re-trigger slide-in
  const [cardKey, setCardKey] = useState(0);
  const [cardExiting, setCardExiting] = useState(false);

  const [showMatchAnim, setShowMatchAnim] = useState(false);
  const [matchAnimCard, setMatchAnimCard] = useState<FantasyCard | null>(null);
  const matchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Persist ────────────────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s: CoupleGameState = JSON.parse(raw);
        setGameState(s);
        setP1Name(s.player1Name);
        setP2Name(s.player2Name);
        setPhase('voting');
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const persist = useCallback((s: CoupleGameState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }, []);

  const clearPersist = () => localStorage.removeItem(STORAGE_KEY);

  // ── Setup ──────────────────────────────────────────────────────────────────

  const startSetup = () => {
    if (!p1Name.trim() || !p2Name.trim()) return;
    setInputTurn(1);
    setCurrentInput(['']);
    setShowInput(false);
    setPhase('fantasy-input');
  };

  const addLine = () => setCurrentInput(prev => [...prev, '']);
  const removeLine = (i: number) => {
    if (currentInput.length <= 1) return;
    setCurrentInput(prev => prev.filter((_, idx) => idx !== i));
  };
  const updateLine = (i: number, val: string) =>
    setCurrentInput(prev => prev.map((v, idx) => idx === i ? val : v));

  const confirmPlayerInput = () => {
    const valid = currentInput.map(s => s.trim()).filter(Boolean);
    if (inputTurn === 1) {
      setP1Fantasies(valid);
      setInputTurn(2);
      setCurrentInput(['']);
      setShowInput(false);
    } else {
      setP2Fantasies(valid);
      setPhase('ready');
    }
  };

  const currentPlayerName = inputTurn === 1 ? p1Name.trim() : p2Name.trim();

  // ── Start voting ───────────────────────────────────────────────────────────

  const startVoting = () => {
    const deck = buildDeck([...p1Fantasies, ...p2Fantasies], periodFriendly);
    const state: CoupleGameState = {
      player1Name: p1Name.trim(),
      player2Name: p2Name.trim(),
      deck,
      currentIndex: 0,
      votes: {},
      matches: [],
      inputTurn: 1,
      player1Done: true,
      player2Done: true,
    };
    setGameState(state);
    persist(state);
    setVotePhase('p1');
    setP1Vote(null);
    setCardKey(0);
    setPhase('voting');
  };

  // ── Voting ─────────────────────────────────────────────────────────────────

  const castVote = (vote: 'validate' | 'pass') => {
    if (!gameState) return;
    const card = gameState.deck[gameState.currentIndex];

    if (votePhase === 'p1') {
      setP1Vote(vote);
      setVotePhase('p2');
    } else {
      // p2 voted — resolve
      const bothValidated = p1Vote === 'validate' && vote === 'validate';

      if (bothValidated) {
        const updatedMatches = [...gameState.matches, card];
        const updatedState: CoupleGameState = {
          ...gameState,
          matches: updatedMatches,
          votes: { ...gameState.votes, [card.id]: [1, 2] },
        };
        setGameState(updatedState);
        persist(updatedState);
        setMatchAnimCard(card);
        setShowMatchAnim(true);

        if (matchTimerRef.current) clearTimeout(matchTimerRef.current);
        matchTimerRef.current = setTimeout(() => {
          setShowMatchAnim(false);
          triggerCardTransition(updatedState);
        }, 3400);
      } else {
        setVotePhase('reveal');
      }
    }
  };

  const triggerCardTransition = (state: CoupleGameState) => {
    setCardExiting(true);
    setTimeout(() => {
      setCardExiting(false);
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.deck.length) {
        clearPersist();
        setGameState({ ...state, currentIndex: nextIndex });
        setPhase('results');
        return;
      }
      const updated = { ...state, currentIndex: nextIndex };
      setGameState(updated);
      persist(updated);
      setCardKey(k => k + 1);
      setVotePhase('p1');
      setP1Vote(null);
    }, 240);
  };

  const handleNextCard = () => {
    if (!gameState) return;
    triggerCardTransition(gameState);
  };

  const resetGame = () => {
    clearPersist();
    setPhase('setup');
    setP1Name('');
    setP2Name('');
    setPeriodFriendly(false);
    setP1Fantasies([]);
    setP2Fantasies([]);
    setCurrentInput(['']);
    setShowInput(false);
    setGameState(null);
    setVotePhase('p1');
    setP1Vote(null);
    setShowMatchAnim(false);
    setCardKey(0);
    setCardExiting(false);
  };

  // ── Common header ──────────────────────────────────────────────────────────

  const Header = ({ subtitle }: { subtitle?: string }) => (
    <div className="flex items-center gap-3 px-4 pt-6 pb-4 flex-shrink-0">
      <button
        onClick={phase === 'voting' || phase === 'results' ? resetGame : onBack}
        className="p-2 rounded-xl bg-slate-700/60 text-slate-300 hover:bg-slate-700 transition-colors mobile-button touch-action-none"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-white truncate">Fantasmes sous couverture</h1>
        {subtitle && <p className="text-slate-400 text-xs truncate">{subtitle}</p>}
      </div>
      <Heart className="w-6 h-6 text-rose-400 flex-shrink-0" />
    </div>
  );

  // ── SETUP ──────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 flex flex-col safe-area-inset">
        <Header subtitle="Mode Couple" />
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-rose-900/20 border border-rose-500/30 rounded-2xl p-5 text-center animate-slide-up">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg animate-gentle-float">
                  <Lock className="w-7 h-7 text-white" />
                </div>
              </div>
              <h2 className="text-white font-bold text-lg mb-2">Vos secrets restent secrets</h2>
              <p className="text-rose-200/80 text-sm leading-relaxed">
                Chaque joueur saisit ses fantasmes en privé. L'application les mélange avec ses propres propositions et vous les soumet anonymement, un par un.
              </p>
            </div>

            <button
              onClick={() => setPeriodFriendly(value => !value)}
              className={`w-full p-4 rounded-2xl border text-left transition-colors ${periodFriendly ? 'border-pink-400/60 bg-pink-500/15' : 'border-slate-700/50 bg-slate-800/60'}`}
            >
              <p className="text-white font-semibold text-sm">Pas en forme aujourd'hui ?</p>
              <p className="text-slate-400 text-xs mt-1">Propositions réconfortantes et sans pression, à adapter selon vos envies.</p>
              <p className="text-pink-300 text-xs mt-2 font-semibold">{periodFriendly ? 'Mode douceur activé' : 'Activer le mode douceur'}</p>
            </button>

            <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50 space-y-4">
              <h3 className="text-slate-300 text-sm font-semibold uppercase tracking-widest">Joueurs</h3>
              {[
                { label: 'Joueur 1', val: p1Name, set: setP1Name },
                { label: 'Joueur 2', val: p2Name, set: setP2Name },
              ].map(({ label, val, set }) => (
                <div key={label}>
                  <label className="text-slate-400 text-xs block mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={val}
                    onChange={e => set(e.target.value)}
                    placeholder="Prénom..."
                    maxLength={20}
                    className="w-full bg-slate-700/60 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/60 transition-colors text-sm"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={startSetup}
              disabled={!p1Name.trim() || !p2Name.trim()}
              className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-200 shadow-xl mobile-button touch-action-none ${
                p1Name.trim() && p2Name.trim()
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:opacity-90 active:scale-95'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              Commencer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── FANTASY INPUT ──────────────────────────────────────────────────────────
  if (phase === 'fantasy-input') {
    const isFirstTurn = inputTurn === 1;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 flex flex-col safe-area-inset">
        <Header subtitle={`Saisie secrète — ${currentPlayerName}`} />
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <div className="max-w-md mx-auto space-y-5">
            {!isFirstTurn && (
              <div className="bg-amber-900/30 border border-amber-500/40 rounded-2xl p-4 text-center animate-slide-up">
                <p className="text-amber-200 text-sm font-medium">Passez l'appareil à <span className="font-bold text-white">{p2Name}</span></p>
                <p className="text-amber-300/70 text-xs mt-1">{p1Name} a terminé. La saisie est privée.</p>
              </div>
            )}

            <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">{currentPlayerName}, vos fantasmes</h3>
                  <p className="text-slate-400 text-xs mt-0.5">L'autre joueur ne verra pas vos saisies</p>
                </div>
                <button onClick={() => setShowInput(v => !v)} className="p-2 rounded-xl bg-slate-700 text-slate-400 mobile-button touch-action-none">
                  {showInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-2.5">
                {currentInput.map((val, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type={showInput ? 'text' : 'password'}
                      value={val}
                      onChange={e => updateLine(i, e.target.value)}
                      placeholder={`Fantasme ${i + 1}…`}
                      className="flex-1 bg-slate-700/60 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/60 transition-colors text-sm"
                      autoComplete="off"
                    />
                    {currentInput.length > 1 && (
                      <button onClick={() => removeLine(i)} className="p-2.5 rounded-xl bg-rose-900/40 text-rose-400 hover:bg-rose-900/60 transition-colors mobile-button touch-action-none">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {currentInput.length < 8 && (
                <button onClick={addLine} className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors text-sm mobile-button touch-action-none">
                  <Plus className="w-4 h-4" /> Ajouter un fantasme
                </button>
              )}
            </div>

            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
              <p className="text-slate-400 text-xs leading-relaxed text-center">
                Vous pouvez ne rien saisir — l'application a déjà plein de propositions.
              </p>
            </div>

            <button
              onClick={confirmPlayerInput}
              className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:opacity-90 active:scale-95 transition-all duration-200 shadow-xl mobile-button touch-action-none flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              {isFirstTurn ? `Valider et passer à ${p2Name}` : 'Commencer le jeu'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── READY ──────────────────────────────────────────────────────────────────
  if (phase === 'ready') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 flex flex-col safe-area-inset">
        <Header />
        <div className="flex-1 flex flex-col justify-center px-4 pb-8">
          <div className="max-w-md mx-auto w-full space-y-6 text-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-2xl animate-gentle-float">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Tout est prêt !</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Vos fantasmes ont été mélangés anonymement avec les propositions de l'application.
              </p>
            </div>
            <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50 text-left space-y-3">
              {[
                { icon: '🔒', text: 'Les votes sont anonymes — l\'autre ne sait pas ce que vous avez saisi.' },
                { icon: '💡', text: 'Chaque joueur vote séparément sur chaque carte, à tour de rôle.' },
                { icon: '❤️', text: 'Si vous validez tous les deux → Match animé !' },
                { icon: '➡️', text: 'Si un seul valide → on passe sans révéler les votes.' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0 leading-tight mt-0.5">{icon}</span>
                  <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <button
              onClick={startVoting}
              className="w-full py-5 rounded-2xl font-bold text-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:opacity-90 active:scale-95 transition-all duration-200 shadow-xl mobile-button touch-action-none flex items-center justify-center gap-3"
            >
              <Heart className="w-6 h-6" /> Lancer les votes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── VOTING ─────────────────────────────────────────────────────────────────
  if (phase === 'voting' && gameState) {
    const card = gameState.deck[gameState.currentIndex];
    if (!card) { setPhase('results'); return null; }

    const progress = gameState.currentIndex / gameState.deck.length;
    const matchCount = gameState.matches.length;
    const activeVoterName = votePhase === 'p1' ? gameState.player1Name : gameState.player2Name;

    // Match overlay
    const MatchOverlay = () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
        <div className="relative w-full h-full flex items-center justify-center">
          <FloatingHearts />
          <div className="relative z-10 bg-gradient-to-br from-rose-600 to-pink-700 rounded-3xl p-8 shadow-2xl border border-rose-400/40 max-w-sm mx-4 animate-match-burst text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-4xl font-black text-white mb-2">Match !</h2>
            <p className="text-rose-100 text-sm mb-5 leading-relaxed font-medium">
              Vous avez tous les deux validé cette proposition !
            </p>
            <div className="bg-white/15 rounded-2xl p-4">
              <p className="text-white text-base font-medium leading-relaxed italic">"{matchAnimCard?.text}"</p>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 flex flex-col safe-area-inset">
        {showMatchAnim && <MatchOverlay />}

        <Header subtitle={`${matchCount} match${matchCount !== 1 ? 's' : ''} · Carte ${gameState.currentIndex + 1}/${gameState.deck.length}`} />

        {/* Progress bar */}
        <div className="px-4 mb-2">
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 pb-6">
          <div className="max-w-md mx-auto w-full space-y-5">

            {/* Fantasy card — re-animated on each new card */}
            <div
              key={cardKey}
              className={`bg-slate-800/80 rounded-2xl p-7 border border-slate-600/50 shadow-2xl min-h-[160px] flex flex-col justify-center ${
                cardExiting ? 'animate-card-out' : 'animate-card-in'
              }`}
            >
              <p className="text-white text-lg sm:text-xl leading-relaxed font-medium text-center">
                {card.text}
              </p>
            </div>

            {/* Voting UI */}
            {votePhase !== 'reveal' ? (
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50 space-y-4">
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Au tour de</p>
                  <p className="text-white font-bold text-xl">{activeVoterName}</p>
                  <p className="text-slate-500 text-xs mt-0.5">Votez sans montrer votre écran</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => castVote('validate')}
                    className="flex flex-col items-center gap-2.5 py-6 rounded-2xl bg-gradient-to-b from-rose-600 to-pink-700 text-white font-bold shadow-lg mobile-button touch-action-none hover:opacity-90 active:scale-95 transition-all"
                  >
                    <Heart className="w-8 h-8" />
                    <span className="text-base">Valider</span>
                  </button>
                  <button
                    onClick={() => castVote('pass')}
                    className="flex flex-col items-center gap-2.5 py-6 rounded-2xl bg-slate-700 text-slate-300 font-semibold shadow-lg mobile-button touch-action-none hover:bg-slate-600 active:scale-95 transition-all"
                  >
                    <ChevronRight className="w-8 h-8" />
                    <span className="text-base">Passer</span>
                  </button>
                </div>
                {/* Anonymous vote progress dots — dot 1 = p1 voted, dot 2 = p2 pending */}
                <div className="flex justify-center gap-3 pt-1">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${votePhase !== 'p1' ? 'bg-rose-400 scale-125' : 'bg-slate-600'}`} />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50 text-center space-y-4 animate-slide-up">
                <p className="text-slate-400 text-sm">Les deux votes sont enregistrés.</p>
                <p className="text-slate-500 text-xs">Les résultats individuels restent secrets jusqu'à un match mutuel.</p>
                <button
                  onClick={handleNextCard}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold flex items-center justify-center gap-2 mobile-button touch-action-none hover:from-slate-500 hover:to-slate-600 transition-all"
                >
                  <ChevronRight className="w-5 h-5" /> Carte suivante
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  if (phase === 'results' && gameState) {
    const matches = gameState.matches;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 flex flex-col safe-area-inset">
        <Header subtitle="Fin de partie" />
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center pt-4 animate-slide-up">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 shadow-2xl mb-4">
                <span className="text-4xl font-black text-white">{matches.length}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {matches.length === 0 ? 'Aucun match cette fois…' : matches.length === 1 ? '1 match trouvé !' : `${matches.length} matchs trouvés !`}
              </h2>
              <p className="text-slate-400 text-sm">{gameState.player1Name} &amp; {gameState.player2Name}</p>
            </div>

            {matches.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-slate-300 text-sm font-semibold uppercase tracking-widest">Vos fantasmes communs</h3>
                {matches.map((m, i) => (
                  <div key={m.id} className="bg-rose-900/20 rounded-2xl p-4 border border-rose-500/30 flex gap-3 animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-sm font-bold text-white">{i + 1}</div>
                    <p className="text-white text-sm leading-relaxed flex-1">{m.text}</p>
                  </div>
                ))}
              </div>
            )}

            {matches.length === 0 && (
              <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/50 text-center">
                <p className="text-slate-300 text-sm leading-relaxed">
                  Pas de match ce soir — mais la conversation est lancée ! Parlez de vos envies ouvertement.
                </p>
              </div>
            )}

            <button
              onClick={resetGame}
              className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:opacity-90 active:scale-95 transition-all shadow-xl mobile-button touch-action-none flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" /> Rejouer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CoupleGame;
