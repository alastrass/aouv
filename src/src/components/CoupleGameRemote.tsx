import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeft, Heart, Plus, Trash2, Eye, EyeOff,
  ChevronRight, Sparkles, Lock, CheckCircle, Wifi, Copy, Check, Users, Clock, Play, Home
} from 'lucide-react';
import { FantasyCard } from '../types';
import { supabase } from '../lib/supabase';
import { buildDeck, generateSessionCode, generatePlayerId } from '../utils/coupleDeck';

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

// ── Types ────────────────────────────────────────────────────────────────────

interface CoupleSession {
  id: string;
  code: string;
  host_id: string;
  host_name: string;
  host_fantasies: string[];
  host_done: boolean;
  host_vote: string | null;
  guest_id: string | null;
  guest_name: string | null;
  guest_fantasies: string[];
  guest_done: boolean;
  guest_vote: string | null;
  period_friendly: boolean;
  deck: FantasyCard[];
  current_index: number;
  matches: FantasyCard[];
  phase: string;
  vote_phase: string;
}

interface CoupleGameRemoteProps {
  onBack: () => void;
}

// ── Component ────────────────────────────────────────────────────────────────

const CoupleGameRemote: React.FC<CoupleGameRemoteProps> = ({ onBack }) => {
  const [mode, setMode] = useState<'choose' | 'create' | 'join' | 'session'>('choose');
  const [playerName, setPlayerName] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [playerId] = useState(() => generatePlayerId());
  const [isHost, setIsHost] = useState(false);
  const [session, setSession] = useState<CoupleSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fantasy input
  const [myFantasies, setMyFantasies] = useState<string[]>(['']);
  const [showInput, setShowInput] = useState(false);
  const [periodFriendly, setPeriodFriendly] = useState(false);

  // Voting
  const [cardKey, setCardKey] = useState(0);
  const [cardExiting, setCardExiting] = useState(false);
  const [showMatchAnim, setShowMatchAnim] = useState(false);
  const [matchAnimCard, setMatchAnimCard] = useState<FantasyCard | null>(null);
  const matchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Realtime subscription ──────────────────────────────────────────────────

  useEffect(() => {
    if (!sessionCode) return;

    const channel = supabase
      .channel(`couple_session_${sessionCode}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'couple_sessions', filter: `code=eq.${sessionCode}` },
        (payload) => {
          if (payload.new) {
            const s = payload.new as CoupleSession;
            setSession(s);

            // Check for match animation
            if (s.vote_phase === 'reveal' && s.host_vote === 'validate' && s.guest_vote === 'validate') {
              const card = s.deck[s.current_index];
              if (card && !showMatchAnim) {
                setMatchAnimCard(card);
                setShowMatchAnim(true);
                if (matchTimerRef.current) clearTimeout(matchTimerRef.current);
                matchTimerRef.current = setTimeout(() => {
                  setShowMatchAnim(false);
                }, 3400);
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionCode, showMatchAnim]);

  // ── Create session ──────────────────────────────────────────────────────────

  const handleCreate = async () => {
    if (!playerName.trim()) return;
    setError(null);

    let code = generateSessionCode();
    // Ensure unique code
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from('couple_sessions')
        .select('code')
        .eq('code', code)
        .maybeSingle();
      if (!existing) break;
      code = generateSessionCode();
      attempts++;
    }

    const { data, error: insertError } = await supabase
      .from('couple_sessions')
      .insert({
        code,
        host_id: playerId,
        host_name: playerName.trim(),
        period_friendly: periodFriendly,
        phase: 'waiting',
        vote_phase: 'p1',
      })
      .select()
      .single();

    if (insertError || !data) {
      setError('Impossible de créer la session. Réessayez.');
      return;
    }

    setSession(data as unknown as CoupleSession);
    setSessionCode(code);
    setIsHost(true);
    setMode('session');
  };

  // ── Join session ─────────────────────────────────────────────────────────────

  const handleJoin = async () => {
    if (!inputCode.trim() || !playerName.trim()) return;
    setError(null);

    const { data: existing, error: fetchError } = await supabase
      .from('couple_sessions')
      .select('*')
      .eq('code', inputCode.trim().toUpperCase())
      .single();

    if (fetchError || !existing) {
      setError('Session introuvable. Vérifiez le code.');
      return;
    }

    if (existing.guest_id) {
      setError('Cette session est déjà complète.');
      return;
    }

    const { data: updated, error: updateError } = await supabase
      .from('couple_sessions')
      .update({
        guest_id: playerId,
        guest_name: playerName.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('code', inputCode.trim().toUpperCase())
      .select()
      .single();

    if (updateError || !updated) {
      setError('Impossible de rejoindre la session.');
      return;
    }

    setSession(updated as unknown as CoupleSession);
    setSessionCode(inputCode.trim().toUpperCase());
    setIsHost(false);
    setPeriodFriendly(existing.period_friendly);
    setMode('session');
  };

  // ── Submit fantasies ─────────────────────────────────────────────────────────

  const submitFantasies = async () => {
    if (!session) return;
    const valid = myFantasies.map(s => s.trim()).filter(Boolean);

    const updates: Record<string, unknown> = isHost
      ? { host_fantasies: valid, host_done: true }
      : { guest_fantasies: valid, guest_done: true };

    // If both done, build deck and move to ready
    const bothDone = isHost
      ? (session.guest_done ?? false)
      : session.host_done;

    if (bothDone) {
      const allTexts = isHost
        ? [...valid, ...session.guest_fantasies]
        : [...session.host_fantasies, ...valid];
      const deck = buildDeck(allTexts, session.period_friendly);
      updates.deck = deck;
      updates.phase = 'ready';
    }

    await supabase
      .from('couple_sessions')
      .update(updates)
      .eq('code', session.code);

    setMyFantasies(['']);
  };

  // ── Start voting (host only) ──────────────────────────────────────────────────

  const startVoting = async () => {
    if (!session || !isHost) return;
    await supabase
      .from('couple_sessions')
      .update({ phase: 'voting', vote_phase: 'p1', host_vote: null, guest_vote: null })
      .eq('code', session.code);
  };

  // ── Cast vote ─────────────────────────────────────────────────────────────────

  const castVote = async (vote: 'validate' | 'pass') => {
    if (!session) return;

    const updates: Record<string, unknown> = isHost
      ? { host_vote: vote }
      : { guest_vote: vote };

    // Check if both voted
    const otherVote = isHost ? session.guest_vote : session.host_vote;
    const myVote = vote;

    if (otherVote !== null && otherVote !== undefined) {
      const bothValidated = myVote === 'validate' && otherVote === 'validate';
      const card = session.deck[session.current_index];

      if (bothValidated && card) {
        const newMatches = [...session.matches, card];
        updates.matches = newMatches;
        updates.vote_phase = 'reveal';
      } else {
        updates.vote_phase = 'reveal';
      }
    }

    await supabase
      .from('couple_sessions')
      .update(updates)
      .eq('code', session.code);
  };

  // ── Next card (host only) ──────────────────────────────────────────────────────

  const nextCard = async () => {
    if (!session || !isHost) return;
    const nextIndex = session.current_index + 1;

    if (nextIndex >= session.deck.length) {
      await supabase
        .from('couple_sessions')
        .update({ phase: 'results', current_index: nextIndex })
        .eq('code', session.code);
      return;
    }

    await supabase
      .from('couple_sessions')
      .update({
        current_index: nextIndex,
        vote_phase: 'p1',
        host_vote: null,
        guest_vote: null,
      })
      .eq('code', session.code);

    setCardKey(k => k + 1);
  };

  // ── Cleanup session ────────────────────────────────────────────────────────────

  const cleanupSession = useCallback(async () => {
    if (!sessionCode) return;
    await supabase.from('couple_sessions').delete().eq('code', sessionCode);
  }, [sessionCode]);

  const resetGame = () => {
    cleanupSession();
    setSession(null);
    setSessionCode('');
    setMode('choose');
    setPlayerName('');
    setInputCode('');
    setMyFantasies(['']);
    setPeriodFriendly(false);
    setShowInput(false);
    setCardKey(0);
    setCardExiting(false);
    setShowMatchAnim(false);
    setMatchAnimCard(null);
    setError(null);
  };

  // ── Fantasy input helpers ─────────────────────────────────────────────────────

  const addLine = () => setMyFantasies(prev => [...prev, '']);
  const removeLine = (i: number) => {
    if (myFantasies.length <= 1) return;
    setMyFantasies(prev => prev.filter((_, idx) => idx !== i));
  };
  const updateLine = (i: number, val: string) =>
    setMyFantasies(prev => prev.map((v, idx) => idx === i ? val : v));

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sessionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  // ── Common header ──────────────────────────────────────────────────────────────

  const Header = ({ subtitle }: { subtitle?: string }) => (
    <div className="flex items-center gap-3 px-4 pt-6 pb-4 flex-shrink-0">
      <button
        onClick={resetGame}
        className="p-2 rounded-xl bg-slate-700/60 text-slate-300 hover:bg-slate-700 transition-colors mobile-button touch-action-none"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-white truncate">Fantasmes à distance</h1>
        {subtitle && <p className="text-slate-400 text-xs truncate">{subtitle}</p>}
      </div>
      <Heart className="w-6 h-6 text-rose-400 flex-shrink-0" />
    </div>
  );

  // ── CHOOSE MODE ─────────────────────────────────────────────────────────────────

  if (mode === 'choose') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 flex flex-col safe-area-inset">
        <Header />
        <div className="flex-1 flex flex-col justify-center px-4 pb-8">
          <div className="max-w-md mx-auto w-full space-y-6">
            <div className="text-center mb-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg animate-gentle-float">
                  <Wifi className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Jouer à distance</h2>
              <p className="text-slate-400 text-sm">Chaque joueur utilise son propre téléphone</p>
            </div>

            <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50 space-y-4">
              <div>
                <label className="text-slate-400 text-xs block mb-1.5">Votre nom</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  placeholder="Prénom..."
                  maxLength={20}
                  className="w-full bg-slate-700/60 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/60 transition-colors text-sm"
                />
              </div>

              <button
                onClick={() => setPeriodFriendly(v => !v)}
                className={`w-full p-4 rounded-2xl border text-left transition-colors ${periodFriendly ? 'border-pink-400/60 bg-pink-500/15' : 'border-slate-700/50 bg-slate-800/60'}`}
              >
                <p className="text-white font-semibold text-sm">Pas en forme aujourd'hui ?</p>
                <p className="text-slate-400 text-xs mt-1">Propositions réconfortantes et sans pression.</p>
                <p className="text-pink-300 text-xs mt-2 font-semibold">{periodFriendly ? 'Mode douceur activé' : 'Activer le mode douceur'}</p>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleCreate}
                disabled={!playerName.trim()}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-200 shadow-xl mobile-button touch-action-none flex items-center justify-center gap-3 ${
                  playerName.trim()
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:opacity-90 active:scale-95'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Plus className="w-6 h-6" />
                Créer une session
              </button>
              <div className="text-center text-slate-500 text-xs">— ou —</div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputCode}
                  onChange={e => setInputCode(e.target.value.toUpperCase())}
                  placeholder="CODE"
                  maxLength={6}
                  className="flex-1 bg-slate-700/60 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/60 transition-colors text-sm font-mono text-center tracking-wider"
                />
                <button
                  onClick={handleJoin}
                  disabled={!playerName.trim() || !inputCode.trim()}
                  className={`px-6 py-3 rounded-xl font-bold transition-all mobile-button touch-action-none ${
                    playerName.trim() && inputCode.trim()
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90 active:scale-95'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Rejoindre
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <button
              onClick={onBack}
              className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium transition-colors mobile-button touch-action-none flex items-center justify-center gap-2 text-sm"
            >
              <Home className="w-4 h-4" />
              Retour au Temple
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── SESSION VIEW (waiting + input + ready + voting + results) ─────────────────

  if (mode === 'session' && session) {
    const myDone = isHost ? session.host_done : session.guest_done;
    const bothDone = session.host_done && session.guest_done;
    const opponentName = isHost ? session.guest_name : session.host_name;
    const opponentDone = isHost ? session.guest_done : session.host_done;
    const myVote = isHost ? session.host_vote : session.guest_vote;
    const opponentVote = isHost ? session.guest_vote : session.host_vote;

    // ── WAITING (for guest to join) ────────────────────────────────────────────
    if (session.phase === 'waiting') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 flex flex-col safe-area-inset">
          <Header subtitle="En attente" />
          <div className="flex-1 flex flex-col justify-center px-4 pb-8">
            <div className="max-w-md mx-auto w-full space-y-6 text-center">
              <div className="bg-slate-800/60 rounded-2xl p-6 border border-rose-500/30">
                <p className="text-rose-200 text-sm mb-3">Code de session</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-700 rounded-lg p-4 font-mono text-2xl text-amber-400 text-center tracking-wider">
                    {session.code}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors mobile-button touch-action-none"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-5">
                <div className="inline-block w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-amber-200 text-sm font-medium">En attente de votre partenaire…</p>
                <p className="text-amber-100/70 text-xs mt-1">Partagez le code pour qu'il rejoigne la session</p>
              </div>

              <div className="space-y-3">
                <div className={`p-4 rounded-lg border-2 flex items-center justify-between ${session.host_id ? 'border-blue-500 bg-blue-500/20' : 'border-slate-500 bg-slate-500/20'}`}>
                  <span className="text-white font-medium">{session.host_name} {isHost && '(Vous)'}</span>
                  <span className="text-xs text-blue-300">En ligne</span>
                </div>
                <div className={`p-4 rounded-lg border-2 flex items-center justify-between ${session.guest_id ? 'border-green-500 bg-green-500/20' : 'border-slate-500 bg-slate-500/20'}`}>
                  <span className="text-white font-medium">{session.guest_name || 'En attente…'}</span>
                  <span className="text-xs text-slate-400">{session.guest_id ? 'En ligne' : 'Hors ligne'}</span>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium transition-colors mobile-button touch-action-none flex items-center justify-center gap-2 text-sm"
              >
                <Home className="w-4 h-4" />
                Annuler
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ── FANTASY INPUT ────────────────────────────────────────────────────────────
    if (session.phase === 'input' || (session.phase === 'waiting' && session.guest_id && !myDone && !bothDone)) {
      // If guest just joined, move to input phase
      if (isHost && session.phase === 'waiting' && session.guest_id) {
        supabase
          .from('couple_sessions')
          .update({ phase: 'input' })
          .eq('code', session.code);
      }

      if (!myDone) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 flex flex-col safe-area-inset">
            <Header subtitle="Saisie secrète" />
            <div className="flex-1 overflow-y-auto px-4 pb-8">
              <div className="max-w-md mx-auto space-y-5">
                <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold">{playerName}, vos fantasmes</h3>
                      <p className="text-slate-400 text-xs mt-0.5">L'autre joueur ne verra pas vos saisies</p>
                    </div>
                    <button onClick={() => setShowInput(v => !v)} className="p-2 rounded-xl bg-slate-700 text-slate-400 mobile-button touch-action-none">
                      {showInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {myFantasies.map((val, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type={showInput ? 'text' : 'password'}
                          value={val}
                          onChange={e => updateLine(i, e.target.value)}
                          placeholder={`Fantasme ${i + 1}…`}
                          className="flex-1 bg-slate-700/60 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/60 transition-colors text-sm"
                          autoComplete="off"
                        />
                        {myFantasies.length > 1 && (
                          <button onClick={() => removeLine(i)} className="p-2.5 rounded-xl bg-rose-900/40 text-rose-400 hover:bg-rose-900/60 transition-colors mobile-button touch-action-none">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {myFantasies.length < 8 && (
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
                  onClick={submitFantasies}
                  className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:opacity-90 active:scale-95 transition-all duration-200 shadow-xl mobile-button touch-action-none flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Valider mes fantasmes
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Waiting for opponent to finish input
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 flex flex-col safe-area-inset">
          <Header subtitle="En attente" />
          <div className="flex-1 flex flex-col justify-center px-4 pb-8">
            <div className="max-w-md mx-auto w-full text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Vos fantasmes sont enregistrés</h2>
                <p className="text-slate-400 text-sm">En attente de {opponentName}…</p>
              </div>
              <div className="inline-block w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </div>
      );
    }

    // ── READY ──────────────────────────────────────────────────────────────────────
    if (session.phase === 'ready') {
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
              {isHost ? (
                <button
                  onClick={startVoting}
                  className="w-full py-5 rounded-2xl font-bold text-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:opacity-90 active:scale-95 transition-all duration-200 shadow-xl mobile-button touch-action-none flex items-center justify-center gap-3"
                >
                  <Heart className="w-6 h-6" /> Lancer les votes
                </button>
              ) : (
                <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-slate-300 text-sm">En attente que {session.host_name} lance les votes…</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ── VOTING ──────────────────────────────────────────────────────────────────────
    if (session.phase === 'voting') {
      const card = session.deck[session.current_index];
      if (!card) {
        if (isHost) nextCard();
        return null;
      }

      const progress = session.current_index / session.deck.length;
      const matchCount = session.matches.length;
      const bothVoted = session.host_vote !== null && session.guest_vote !== null;
      const bothValidated = session.host_vote === 'validate' && session.guest_vote === 'validate';

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

          <Header subtitle={`${matchCount} match${matchCount !== 1 ? 's' : ''} · Carte ${session.current_index + 1}/${session.deck.length}`} />

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

              {!bothVoted ? (
                <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50 space-y-4">
                  {myVote !== null ? (
                    <div className="text-center space-y-3">
                      <div className="inline-block w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-slate-400 text-sm">
                        Vote enregistré. En attente de {opponentName}…
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                        <p className="text-slate-400 text-sm">À vous de voter</p>
                        <p className="text-white font-bold text-xl">{playerName}</p>
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
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50 text-center space-y-4 animate-slide-up">
                  <p className="text-slate-400 text-sm">Les deux votes sont enregistrés.</p>
                  <p className="text-slate-500 text-xs">Les résultats individuels restent secrets jusqu'à un match mutuel.</p>
                  {isHost ? (
                    <button
                      onClick={nextCard}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold flex items-center justify-center gap-2 mobile-button touch-action-none hover:from-slate-500 hover:to-slate-600 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" /> Carte suivante
                    </button>
                  ) : (
                    <div className="inline-block w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ── RESULTS ──────────────────────────────────────────────────────────────────────
    if (session.phase === 'results') {
      const matches = session.matches;
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
                <p className="text-slate-400 text-sm">{session.host_name} &amp; {session.guest_name}</p>
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
                <Heart className="w-5 h-5" /> Nouvelle partie
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // ── FALLBACK ──────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-slate-400 mb-4">Chargement…</p>
        <button onClick={resetGame} className="px-6 py-3 bg-slate-700 text-white rounded-xl mobile-button touch-action-none">
          Retour
        </button>
      </div>
    </div>
  );
};

export default CoupleGameRemote;
