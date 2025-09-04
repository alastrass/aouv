import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX, ArrowLeft, Clock, Trophy, Heart, List, X } from 'lucide-react';
import { KarmaSutraGameState, KarmaSutraSession, KarmaSutraPosition } from '../types';
import { karmaSutraPositions } from '../data/karmaSutraPositions';

interface KarmaSutraGameProps {
  onBack: () => void;
}

const KarmaSutraGame: React.FC<KarmaSutraGameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<KarmaSutraGameState>('welcome');
  const [session, setSession] = useState<KarmaSutraSession>({
    currentPositionIndex: 0,
    usedPositions: [],
    sessionCount: 0,
    timeRemaining: 0,
    isPlaying: false,
    soundEnabled: true
  });
  
  const [currentPosition, setCurrentPosition] = useState<KarmaSutraPosition | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showPositionSelector, setShowPositionSelector] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContextRef.current = new AudioContext();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Generate random time between 2-5 minutes (in seconds)
  const getRandomTime = () => {
    return Math.floor(Math.random() * (300 - 120 + 1)) + 120; // 120-300 seconds
  };

  // Get next random position
  const getNextPosition = (): KarmaSutraPosition => {
    const availablePositions = karmaSutraPositions.filter(
      (_, index) => !session.usedPositions.includes(index)
    );
    
    if (availablePositions.length === 0) {
      // Reset if all positions used
      setSession(prev => ({ ...prev, usedPositions: [] }));
      return karmaSutraPositions[Math.floor(Math.random() * karmaSutraPositions.length)];
    }
    
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const selectedPosition = availablePositions[randomIndex];
    const originalIndex = karmaSutraPositions.findIndex(p => p.id === selectedPosition.id);
    
    setSession(prev => ({
      ...prev,
      usedPositions: [...prev.usedPositions, originalIndex]
    }));
    
    return selectedPosition;
  };

  // Play sound effect
  const playSound = (frequency: number, duration: number, type: 'warning' | 'transition' = 'warning') => {
    if (!session.soundEnabled || !audioContextRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = type === 'warning' ? 'sine' : 'triangle';
      
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.log('Audio not available');
    }
  };

  // Start new session
  const startSession = () => {
    const newPosition = getNextPosition();
    const timeLimit = getRandomTime();
    
    setCurrentPosition(newPosition);
    setSession(prev => ({
      ...prev,
      sessionCount: prev.sessionCount + 1,
      timeRemaining: timeLimit,
      isPlaying: true,
      currentPositionIndex: karmaSutraPositions.findIndex(p => p.id === newPosition.id)
    }));
    setGameState('playing');
    setShowWarning(false);
  };

  // Skip to next position
  const skipPosition = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    startSession();
  };

  // Jump to specific position
  const jumpToPosition = (positionIndex: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const selectedPosition = karmaSutraPositions[positionIndex];
    const timeLimit = getRandomTime();
    
    setCurrentPosition(selectedPosition);
    setSession(prev => ({
      ...prev,
      timeRemaining: timeLimit,
      isPlaying: true,
      currentPositionIndex: positionIndex
    }));
    setGameState('playing');
    setShowWarning(false);
    setShowPositionSelector(false);
  };
  // Toggle pause/play
  const togglePause = () => {
    setSession(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  // Toggle sound
  const toggleSound = () => {
    setSession(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && session.isPlaying && session.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSession(prev => {
          const newTime = prev.timeRemaining - 1;
          
          // Warning at 30 seconds
          if (newTime === 30 && !showWarning) {
            setShowWarning(true);
            playSound(800, 0.3, 'warning');
          }
          
          // Time's up
          if (newTime <= 0) {
            playSound(600, 0.5, 'transition');
            setTimeout(() => {
              startSession(); // Auto start next position
            }, 1000);
            return prev;
          }
          
          return { ...prev, timeRemaining: newTime };
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, session.isPlaying, session.timeRemaining, showWarning]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgress = (): number => {
    if (!currentPosition) return 0;
    const totalTime = getRandomTime();
    return ((totalTime - session.timeRemaining) / totalTime) * 100;
  };

  // Welcome Screen
  if (gameState === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-amber-900 px-4 py-8 safe-area-inset">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Temple</span>
            </button>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-orange-500/20">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Heart className="w-12 h-12 text-red-400" />
                <div>
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-400">
                    Karma ? Sutra !
                  </h1>
                  <p className="text-orange-200 text-sm mt-2">
                    Explorez l'art de l'amour ensemble
                  </p>
                </div>
                <Heart className="w-12 h-12 text-red-400" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-xl p-6 mb-8 border border-red-500/30">
              <h2 className="text-white font-semibold mb-4 text-center">Comment ça marche ?</h2>
              <ul className="text-orange-200 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Chaque position s'affiche pendant 2 à 5 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Signal sonore à 30 secondes de la fin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Transition automatique vers la position suivante</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Possibilité de passer ou mettre en pause</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <button
                onClick={startSession}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 active:from-red-700 active:to-orange-700 text-white font-bold py-6 px-8 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-3 mobile-button touch-action-none"
              >
                <Play className="w-6 h-6" />
                <span className="text-lg">Commencer la Session</span>
              </button>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={toggleSound}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
                >
                  {session.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span className="text-sm">{session.soundEnabled ? 'Son activé' : 'Son désactivé'}</span>
                </button>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-orange-300 text-xs">
                {karmaSutraPositions.length} positions disponibles
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  if ((gameState === 'playing' || gameState === 'paused') && currentPosition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-amber-900 px-4 py-8 safe-area-inset">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 active:bg-slate-800/50 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Temple</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Karma ? Sutra !</h1>
              <p className="text-orange-200 text-sm">Session #{session.sessionCount}</p>
            </div>
            
            <button
              onClick={toggleSound}
              className="p-2 bg-slate-700/50 active:bg-slate-800/50 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              {session.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full border-8 border-slate-700/50 relative">
                <svg className="w-32 h-32 absolute top-0 left-0 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className={`${showWarning ? 'text-red-400' : 'text-orange-400'} transition-colors duration-300`}
                    strokeDasharray={`${(getProgress() / 100) * 351.86} 351.86`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${showWarning ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                      {formatTime(session.timeRemaining)}
                    </div>
                    <div className="text-orange-300 text-xs">
                      {showWarning ? 'Presque fini !' : 'Temps restant'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Position Display */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-orange-500/20 mb-8">
            <div className="text-center">
              {/* Image ou Illustration */}
              {currentPosition.imageUrl ? (
                <div className="mb-6">
                  <img 
                    src={currentPosition.imageUrl} 
                    alt={currentPosition.name}
                    className="w-80 h-80 object-cover rounded-2xl mx-auto shadow-2xl border-2 border-orange-500/30"
                    onError={(e) => {
                      // Fallback vers l'emoji si l'image ne charge pas
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling!.style.display = 'block';
                    }}
                  />
                  <div className="text-8xl mb-6 hidden">{currentPosition.illustration}</div>
                </div>
              ) : (
                <div className="text-8xl mb-6">{currentPosition.illustration}</div>
              )}
              
              <h2 className="text-3xl font-bold text-white mb-4">
                {currentPosition.name}
              </h2>
              
              <p className="text-orange-200 text-lg mb-6 leading-relaxed">
                {currentPosition.description}
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentPosition.difficulty === 'facile' 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : currentPosition.difficulty === 'moyen'
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {currentPosition.difficulty.charAt(0).toUpperCase() + currentPosition.difficulty.slice(1)}
                </span>
              </div>
              
              <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg p-4">
                <h3 className="text-orange-300 font-semibold mb-2 text-sm">Bienfaits :</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {currentPosition.benefits.map((benefit, index) => (
                    <span key={index} className="text-orange-200 text-xs bg-slate-700/50 px-2 py-1 rounded">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => setShowPositionSelector(true)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-600 active:bg-slate-700 text-white rounded-xl transition-colors mobile-button touch-action-none"
            >
              <List className="w-5 h-5" />
              <span className="text-sm">Choisir</span>
            </button>
            <button
              onClick={skipPosition}
              className="flex items-center gap-2 px-4 py-3 bg-orange-600 active:bg-orange-700 text-white rounded-xl transition-colors mobile-button touch-action-none"
            >
              <SkipForward className="w-5 h-5" />
              <span className="text-sm">Passer</span>
            </button>
          </div>

          {/* Main Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={togglePause}
              className="flex items-center gap-2 px-6 py-4 bg-orange-600 active:bg-orange-700 text-white rounded-xl transition-colors mobile-button touch-action-none"
            >
              {gameState === 'playing' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{gameState === 'playing' ? 'Pause' : 'Reprendre'}</span>
            </button>
          </div>

          {gameState === 'paused' && (
            <div className="text-center mt-6">
              <p className="text-orange-300 text-sm">
                Session en pause • Appuyez sur Reprendre pour continuer
              </p>
            </div>
          )}

          {/* Position Selector Modal */}
          {showPositionSelector && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-lg">Choisir une position</h3>
                  <button
                    onClick={() => setShowPositionSelector(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="overflow-y-auto max-h-96 space-y-3">
                  {karmaSutraPositions.map((position, index) => (
                    <button
                      key={position.id}
                      onClick={() => jumpToPosition(index)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                        index === session.currentPositionIndex
                          ? 'bg-orange-600 text-white border-2 border-orange-400'
                          : session.usedPositions.includes(index)
                          ? 'bg-slate-700/50 text-slate-300 border border-slate-600'
                          : 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Image miniature ou emoji */}
                        <div className="flex-shrink-0">
                          {position.imageUrl ? (
                            <img 
                              src={position.imageUrl} 
                              alt={position.name}
                              className="w-16 h-16 object-cover rounded-lg border border-orange-500/30"
                              onError={(e) => {
                                // Fallback vers l'emoji si l'image ne charge pas
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling!.style.display = 'block';
                              }}
                            />
                          ) : null}
                          <div className={`text-4xl ${position.imageUrl ? 'hidden' : ''}`}>
                            {position.illustration}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{position.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              position.difficulty === 'facile' 
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                : position.difficulty === 'moyen'
                                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {position.difficulty.charAt(0).toUpperCase() + position.difficulty.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm opacity-80 mb-2">
                            {position.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {position.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                              <span key={benefitIndex} className="text-xs bg-slate-600/50 px-2 py-1 rounded">
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {index === session.currentPositionIndex && (
                        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-orange-400/30">
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-orange-300">Position actuelle</span>
                        </div>
                      )}
                      
                      {session.usedPositions.includes(index) && index !== session.currentPositionIndex && (
                        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-600">
                          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                          <span className="text-xs text-slate-400">Déjà explorée</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>{karmaSutraPositions.length} positions disponibles</span>
                    <span>Session #{session.sessionCount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default KarmaSutraGame;
