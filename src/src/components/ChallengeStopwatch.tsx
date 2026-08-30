import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

interface ChallengeStopwatchProps {
  durationSeconds: number;
  autoStart?: boolean;
  onTimeUp?: () => void;
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// Web Audio beep generator — no external assets required.
const useBeepPlayer = () => {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      try {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (Ctor) ctxRef.current = new Ctor();
      } catch {
        return null;
      }
    }
    return ctxRef.current;
  };

  const beep = (frequency: number, durationMs: number) => {
    const ctx = ensureContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // ignore audio errors
    }
  };

  return { beep, resume: () => ensureContext()?.resume?.() };
};

const ChallengeStopwatch: React.FC<ChallengeStopwatchProps> = ({ durationSeconds, autoStart = false, onTimeUp }) => {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [running, setRunning] = useState(autoStart);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { beep, resume } = useBeepPlayer();
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  // Reset when the duration changes (new challenge)
  useEffect(() => {
    setRemaining(durationSeconds);
    setFinished(false);
    setRunning(autoStart);
  }, [durationSeconds, autoStart]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    resume();

    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setRunning(false);
          setFinished(true);
          // Final long beep
          beep(880, 900);
          onTimeUpRef.current?.();
          return 0;
        }
        const next = prev - 1;
        // Beep during the last 10 seconds
        if (next <= 10 && next > 0) {
          beep(660, 150);
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, beep, resume]);

  const toggle = () => {
    if (finished) return;
    resume();
    setRunning(r => !r);
  };

  const reset = () => {
    setRemaining(durationSeconds);
    setFinished(false);
    setRunning(false);
  };

  const isWarning = remaining <= 10 && remaining > 0 && running;
  const progress = durationSeconds > 0 ? ((durationSeconds - remaining) / durationSeconds) * 100 : 0;

  return (
    <div className={`mt-4 rounded-2xl border p-4 transition-colors ${
      finished
        ? 'border-emerald-400/60 bg-emerald-500/15'
        : isWarning
        ? 'border-rose-400/60 bg-rose-500/15'
        : 'border-sky-400/40 bg-sky-500/10'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
          finished ? 'bg-emerald-500/30' : isWarning ? 'bg-rose-500/30' : 'bg-sky-500/20'
        }`}>
          <Timer className={`w-6 h-6 ${finished ? 'text-emerald-300' : isWarning ? 'text-rose-300' : 'text-sky-300'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs uppercase tracking-widest text-slate-400">
              {finished ? 'Terminé' : isWarning ? 'Dernières secondes' : 'Chronomètre'}
            </span>
            <span className={`text-2xl font-bold tabular-nums ${
              finished ? 'text-emerald-300' : isWarning ? 'text-rose-300 animate-pulse' : 'text-white'
            }`}>
              {formatTime(remaining)}
            </span>
          </div>
          <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                finished ? 'bg-emerald-400' : isWarning ? 'bg-rose-400' : 'bg-sky-400'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggle}
            disabled={finished}
            className={`p-2.5 rounded-xl transition-colors mobile-button touch-action-none ${
              finished
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : running
                ? 'bg-amber-500/80 text-white active:bg-amber-600'
                : 'bg-sky-500/80 text-white active:bg-sky-600'
            }`}
            aria-label={running ? 'Pause' : 'Lecture'}
          >
            {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={reset}
            className="p-2.5 rounded-xl bg-slate-700 text-slate-300 active:bg-slate-600 transition-colors mobile-button touch-action-none"
            aria-label="Réinitialiser"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!autoStart && !running && !finished && (
        <p className="mt-3 text-center text-sky-300 text-sm font-medium">
          Préparez-vous, puis lancez le chrono quand vous êtes prêt.
        </p>
      )}

      {finished && (
        <p className="mt-3 text-center text-emerald-300 text-sm font-medium">
          Temps écoulé ! Le défi est relevé.
        </p>
      )}
    </div>
  );
};

export default ChallengeStopwatch;
