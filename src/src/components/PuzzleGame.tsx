import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Upload, Copy, Check, Home, Users, Trophy, RotateCcw, Puzzle, Image as ImageIcon, Sparkles } from 'lucide-react';
import { PuzzleGameState, PuzzleSession, PuzzlePiece, PuzzleDifficulty } from '../types';

interface PuzzleGameProps {
  onBack: () => void;
}

const BOARD_SIZE = 300;

const PuzzleGame: React.FC<PuzzleGameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<PuzzleGameState>('session-setup');
  const [sessionMode, setSessionMode] = useState<'create' | 'join'>('create');
  const [playerName, setPlayerName] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [session, setSession] = useState<PuzzleSession | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<PuzzleDifficulty>({ gridSize: 3, label: 'Facile', pieces: 9 });
  const [copied, setCopied] = useState(false);
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const difficulties: PuzzleDifficulty[] = [
    { gridSize: 3, label: 'Facile', pieces: 9 },
    { gridSize: 4, label: 'Moyen', pieces: 16 },
    { gridSize: 5, label: 'Difficile', pieces: 25 },
    { gridSize: 6, label: 'Expert', pieces: 36 }
  ];

  const generateSessionCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const createPuzzlePieces = useCallback((imageData: string, gridSize: number): Promise<PuzzlePiece[]> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        const pieceWidth = Math.floor(img.width / gridSize);
        const pieceHeight = Math.floor(img.height / gridSize);

        canvas.width = pieceWidth;
        canvas.height = pieceHeight;

        const pieces: PuzzlePiece[] = [];

        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            ctx.clearRect(0, 0, pieceWidth, pieceHeight);
            ctx.drawImage(
              img,
              col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight,
              0, 0, pieceWidth, pieceHeight
            );

            pieces.push({
              id: row * gridSize + col,
              correctX: col,
              correctY: row,
              currentX: 0,
              currentY: 0,
              imageData: canvas.toDataURL(),
              isPlaced: false,
              width: pieceWidth,
              height: pieceHeight
            });
          }
        }

        for (let i = pieces.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
        }

        resolve(pieces);
      };
      img.src = imageData;
    });
  }, []);

  const createSession = async () => {
    if (!playerName.trim() || !selectedImage) return;

    const code = generateSessionCode();
    const pieces = await createPuzzlePieces(selectedImage, selectedDifficulty.gridSize);

    const newSession: PuzzleSession = {
      code,
      creator: {
        id: 'creator',
        name: playerName.trim(),
        connected: true
      },
      originalImage: selectedImage,
      gridSize: selectedDifficulty.gridSize,
      pieces,
      isCompleted: false,
      state: 'waiting',
      startTime: Date.now()
    };

    setSession(newSession);
    setSessionCode(code);
    setGameState('waiting-player');
  };

  const joinSession = () => {
    if (!playerName.trim() || !inputCode.trim()) return;

    const mockSession: PuzzleSession = {
      code: inputCode.trim(),
      creator: {
        id: 'creator',
        name: 'Créateur',
        connected: true
      },
      solver: {
        id: 'solver',
        name: playerName.trim(),
        connected: true
      },
      originalImage: '',
      gridSize: 3,
      pieces: [],
      isCompleted: false,
      state: 'playing'
    };

    setSession(mockSession);
    setSessionCode(inputCode.trim());
    setGameState('playing');
  };

  const startGame = () => {
    if (!session) return;

    const updatedSession: PuzzleSession = {
      ...session,
      state: 'playing',
      solver: {
        id: 'solver',
        name: 'Joueur 2',
        connected: true
      }
    };

    setSession(updatedSession);
    setGameState('playing');
  };

  const handlePieceClick = (pieceId: number) => {
    setSelectedPieceId(pieceId);
  };

  const handleBoardCellClick = (row: number, col: number) => {
    if (selectedPieceId === null || !session) return;

    const piece = session.pieces.find(p => p.id === selectedPieceId);
    if (!piece) return;

    if (piece.correctX === col && piece.correctY === row) {
      const updatedPieces = session.pieces.map(p =>
        p.id === piece.id ? { ...p, isPlaced: true } : p
      );

      const allPlaced = updatedPieces.every(p => p.isPlaced);

      setSession({
        ...session,
        pieces: updatedPieces,
        isCompleted: allPlaced,
        state: allPlaced ? 'completed' : 'playing',
        endTime: allPlaced ? Date.now() : undefined
      });

      if (allPlaced) {
        setGameState('completed');
      }
    }

    setSelectedPieceId(null);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sessionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const resetGame = () => {
    setGameState('session-setup');
    setSession(null);
    setSelectedImage('');
    setPlayerName('');
    setInputCode('');
    setSelectedPieceId(null);
  };

  // Session Setup Screen
  if (gameState === 'session-setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4 py-8 safe-area-inset">
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

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-blue-500/20">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Puzzle className="w-8 h-8 text-blue-400" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Puzzle !</h1>
                <Puzzle className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-blue-200 text-sm">Créez et résolvez des puzzles personnalisés</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setSessionMode('create')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  sessionMode === 'create'
                    ? 'border-blue-400 bg-blue-500/20'
                    : 'border-blue-500/30 bg-slate-700/50 hover:border-blue-400/50'
                }`}
              >
                <ImageIcon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-sm">Créer</h3>
                <p className="text-blue-200 text-xs mt-1">Puzzle personnalisé</p>
              </button>
              <button
                onClick={() => setSessionMode('join')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  sessionMode === 'join'
                    ? 'border-cyan-400 bg-cyan-500/20'
                    : 'border-blue-500/30 bg-slate-700/50 hover:border-blue-400/50'
                }`}
              >
                <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-sm">Rejoindre</h3>
                <p className="text-blue-200 text-xs mt-1">Résoudre un puzzle</p>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Votre nom
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-blue-500/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                placeholder="Entrez votre nom"
                maxLength={20}
              />
            </div>

            {sessionMode === 'join' && (
              <div className="mb-6">
                <label className="block text-blue-200 text-sm font-medium mb-2">
                  Code de session
                </label>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-slate-700 border border-blue-500/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 font-mono text-center text-xl tracking-wider"
                  placeholder="XXXXXX"
                  maxLength={6}
                />
              </div>
            )}

            <button
              onClick={sessionMode === 'create' ? () => setGameState('image-selection') : joinSession}
              disabled={!playerName.trim() || (sessionMode === 'join' && !inputCode.trim())}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed mobile-button touch-action-none"
            >
              {sessionMode === 'create' ? 'Continuer' : 'Rejoindre'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Image Selection Screen
  if (gameState === 'image-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4 py-8 safe-area-inset">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setGameState('session-setup')}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Retour</span>
            </button>
            <h2 className="text-lg font-bold text-white">Créer un Puzzle</h2>
            <div className="w-16"></div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-blue-500/20">
            <div className="mb-6">
              <label className="block text-blue-200 text-sm font-medium mb-3">
                Choisissez votre image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-blue-500/50 rounded-lg p-8 hover:border-blue-400 transition-colors"
              >
                {selectedImage ? (
                  <div className="text-center">
                    <img
                      src={selectedImage}
                      alt="Image sélectionnée"
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-3"
                    />
                    <p className="text-blue-300 text-sm">Image sélectionnée</p>
                    <p className="text-blue-400 text-xs mt-1">Cliquez pour changer</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                    <p className="text-blue-300 text-sm">Cliquez pour choisir une image</p>
                    <p className="text-blue-400 text-xs mt-1">JPG, PNG, WebP acceptés</p>
                  </div>
                )}
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-blue-200 text-sm font-medium mb-3">
                Niveau de difficulté
              </label>
              <div className="grid grid-cols-2 gap-3">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.gridSize}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      selectedDifficulty.gridSize === difficulty.gridSize
                        ? 'border-blue-400 bg-blue-500/20'
                        : 'border-blue-500/30 bg-slate-700/50 hover:border-blue-400/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-white mb-1">
                        {difficulty.label}
                      </div>
                      <div className="text-blue-300 text-sm">
                        {difficulty.pieces} pièces
                      </div>
                      <div className="text-blue-400 text-xs mt-1">
                        {difficulty.gridSize}×{difficulty.gridSize}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={createSession}
              disabled={!selectedImage}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed mobile-button touch-action-none flex items-center justify-center gap-2"
            >
              <Puzzle className="w-5 h-5" />
              Créer le puzzle
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Waiting for Player Screen
  if (gameState === 'waiting-player') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-blue-500/20">
            <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>

            <h2 className="text-2xl font-bold text-white mb-4">En attente du joueur...</h2>

            <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
              <p className="text-blue-200 text-sm mb-3">Code de session :</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-600 rounded-lg p-3 font-mono text-2xl text-cyan-400 text-center tracking-wider">
                  {sessionCode}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  title="Copier le code"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <p className="text-blue-200 text-sm mb-6">
              Partagez ce code avec la personne qui va résoudre votre puzzle
            </p>

            <div className="space-y-3">
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 mobile-button touch-action-none"
              >
                Commencer (Mode Démo)
              </button>
              <button
                onClick={onBack}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white py-3 px-4 rounded-lg transition-colors"
              >
                Retour au Temple
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  if (gameState === 'playing' && session) {
    const cellSize = BOARD_SIZE / session.gridSize;
    const placedCount = session.pieces.filter(p => p.isPlaced).length;
    const availablePieces = session.pieces.filter(p => !p.isPlaced);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4 py-8 safe-area-inset">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Temple</span>
            </button>

            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Puzzle !</h1>
              <p className="text-blue-200 text-sm">
                {placedCount} / {session.pieces.length} pièces placées
              </p>
            </div>

            <div className="w-16"></div>
          </div>

          {/* Game Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Puzzle Board — no image preview, just empty grid */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
              <h3 className="text-white font-semibold mb-4 text-center">Zone de reconstruction</h3>
              <div
                className="relative mx-auto border-2 border-dashed border-blue-500/30 rounded-lg overflow-hidden"
                style={{ width: `${BOARD_SIZE}px`, height: `${BOARD_SIZE}px` }}
              >
                {Array.from({ length: session.gridSize * session.gridSize }).map((_, idx) => {
                  const row = Math.floor(idx / session.gridSize);
                  const col = idx % session.gridSize;
                  const pieceInCell = session.pieces.find(p => p.isPlaced && p.correctX === col && p.correctY === row);
                  const isHighlighted = selectedPieceId !== null && !pieceInCell;

                  return (
                    <div
                      key={idx}
                      onClick={() => !pieceInCell && handleBoardCellClick(row, col)}
                      className={`absolute border border-slate-600/30 transition-colors ${
                        pieceInCell ? '' : isHighlighted ? 'bg-blue-500/20 hover:bg-blue-500/40 cursor-pointer' : 'cursor-pointer'
                      }`}
                      style={{
                        left: `${col * cellSize}px`,
                        top: `${row * cellSize}px`,
                        width: `${cellSize}px`,
                        height: `${cellSize}px`
                      }}
                    >
                      {pieceInCell && (
                        <img
                          src={pieceInCell.imageData}
                          alt={`Pièce ${pieceInCell.id}`}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-blue-300 text-xs text-center mt-3">
                {selectedPieceId !== null
                  ? 'Cliquez sur la case où placer cette pièce'
                  : 'Sélectionnez une pièce ci-dessous'}
              </p>
            </div>

            {/* Pieces Pool */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
              <h3 className="text-white font-semibold mb-4 text-center">Pièces disponibles</h3>
              {availablePieces.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                  <p className="text-blue-200 text-sm">Toutes les pièces sont placées !</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                  {availablePieces.map((piece) => (
                    <button
                      key={piece.id}
                      onClick={() => handlePieceClick(piece.id)}
                      className={`relative rounded border-2 transition-all duration-200 mobile-button touch-action-none ${
                        selectedPieceId === piece.id
                          ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                          : 'border-blue-500/30 hover:border-blue-400'
                      }`}
                      style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`
                      }}
                    >
                      <img
                        src={piece.imageData}
                        alt={`Pièce ${piece.id}`}
                        className="w-full h-full object-cover rounded"
                        draggable={false}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 text-center">
            <div className="bg-slate-700 rounded-full h-3 max-w-md mx-auto mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(placedCount / session.pieces.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-blue-300 text-sm">
              Progression : {Math.round((placedCount / session.pieces.length) * 100)}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Completed Screen
  if (gameState === 'completed' && session) {
    const duration = session.endTime && session.startTime
      ? Math.round((session.endTime - session.startTime) / 1000)
      : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4 py-8 safe-area-inset">
        <div className="max-w-md mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-blue-500/20">
            <div className="text-center mb-8">
              <Trophy className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Puzzle Résolu !</h1>
              <p className="text-blue-200">Félicitations !</p>
            </div>

            {/* Completed Image — revealed only here as a surprise */}
            <div className="mb-6">
              <img
                src={session.originalImage}
                alt="Puzzle complété"
                className="w-full max-w-xs mx-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl p-6 mb-6 text-center">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">{session.pieces.length}</div>
                  <p className="text-white text-sm">Pièces</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</div>
                  <p className="text-white text-sm">Temps</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 mobile-button touch-action-none flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Nouveau puzzle
              </button>
              <button
                onClick={onBack}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 mobile-button touch-action-none flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Retour au Temple
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PuzzleGame;
