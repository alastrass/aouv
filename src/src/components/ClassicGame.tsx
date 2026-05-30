import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeft, Plus, Flame, Zap, Snowflake, Star,
  ThumbsUp, ThumbsDown, Send, RotateCcw, Trophy, Lock, Crown
} from 'lucide-react';
import {
  ClassicPlayer, ClassicChallenge, ClassicDifficulty,
  ClassicGamePhase, PendingSubmission
} from '../types';
import { classicChallenges } from '../data/classicChallenges';

// ── Constants ─────────────────────────────────────────────────────────────────

const AVATARS = ['😊', '😎', '🥰', '😈', '🦊', '🐱', '🌹', '🔥', '💎', '👑', '🌙', '⚡'];
const PREMIUM_KEY = 'hasLifetimeAccess';

const DIFFICULTY_CONFIG: Record<ClassicDifficulty, {
  label: string;
  color: string;
  border: string;
  badgeBg: string;
  icon: React.ElementType;
  locked: boolean;
  lockLabel: string;
}> = {
  soft:    { label: 'Soft',    color: 'from-sky-500 to-blue-600',     border: 'border-sky-500/40',    badgeBg: 'bg-sky-500/20 text-sky-300',       icon: Snowflake, locked: false, lockLabel: '' },
  hot:     { label: 'Hot',     color: 'from-amber-500 to-orange-600', border: 'border-amber-500/40',  badgeBg: 'bg-amber-500/20 text-amber-300',   icon: Flame,     locked: false, lockLabel: '' },
  hard:    { label: 'Hard',    color: 'from-rose-500 to-red-600',     border: 'border-rose-500/40',   badgeBg: 'bg-rose-500/20 text-rose-300',     icon: Zap,       locked: true,  lockLabel: 'Premium' },
  extreme: { label: 'Extrême', color: 'from-fuchsia-600 to-pink-700', border: 'border-fuchsia-500/40',badgeBg: 'bg-fuchsia-500/20 text-fuchsia-300',icon: Star,     locked: true,  lockLabel: 'Premium' },
};

const STORAGE_KEY = 'classic_gameState';

interface PersistedState {
  players: ClassicPlayer[];
  difficulty: ClassicDifficulty;
  activeIndex: number;
  usedIds: number[];
  turnCount: number;
  customPool: ClassicChallenge[];
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface ClassicGameProps {
  onBack: () => void;
  onOpenStore?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const ClassicGame: React.FC<ClassicGameProps> = ({ onBack, onOpenStore }) => {
  const [phase, setPhase] = useState<ClassicGamePhase>('setup');
  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);
  const [playerAvatars, setPlayerAvatars] = useState<string[]>([AVATARS[0], AVATARS[1]]);
  const [difficulty, setDifficulty] = useState<ClassicDifficulty>('soft');
  const [isPremium, setIsPremium] = useState(false);
  const [shakeDiff, setShakeDiff] = useState<ClassicDifficulty | null>(null);

  const [players, setPlayers] = useState<ClassicPlayer[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [usedIds, setUsedIds] = useState<number[]>([]);
  const [turnCount, setTurnCount] = useState(0);
  const [customPool, setCustomPool] = useState<ClassicChallenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<ClassicChallenge | null>(null);
  const [choiceType, setChoiceType] = useState<'truth' | 'dare' | null>(null);
  const [challengeKey, setChallengeKey] = useState(0); // bump to re-trigger animation

  const [showSubmitPanel, setShowSubmitPanel] = useState(false);
  const [submitText, setSubmitText] = useState('');
  const [submitType, setSubmitType] = useState<'truth' | 'dare'>('dare');
  const [pendingSubmission, setPendingSubmission] = useState<PendingSubmission | null>(null);
  const [voteIndex, setVoteIndex] = useState(0);

  const [showScores, setShowScores] = useState(false);
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check premium status
  useEffect(() => {
    setIsPremium(localStorage.getItem(PREMIUM_KEY) === 'true');
  }, []);

  // Restore persisted game
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s: PersistedState = JSON.parse(raw);
        setPlayers(s.players);
        setDifficulty(s.difficulty);
        setActiveIndex(s.activeIndex);
        setUsedIds(s.usedIds);
        setTurnCount(s.turnCount);
        setCustomPool(s.customPool ?? []);
        setPhase('pick');
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const persist = useCallback((
    p: ClassicPlayer[], d: ClassicDifficulty, ai: number,
    uid: number[], tc: number, cp: ClassicChallenge[]
  ) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(
      { players: p, difficulty: d, activeIndex: ai, usedIds: uid, turnCount: tc, customPool: cp }
    ));
  }, []);

  // ── Difficulty selection with lock guard ────────────────────────────────────
  const handleDifficultyClick = (d: ClassicDifficulty) => {
    const cfg = DIFFICULTY_CONFIG[d];
    if (cfg.locked && !isPremium) {
      setShakeDiff(d);
      if (shakeTimer.current) clearTimeout(shakeTimer.current);
      shakeTimer.current = setTimeout(() => setShakeDiff(null), 500);
      return;
    }
    setDifficulty(d);
  };

  // ── Setup ──────────────────────────────────────────────────────────────────
  const addPlayer = () => {
    if (playerNames.length >= 8) return;
    setPlayerNames(prev => [...prev, '']);
    setPlayerAvatars(prev => [...prev, AVATARS[prev.length % AVATARS.length]]);
  };

  const removePlayer = (i: number) => {
    if (playerNames.length <= 2) return;
    setPlayerNames(prev => prev.filter((_, idx) => idx !== i));
    setPlayerAvatars(prev => prev.filter((_, idx) => idx !== i));
  };

  const startGame = () => {
    const validNames = playerNames.map(n => n.trim()).filter(Boolean);
    if (validNames.length < 2) return;
    const cfg = DIFFICULTY_CONFIG[difficulty];
    if (cfg.locked && !isPremium) return;
    const newPlayers: ClassicPlayer[] = validNames.map((name, i) => ({
      id: i + 1, name, avatar: playerAvatars[i], score: 0,
    }));
    setPlayers(newPlayers);
    setActiveIndex(0);
    setUsedIds([]);
    setTurnCount(0);
    setCustomPool([]);
    setCurrentChallenge(null);
    setChoiceType(null);
    persist(newPlayers, difficulty, 0, [], 0, []);
    setPhase('pick');
  };

  // ── Challenge logic ────────────────────────────────────────────────────────
  const getPool = (type: 'truth' | 'dare'): ClassicChallenge[] => {
    const base = classicChallenges[difficulty].filter(c => c.type === type);
    const custom = turnCount >= 2
      ? customPool.filter(c => c.type === type && c.difficulty === difficulty)
      : [];
    return [...base, ...custom].filter(c => !usedIds.includes(c.id));
  };

  const pickChallenge = (type: 'truth' | 'dare') => {
    setChoiceType(type);
    let pool = getPool(type);
    if (pool.length === 0) {
      const baseIds = classicChallenges[difficulty].filter(c => c.type === type).map(c => c.id);
      setUsedIds(prev => prev.filter(id => !baseIds.includes(id)));
      pool = classicChallenges[difficulty].filter(c => c.type === type);
    }
    const challenge = pickRandom(pool);
    setCurrentChallenge(challenge);
    setUsedIds(prev => [...prev, challenge.id]);
    setChallengeKey(k => k + 1);
    setPhase('challenge');
  };

  const nextTurn = (scored: boolean) => {
    const next = players.map((p, i) =>
      i === activeIndex && scored ? { ...p, score: p.score + 1 } : p
    );
    const nextIndex = (activeIndex + 1) % players.length;
    const nextTurnCount = turnCount + 1;
    setPlayers(next);
    setActiveIndex(nextIndex);
    setTurnCount(nextTurnCount);
    setCurrentChallenge(null);
    setChoiceType(null);
    persist(next, difficulty, nextIndex, usedIds, nextTurnCount, customPool);
    setPhase('pick');
  };

  // ── Submission ─────────────────────────────────────────────────────────────
  const openSubmit = () => {
    setSubmitText('');
    setSubmitType('dare');
    setShowSubmitPanel(true);
  };

  const submitChallenge = () => {
    const text = submitText.trim();
    if (!text) return;
    const challenge: ClassicChallenge = {
      id: Date.now() + Math.random(),
      type: submitType,
      difficulty,
      text,
      isCustom: true,
      submittedBy: players[activeIndex]?.id,
    };
    setPendingSubmission({ challenge, submittedByPlayerId: players[activeIndex]?.id ?? 0, votes: {} });
    setVoteIndex(0);
    setShowSubmitPanel(false);
    setPhase('vote');
  };

  const voters = pendingSubmission
    ? players.filter(p => p.id !== pendingSubmission.submittedByPlayerId)
    : [];

  const castVote = (vote: 'approve' | 'reject') => {
    if (!pendingSubmission) return;
    const voter = voters[voteIndex];
    const updatedVotes = { ...pendingSubmission.votes, [voter.id]: vote };
    const updated = { ...pendingSubmission, votes: updatedVotes };
    setPendingSubmission(updated);

    const nextVoteIndex = voteIndex + 1;
    if (nextVoteIndex >= voters.length) {
      const approvals = Object.values(updatedVotes).filter(v => v === 'approve').length;
      if (approvals >= Math.ceil(voters.length / 2)) {
        const approved = updated.challenge;
        const newPool = [...customPool, approved];
        setCustomPool(newPool);
        setCurrentChallenge(approved);
        setUsedIds(prev => [...prev, approved.id]);
        setChallengeKey(k => k + 1);
        persist(players, difficulty, activeIndex, [...usedIds, approved.id], turnCount, newPool);
        setPendingSubmission(null);
        setPhase('challenge');
      } else {
        setPendingSubmission(null);
        setPhase(currentChallenge ? 'challenge' : 'pick');
      }
    } else {
      setVoteIndex(nextVoteIndex);
    }
  };

  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPhase('setup');
    setPlayers([]);
    setPlayerNames(['', '']);
    setPlayerAvatars([AVATARS[0], AVATARS[1]]);
    setCurrentChallenge(null);
    setChoiceType(null);
    setPendingSubmission(null);
    setShowSubmitPanel(false);
    setUsedIds([]);
    setTurnCount(0);
    setCustomPool([]);
    setShowScores(false);
  };

  const cfg = DIFFICULTY_CONFIG[difficulty];
  const DiffIcon = cfg.icon;
  const activePl = players[activeIndex];

  // ── Sub-components ─────────────────────────────────────────────────────────

  const ScoreOverlay = () => (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-4">
      <div className="w-full max-w-lg bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Scores
          </h2>
          <button onClick={() => setShowScores(false)} className="p-2 rounded-xl bg-slate-700 text-slate-300 mobile-button touch-action-none">✕</button>
        </div>
        <div className="space-y-3">
          {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 bg-slate-700/50 rounded-xl p-3">
              <span className="text-slate-400 text-sm w-4">{i + 1}</span>
              <span className="text-2xl">{p.avatar}</span>
              <span className="flex-1 text-white font-medium">{p.name}</span>
              <span className={`font-bold text-lg ${i === 0 ? 'text-amber-400' : 'text-slate-300'}`}>{p.score} pts</span>
            </div>
          ))}
        </div>
        <button onClick={resetGame} className="mt-5 w-full py-3 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 mobile-button touch-action-none">
          <RotateCcw className="w-4 h-4" /> Nouvelle partie
        </button>
      </div>
    </div>
  );

  const SubmitPanel = () => (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-4">
      <div className="w-full max-w-lg bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Soumettre un défi</h2>
          <button onClick={() => setShowSubmitPanel(false)} className="p-2 rounded-xl bg-slate-700 text-slate-300 mobile-button touch-action-none">✕</button>
        </div>
        <p className="text-slate-400 text-sm mb-4 leading-relaxed">
          Proposez un défi personnalisé. Les autres joueurs voteront pour l'accepter ou le refuser.
        </p>
        <div className="flex gap-2 mb-4">
          {(['truth', 'dare'] as const).map(t => (
            <button key={t} onClick={() => setSubmitType(t)}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all mobile-button touch-action-none ${
                submitType === t
                  ? t === 'truth' ? 'bg-sky-600 text-white' : 'bg-rose-600 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {t === 'truth' ? '🧠 Vérité' : '⚡ Action'}
            </button>
          ))}
        </div>
        <textarea
          value={submitText}
          onChange={e => setSubmitText(e.target.value)}
          placeholder="Écrivez votre défi ici..."
          rows={3}
          className="w-full bg-slate-700/60 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-slate-400 resize-none text-sm mb-4"
        />
        <button onClick={submitChallenge} disabled={!submitText.trim()}
          className={`w-full py-4 rounded-xl font-bold transition-all mobile-button touch-action-none flex items-center justify-center gap-2 ${
            submitText.trim()
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-90'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" /> Soumettre au vote
        </button>
      </div>
    </div>
  );

  // ── SETUP ──────────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col safe-area-inset">
        <div className="flex items-center gap-3 px-4 pt-6 pb-4">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-700/60 text-slate-300 hover:bg-slate-700 transition-colors mobile-button touch-action-none">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Mode Classique</h1>
            <p className="text-slate-400 text-xs">Configuration de la partie</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <div className="max-w-lg mx-auto space-y-6">

            {/* Difficulty selector */}
            <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">Niveau de piment</h2>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(DIFFICULTY_CONFIG) as ClassicDifficulty[]).map(d => {
                  const c = DIFFICULTY_CONFIG[d];
                  const Icon = c.icon;
                  const active = difficulty === d;
                  const isLocked = c.locked && !isPremium;

                  return (
                    <button
                      key={d}
                      onClick={() => handleDifficultyClick(d)}
                      className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 mobile-button touch-action-none overflow-hidden ${
                        shakeDiff === d ? 'animate-shake' : ''
                      } ${
                        active && !isLocked
                          ? `bg-gradient-to-r ${c.color} border-transparent text-white shadow-lg`
                          : isLocked
                          ? 'bg-slate-700/30 border-slate-600/40 text-slate-500 cursor-pointer'
                          : `bg-slate-700/40 ${c.border} text-slate-300 hover:bg-slate-700/60`
                      }`}
                    >
                      {/* Shimmer on locked */}
                      {isLocked && <div className="absolute inset-0 shimmer-locked pointer-events-none" />}

                      <Icon className={`w-5 h-5 flex-shrink-0 ${isLocked ? 'opacity-40' : ''}`} />
                      <span className={`font-semibold text-sm flex-1 text-left ${isLocked ? 'opacity-40' : ''}`}>{c.label}</span>

                      {isLocked && (
                        <span className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {!isLocked && c.locked && isPremium && (
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Premium upsell callout — shown when a locked level is tried */}
              {(DIFFICULTY_CONFIG.hard.locked || DIFFICULTY_CONFIG.extreme.locked) && !isPremium && (
                <div className="mt-4 bg-amber-900/20 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
                  <Crown className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-300 text-xs font-semibold">Hard &amp; Extrême réservés Premium</p>
                    <p className="text-amber-400/70 text-xs">Débloquez tous les niveaux dès 2,99 €/sem.</p>
                  </div>
                  {onOpenStore && (
                    <button
                      onClick={onOpenStore}
                      className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-900 text-xs font-bold hover:bg-amber-400 transition-colors mobile-button touch-action-none"
                    >
                      Voir
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Players */}
            <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">Joueurs</h2>
              <div className="space-y-3">
                {playerNames.map((name, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <button
                      className="w-12 h-12 rounded-xl bg-slate-700 text-2xl flex items-center justify-center border-2 border-slate-600 hover:border-slate-400 transition-colors mobile-button touch-action-none"
                      onClick={() => {
                        const next = (AVATARS.indexOf(playerAvatars[i]) + 1) % AVATARS.length;
                        setPlayerAvatars(prev => prev.map((a, idx) => idx === i ? AVATARS[next] : a));
                      }}
                    >
                      {playerAvatars[i]}
                    </button>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setPlayerNames(prev => prev.map((n, idx) => idx === i ? e.target.value : n))}
                      placeholder={`Joueur ${i + 1}`}
                      maxLength={20}
                      className="flex-1 bg-slate-700/60 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-slate-400 transition-colors text-sm"
                    />
                    {playerNames.length > 2 && (
                      <button onClick={() => removePlayer(i)} className="p-2 rounded-xl bg-rose-900/40 text-rose-400 hover:bg-rose-900/60 transition-colors mobile-button touch-action-none">✕</button>
                    )}
                  </div>
                ))}
              </div>
              {playerNames.length < 8 && (
                <button onClick={addPlayer} className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-300 transition-colors mobile-button touch-action-none">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Ajouter un joueur</span>
                </button>
              )}
            </div>

            <button
              onClick={startGame}
              disabled={playerNames.filter(n => n.trim()).length < 2}
              className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-200 shadow-xl mobile-button touch-action-none ${
                playerNames.filter(n => n.trim()).length >= 2
                  ? `bg-gradient-to-r ${cfg.color} text-white hover:opacity-90 active:scale-95`
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              Lancer la partie
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── VOTE PHASE ─────────────────────────────────────────────────────────────
  if (phase === 'vote' && pendingSubmission) {
    const voter = voters[voteIndex];
    const submitter = players.find(p => p.id === pendingSubmission.submittedByPlayerId);
    const approvals = Object.values(pendingSubmission.votes).filter(v => v === 'approve').length;
    const rejections = Object.values(pendingSubmission.votes).filter(v => v === 'reject').length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col safe-area-inset">
        {showScores && <ScoreOverlay />}
        <div className="flex items-center gap-3 px-4 pt-6 pb-4">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-700/60 text-slate-300 mobile-button touch-action-none"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="flex-1 text-lg font-bold text-white">Vote en cours</h1>
          <button onClick={() => setShowScores(true)} className="p-2 rounded-xl bg-slate-700/60 text-slate-300 mobile-button touch-action-none"><Trophy className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 pb-8">
          <div className="max-w-lg mx-auto w-full space-y-6">
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                <span className="text-xl mr-2">{submitter?.avatar}</span>
                <span className="text-white font-semibold">{submitter?.name}</span> a soumis un défi
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-600/50 shadow-xl animate-challenge-pop">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${pendingSubmission.challenge.type === 'truth' ? 'bg-sky-500/20 text-sky-300' : 'bg-rose-500/20 text-rose-300'}`}>
                {pendingSubmission.challenge.type === 'truth' ? '🧠 Vérité' : '⚡ Action'}
              </span>
              <p className="mt-3 text-white text-lg leading-relaxed font-medium">{pendingSubmission.challenge.text}</p>
            </div>

            {Object.keys(pendingSubmission.votes).length > 0 && (
              <div className="flex justify-center gap-6 text-sm">
                <span className="text-emerald-400 font-semibold">✓ {approvals} pour</span>
                <span className="text-rose-400 font-semibold">✗ {rejections} contre</span>
              </div>
            )}

            {voter && (
              <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/50">
                <p className="text-center text-slate-400 text-sm mb-1">Au tour de</p>
                <p className="text-center text-2xl font-bold text-white mb-5">{voter.avatar} {voter.name}</p>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => castVote('approve')} className="flex flex-col items-center gap-2 py-5 rounded-2xl bg-gradient-to-b from-emerald-600 to-emerald-700 text-white font-bold shadow-lg mobile-button touch-action-none hover:opacity-90 active:scale-95 transition-all">
                    <ThumbsUp className="w-7 h-7" />
                    <span>Approuver</span>
                  </button>
                  <button onClick={() => castVote('reject')} className="flex flex-col items-center gap-2 py-5 rounded-2xl bg-gradient-to-b from-rose-600 to-rose-700 text-white font-bold shadow-lg mobile-button touch-action-none hover:opacity-90 active:scale-95 transition-all">
                    <ThumbsDown className="w-7 h-7" />
                    <span>Refuser</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── PICK PHASE ─────────────────────────────────────────────────────────────
  if (phase === 'pick' && activePl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col safe-area-inset">
        {showScores && <ScoreOverlay />}
        {showSubmitPanel && <SubmitPanel />}

        <div className="flex items-center gap-3 px-4 pt-6 pb-4">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-700/60 text-slate-300 mobile-button touch-action-none"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex-1">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.badgeBg}`}>
              <DiffIcon className="w-3 h-3" />{cfg.label}
            </div>
          </div>
          <button onClick={() => setShowScores(true)} className="p-2 rounded-xl bg-slate-700/60 text-slate-300 mobile-button touch-action-none"><Trophy className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 pb-8">
          <div className="max-w-lg mx-auto w-full space-y-8">
            {/* Active player — animate on each new turn */}
            <div className="text-center animate-slide-up" key={activeIndex}>
              <div className="w-24 h-24 mx-auto rounded-full bg-slate-700 text-5xl flex items-center justify-center mb-4 border-4 border-slate-600 shadow-xl">
                {activePl.avatar}
              </div>
              <p className="text-slate-400 text-sm">C'est le tour de</p>
              <h2 className="text-3xl font-bold text-white">{activePl.name}</h2>
              <p className="text-slate-500 text-xs mt-1">Tour {turnCount + 1}</p>
            </div>

            <p className="text-center text-slate-300 font-medium">Que choisis-tu ?</p>
            <div className="grid grid-cols-2 gap-5">
              <button onClick={() => pickChallenge('truth')}
                className="flex flex-col items-center justify-center gap-3 py-10 rounded-2xl bg-gradient-to-b from-sky-600 to-blue-700 text-white font-bold shadow-xl hover:opacity-90 active:scale-95 transition-all mobile-button touch-action-none"
              >
                <span className="text-4xl">🧠</span>
                <span className="text-xl">Vérité</span>
              </button>
              <button onClick={() => pickChallenge('dare')}
                className="flex flex-col items-center justify-center gap-3 py-10 rounded-2xl bg-gradient-to-b from-rose-600 to-red-700 text-white font-bold shadow-xl hover:opacity-90 active:scale-95 transition-all mobile-button touch-action-none"
              >
                <span className="text-4xl">⚡</span>
                <span className="text-xl">Action</span>
              </button>
            </div>

            <button onClick={openSubmit} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors text-sm mobile-button touch-action-none">
              <Plus className="w-4 h-4" />
              Soumettre un défi personnalisé
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── CHALLENGE PHASE ────────────────────────────────────────────────────────
  if (phase === 'challenge' && currentChallenge && activePl) {
    const typeColor = choiceType === 'truth' ? 'from-sky-600 to-blue-700' : 'from-rose-600 to-red-700';
    const typeLabel = choiceType === 'truth' ? '🧠 Vérité' : '⚡ Action';

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col safe-area-inset">
        {showScores && <ScoreOverlay />}
        {showSubmitPanel && <SubmitPanel />}

        <div className="flex items-center gap-3 px-4 pt-6 pb-4">
          <button onClick={() => setPhase('pick')} className="p-2 rounded-xl bg-slate-700/60 text-slate-300 mobile-button touch-action-none"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex-1">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.badgeBg}`}>
              <DiffIcon className="w-3 h-3" />{cfg.label}
            </div>
          </div>
          <button onClick={() => setShowScores(true)} className="p-2 rounded-xl bg-slate-700/60 text-slate-300 mobile-button touch-action-none"><Trophy className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 pb-8">
          <div className="max-w-lg mx-auto w-full space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-700 text-3xl flex items-center justify-center border-2 border-slate-600">
                {activePl.avatar}
              </div>
              <div>
                <p className="text-slate-400 text-xs">Défi pour</p>
                <p className="text-white font-bold text-lg">{activePl.name}</p>
              </div>
              <div className="ml-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${typeColor} text-white`}>{typeLabel}</span>
              </div>
            </div>

            {/* Animated challenge card — key changes on each new challenge */}
            <div key={challengeKey} className={`bg-slate-800/80 rounded-2xl p-8 border-2 ${cfg.border} shadow-2xl animate-challenge-pop`}>
              {currentChallenge.isCustom && (
                <p className="text-xs text-slate-500 mb-3 font-medium">✨ Défi personnalisé</p>
              )}
              <p className="text-white text-xl sm:text-2xl leading-relaxed font-medium text-center">
                {currentChallenge.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => nextTurn(true)} className="flex flex-col items-center gap-2 py-5 rounded-2xl bg-gradient-to-b from-emerald-600 to-emerald-700 text-white font-bold shadow-lg mobile-button touch-action-none hover:opacity-90 active:scale-95 transition-all">
                <span className="text-2xl">✓</span>
                <span>Relevé !</span>
                <span className="text-xs opacity-75">+1 point</span>
              </button>
              <button onClick={() => nextTurn(false)} className="flex flex-col items-center gap-2 py-5 rounded-2xl bg-gradient-to-b from-slate-600 to-slate-700 text-white font-semibold shadow-lg mobile-button touch-action-none hover:opacity-90 active:scale-95 transition-all">
                <span className="text-2xl">✕</span>
                <span>Passé</span>
                <span className="text-xs opacity-75">0 point</span>
              </button>
            </div>

            <button onClick={openSubmit} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors text-sm mobile-button touch-action-none">
              <Plus className="w-4 h-4" /> Soumettre un défi à la place
            </button>
          </div>
        </div>

        {/* Score strip */}
        <div className="px-4 pb-4">
          <div className="flex justify-around bg-slate-800/60 rounded-2xl py-3 px-2 border border-slate-700/50">
            {players.map((p, i) => (
              <div key={p.id} className={`flex flex-col items-center gap-1 transition-opacity ${i === activeIndex ? 'opacity-100' : 'opacity-40'}`}>
                <span className="text-lg">{p.avatar}</span>
                <span className="text-white text-xs font-semibold">{p.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white mb-4">Erreur inattendue</p>
        <button onClick={resetGame} className="px-6 py-3 bg-slate-700 text-white rounded-xl mobile-button touch-action-none">
          <RotateCcw className="w-5 h-5 inline mr-2" /> Recommencer
        </button>
      </div>
    </div>
  );
};

export default ClassicGame;
