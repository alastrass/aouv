import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeft, Camera, Video, Check, X, RotateCcw,
  Users, Flame, Zap, Snowflake, Star, Image as ImageIcon,
  Trash2, Download, Sparkles, Play, Clock, AlertCircle, Shield
} from 'lucide-react';
import {
  ShootingPhase, ShootingIntensity, ShootingChallenge, ShootingCapture, Player
} from '../types';
import { shootingChallenges, shootingIntensityConfig } from '../data/shootingTimeChallenges';
import ChallengeStopwatch from './ChallengeStopwatch';

const STORAGE_KEY = 'shootingTime_session';

const intensityOrder: ShootingIntensity[] = ['soft', 'hot', 'hard', 'extreme'];

const intensityIcons: Record<ShootingIntensity, React.FC<{ className?: string }>> = {
  soft: Snowflake,
  hot: Flame,
  hard: Star,
  extreme: Zap,
};

const mediaTypeConfig = {
  photo: { label: 'Photo', icon: Camera, color: 'text-sky-300', bg: 'bg-sky-500/20', border: 'border-sky-500/30' },
  video: { label: 'Vidéo', icon: Video, color: 'text-amber-300', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
};

interface ShootingTimeGameProps {
  onBack: () => void;
}

const ShootingTimeGame: React.FC<ShootingTimeGameProps> = ({ onBack }) => {
  const [phase, setPhase] = useState<ShootingPhase>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedIntensities, setSelectedIntensities] = useState<ShootingIntensity[]>(['soft', 'hot']);
  const [currentChallenge, setCurrentChallenge] = useState<ShootingChallenge | null>(null);
  const [usedIds, setUsedIds] = useState<number[]>([]);
  const [captures, setCaptures] = useState<ShootingCapture[]>([]);
  const [showGallery, setShowGallery] = useState(false);

  // Setup form state
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        if (data.captures) setCaptures(data.captures);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const saveSession = useCallback((updates: Partial<{
    players: Player[]; selectedIntensities: ShootingIntensity[]; captures: ShootingCapture[];
  }>) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const existing = saved ? JSON.parse(saved) : {};
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...updates }));
    } catch {
      // ignore
    }
  }, []);

  const toggleIntensity = (intensity: ShootingIntensity) => {
    setSelectedIntensities(prev =>
      prev.includes(intensity)
        ? prev.filter(i => i !== intensity)
        : [...prev, intensity]
    );
  };

  const buildDeck = useCallback((intensities: ShootingIntensity[]): ShootingChallenge[] => {
    const pool = shootingChallenges.filter(c => intensities.includes(c.intensity));
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const [deck, setDeck] = useState<ShootingChallenge[]>([]);

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
    setCaptures([]);
    saveSession({ players: newPlayers, selectedIntensities, captures: [] });
    setPhase('playing');
  };

  const drawCard = useCallback(() => {
    const available = deck.filter(c => !usedIds.includes(c.id));
    if (available.length === 0) {
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
  }, [deck, usedIds, selectedIntensities, buildDeck]);

  useEffect(() => {
    if (phase === 'playing' && !currentChallenge) {
      drawCard();
    }
  }, [phase, currentChallenge, drawCard]);

  // ── Camera ──────────────────────────────────────────────────────────────────

  const startCamera = useCallback(async (mode: 'photo' | 'video') => {
    setCameraError(null);
    setCapturedMedia(null);
    setRecordedChunks([]);
    setCameraMode(mode);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: mode === 'video',
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.error('camera error', err);
      setCameraError('Impossible d\'accéder à la caméra. Vérifiez les permissions du navigateur.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsRecording(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedMedia(dataUrl);
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    setRecordedChunks([]);
    const recorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setRecordedChunks(prev => [...prev, e.data]);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedMedia(reader.result as string);
      };
      reader.readAsDataURL(blob);
    };

    recorder.start();
    setIsRecording(true);
  }, [recordedChunks]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  // Fix: use a ref to avoid stale closure in onstop
  const recordedChunksRef = useRef<Blob[]>([]);
  useEffect(() => {
    recordedChunksRef.current = recordedChunks;
  }, [recordedChunks]);

  const startRecordingFixed = useCallback(() => {
    if (!streamRef.current) return;
    setRecordedChunks([]);
    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunksRef.current = [...recordedChunksRef.current, e.data];
        setRecordedChunks(recordedChunksRef.current);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedMedia(reader.result as string);
      };
      reader.readAsDataURL(blob);
    };

    recorder.start();
    setIsRecording(true);
  }, []);

  const handleRetake = () => {
    setCapturedMedia(null);
    setRecordedChunks([]);
  };

  const handleValidateCapture = () => {
    if (!currentChallenge || !capturedMedia) return;

    const capture: ShootingCapture = {
      challengeId: currentChallenge.id,
      instruction: currentChallenge.instruction,
      intensity: currentChallenge.intensity,
      mediaType: currentChallenge.mediaType,
      dataUrl: capturedMedia,
      playerName: players[currentPlayerIndex].name,
      timestamp: Date.now(),
    };

    const newCaptures = [capture, ...captures];
    setCaptures(newCaptures);
    saveSession({ captures: newCaptures });

    setPlayers(prev => prev.map((p, i) =>
      i === currentPlayerIndex ? { ...p, score: p.score + 1 } : p
    ));
    saveSession({ players: players.map((p, i) => i === currentPlayerIndex ? { ...p, score: p.score + 1 } : p) });

    stopCamera();
    setCapturedMedia(null);
    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    setCurrentChallenge(null);
  };

  const handleSkip = () => {
    stopCamera();
    setCapturedMedia(null);
    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    setCurrentChallenge(null);
  };

  const handleRestart = () => {
    stopCamera();
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
    setUsedIds([]);
    setCaptures([]);
    setCurrentChallenge(null);
    setCurrentPlayerIndex(0);
    setDeck(buildDeck(selectedIntensities));
    saveSession({ captures: [], players: players.map(p => ({ ...p, score: 0 })) });
  };

  const handleBackToSetup = () => {
    stopCamera();
    setPhase('setup');
    setCurrentChallenge(null);
  };

  const downloadCapture = (capture: ShootingCapture) => {
    const link = document.createElement('a');
    link.href = capture.dataUrl;
    const ext = capture.mediaType === 'photo' ? 'jpg' : 'webm';
    link.download = `shooting-club-${capture.playerName}-${capture.timestamp}.${ext}`;
    link.click();
  };

  const deleteCapture = (timestamp: number) => {
    const newCaptures = captures.filter(c => c.timestamp !== timestamp);
    setCaptures(newCaptures);
    saveSession({ captures: newCaptures });
  };

  const remainingInDeck = deck.filter(c => !usedIds.includes(c.id)).length;

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // ── SETUP PHASE ──────────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900 safe-area-inset">
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
              <Camera className="w-6 h-6 text-cyan-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">Shooting Club</h1>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-cyan-500/20 shadow-2xl">
            <p className="text-cyan-200 text-sm sm:text-base leading-relaxed mb-6">
              Tour à tour, tirez un défi photo ou vidéo. L'un filme, l'autre pose selon l'instruction.
              Les clichés restent sur votre appareil — rien n'est envoyé nulle part.
            </p>

            {/* Privacy notice */}
            <div className="mb-6 bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-emerald-200 text-sm font-semibold">Vie privée</p>
                <p className="text-emerald-100/70 text-xs mt-1">
                  Les photos et vidéos sont stockées uniquement dans votre navigateur. Aucun upload, aucun serveur.
                  Fermez l'onglet et elles disparaissent.
                </p>
              </div>
            </div>

            {/* Player names */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Joueurs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={player1Name}
                  onChange={e => setPlayer1Name(e.target.value)}
                  placeholder="Photographe 1"
                  maxLength={20}
                  className="px-4 py-3 bg-slate-700 border border-cyan-500/30 rounded-xl text-white placeholder-cyan-300 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <input
                  type="text"
                  value={player2Name}
                  onChange={e => setPlayer2Name(e.target.value)}
                  placeholder="Photographe 2"
                  maxLength={20}
                  className="px-4 py-3 bg-slate-700 border border-cyan-500/30 rounded-xl text-white placeholder-cyan-300 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Intensity selection */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Niveau d'intensité</h2>
              <p className="text-cyan-200 text-sm mb-4">Sélectionnez un ou plusieurs niveaux. Les défis seront tirés parmi les niveaux choisis.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {intensityOrder.map(intensity => {
                  const config = shootingIntensityConfig[intensity];
                  const Icon = intensityIcons[intensity];
                  const isSelected = selectedIntensities.includes(intensity);
                  return (
                    <button
                      key={intensity}
                      onClick={() => toggleIntensity(intensity)}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                        isSelected
                          ? `${config.border} bg-gradient-to-br ${config.gradient} bg-opacity-20`
                          : 'border-cyan-500/20 bg-slate-700/50 hover:border-cyan-400/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : config.color}`} />
                        <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-cyan-200'}`}>
                          {config.icon} {config.label}
                        </h3>
                      </div>
                      <p className="text-sm text-cyan-200/80">{config.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={!player1Name.trim() || !player2Name.trim() || selectedIntensities.length === 0}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              Commencer la séance
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAYING PHASE ────────────────────────────────────────────────────────────
  const config = currentChallenge ? shootingIntensityConfig[currentChallenge.intensity] : null;
  const Icon = currentChallenge ? intensityIcons[currentChallenge.intensity] : null;
  const mediaConfig = currentChallenge ? mediaTypeConfig[currentChallenge.mediaType] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950/20 to-slate-900 safe-area-inset">
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBackToSetup}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Retour</span>
          </button>

          <div className="text-center flex-1 mx-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Camera className="w-5 h-5 text-cyan-400" />
              <h1 className="text-lg sm:text-xl font-bold text-white">Shooting Club</h1>
            </div>
            <p className="text-cyan-200 text-xs sm:text-sm">
              Tour de <span className="font-bold text-amber-400">{players[currentPlayerIndex]?.name}</span>
            </p>
          </div>

          <button
            onClick={() => setShowGallery(!showGallery)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
            aria-label="Galerie"
          >
            <ImageIcon className="w-4 h-4" />
            {captures.length > 0 && (
              <span className="text-xs font-bold text-cyan-300">{captures.length}</span>
            )}
          </button>
        </div>

        {/* Score Board */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {players.map((player, i) => (
            <div key={player.id} className={`text-center px-4 py-3 rounded-xl border-2 transition-all ${
              i === currentPlayerIndex
                ? 'border-amber-400 bg-amber-500/10'
                : 'border-cyan-500/20 bg-slate-800/50'
            }`}>
              <p className={`text-sm font-medium ${i === currentPlayerIndex ? 'text-amber-300' : 'text-cyan-200'}`}>
                {player.name}
              </p>
              <p className="text-2xl font-bold text-white">{player.score}</p>
            </div>
          ))}
        </div>

        {/* Gallery Panel */}
        {showGallery && (
          <div className="mb-6 bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-cyan-500/20 shadow-xl animate-slide-up">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              Galerie ({captures.length})
            </h3>
            {captures.length === 0 ? (
              <p className="text-cyan-300 text-sm text-center py-4">Aucune capture pour le moment.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {captures.map((capture) => {
                  const capConfig = shootingIntensityConfig[capture.intensity];
                  const MediaIcon = capture.mediaType === 'photo' ? Camera : Video;
                  return (
                    <div key={capture.timestamp} className="bg-slate-700/50 rounded-xl overflow-hidden border border-slate-600">
                      <div className="relative aspect-square">
                        {capture.mediaType === 'photo' ? (
                          <img src={capture.dataUrl} alt="capture" className="w-full h-full object-cover" />
                        ) : (
                          <video src={capture.dataUrl} className="w-full h-full object-cover" controls />
                        )}
                        <div className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full ${mediaTypeConfig[capture.mediaType].bg} ${mediaTypeConfig[capture.mediaType].color} border ${mediaTypeConfig[capture.mediaType].border}`}>
                          <MediaIcon className="w-3 h-3 inline" />
                        </div>
                        <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-slate-800/80 ${capConfig.color} border ${capConfig.border}`}>
                          {capConfig.icon}
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-white text-xs truncate font-medium">{capture.playerName}</p>
                        <div className="flex gap-1 mt-1">
                          <button
                            onClick={() => downloadCapture(capture)}
                            className="flex-1 p-1.5 rounded-lg bg-slate-600 hover:bg-slate-500 text-white transition-colors"
                            title="Télécharger"
                          >
                            <Download className="w-3 h-3 mx-auto" />
                          </button>
                          <button
                            onClick={() => deleteCapture(capture.timestamp)}
                            className="flex-1 p-1.5 rounded-lg bg-rose-900/40 text-rose-400 hover:bg-rose-900/60 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3 h-3 mx-auto" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Challenge Card Area */}
        {currentChallenge && config && Icon && mediaConfig && !cameraActive && !capturedMedia && (
          <div className="flex flex-col items-center animate-slide-up">
            <div className={`w-full max-w-sm rounded-2xl border-2 ${config.border} bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl p-6 mb-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${mediaConfig.bg} ${mediaConfig.color} border ${mediaConfig.border}`}>
                  <mediaConfig.icon className="w-3.5 h-3.5" />
                  {mediaConfig.label}
                </div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${config.gradient} text-white`}>
                  <Icon className="w-3.5 h-3.5" />
                  {config.label}
                </div>
              </div>

              <p className="text-white text-base sm:text-lg leading-relaxed text-center font-medium mb-4">
                {currentChallenge.instruction}
              </p>

              {currentChallenge.durationSeconds && (
                <div className="flex items-center justify-center gap-1.5 text-sky-300 text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Durée suggérée : {currentChallenge.durationSeconds}s</span>
                </div>
              )}

              <p className="text-slate-400 text-xs text-center">
                {currentChallenge.mediaType === 'photo' ? 'Prendre une photo' : 'Filmer une vidéo'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <button
                onClick={() => startCamera(currentChallenge.mediaType)}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 active:from-cyan-700 active:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all mobile-button touch-action-none"
              >
                {currentChallenge.mediaType === 'photo' ? <Camera className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                {currentChallenge.mediaType === 'photo' ? 'Prendre la photo' : 'Filmer la vidéo'}
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-700 active:bg-slate-800 text-slate-300 font-semibold rounded-xl transition-all mobile-button touch-action-none"
              >
                <X className="w-5 h-5" />
                Passer
              </button>
            </div>
          </div>
        )}

        {/* Camera View */}
        {cameraActive && !capturedMedia && (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl mb-4 relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={cameraMode === 'photo'}
                className="w-full aspect-[3/4] object-cover bg-slate-900"
              />

              {/* Instruction overlay */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
                <p className="text-white text-sm font-medium leading-snug">
                  {currentChallenge?.instruction}
                </p>
              </div>

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/80 px-3 py-1 rounded-full">
                  <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-xs font-bold">REC</span>
                </div>
              )}
            </div>

            {/* Stopwatch for timed challenges */}
            {cameraMode === 'video' && isRecording && currentChallenge?.durationSeconds && (
              <div className="w-full max-w-sm mb-4">
                <ChallengeStopwatch
                  key={currentChallenge.id}
                  durationSeconds={currentChallenge.durationSeconds}
                  autoStart
                />
              </div>
            )}

            {cameraError && (
              <div className="w-full max-w-sm mb-4 bg-red-900/30 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{cameraError}</p>
              </div>
            )}

            {/* Camera controls */}
            {!cameraError && (
              <div className="flex gap-3 w-full max-w-sm">
                {cameraMode === 'photo' && (
                  <button
                    onClick={capturePhoto}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 active:from-cyan-700 active:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all mobile-button touch-action-none"
                  >
                    <Camera className="w-6 h-6" />
                    Capturer
                  </button>
                )}
                {cameraMode === 'video' && !isRecording && (
                  <button
                    onClick={startRecordingFixed}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-red-600 to-rose-600 active:from-red-700 active:to-rose-700 text-white font-bold rounded-xl shadow-lg transition-all mobile-button touch-action-none"
                  >
                    <span className="w-4 h-4 bg-white rounded-full" />
                    Enregistrer
                  </button>
                )}
                {cameraMode === 'video' && isRecording && (
                  <button
                    onClick={stopRecording}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-700 active:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all mobile-button touch-action-none"
                  >
                    <span className="w-4 h-4 bg-red-500" />
                    Arrêter
                  </button>
                )}
                <button
                  onClick={stopCamera}
                  className="px-4 py-4 bg-slate-700 active:bg-slate-800 text-slate-300 font-semibold rounded-xl transition-all mobile-button touch-action-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Captured Media Preview */}
        {capturedMedia && (
          <div className="flex flex-col items-center animate-slide-up">
            <div className="w-full max-w-sm rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl mb-4">
              {cameraMode === 'photo' ? (
                <img src={capturedMedia} alt="capture" className="w-full aspect-[3/4] object-cover" />
              ) : (
                <video src={capturedMedia} className="w-full aspect-[3/4] object-cover" controls autoPlay />
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <button
                onClick={handleValidateCapture}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-600 active:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all mobile-button touch-action-none"
              >
                <Check className="w-5 h-5" />
                Valider (+1 pt)
              </button>
              <button
                onClick={handleRetake}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-amber-600 active:bg-amber-700 text-white font-bold rounded-xl shadow-lg transition-all mobile-button touch-action-none"
              >
                <RotateCcw className="w-5 h-5" />
                Refaire
              </button>
              <button
                onClick={handleSkip}
                className="px-4 py-4 bg-slate-700 active:bg-slate-800 text-slate-300 font-semibold rounded-xl transition-all mobile-button touch-action-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Draw next card */}
        {!currentChallenge && !cameraActive && !capturedMedia && phase === 'playing' && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-cyan-200 text-lg mb-6 text-center">Préparez-vous pour le prochain défi !</p>
            <p className="text-cyan-300/60 text-xs mb-4">{remainingInDeck} défi{remainingInDeck > 1 ? 's' : ''} restant{remainingInDeck > 1 ? 's' : ''} dans le paquet</p>
            <button
              onClick={drawCard}
              className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 mobile-button touch-action-none"
            >
              <Sparkles className="w-6 h-6" />
              Tirer un défi
            </button>
          </div>
        )}

        {/* Footer controls */}
        <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-cyan-800/50">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-3 bg-amber-600 active:bg-amber-700 text-white font-semibold rounded-lg transition-colors mobile-button touch-action-none text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Nouvelle séance
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShootingTimeGame;
