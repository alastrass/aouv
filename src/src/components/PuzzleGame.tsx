import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeft, Upload, Play, Copy, Check, Home, Users, Trophy, RotateCcw, Puzzle, Image as ImageIcon } from 'lucide-react';
import { PuzzleGameState, PuzzleSession, PuzzlePiece, PuzzleDifficulty } from '../types';

interface PuzzleGameProps {
  onBack: () => void;
}

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
  const [isCreator, setIsCreator] = useState(true);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
              correctX: col * pieceWidth,
              correctY: row * pieceHeight,
              currentX: Math.random() * 400,
              currentY: Math.random() * 400,
              imageData: canvas.toDataURL(),
              isPlaced: false,
              width: pieceWidth,
              height: pieceHeight
            });
          }
        }
        
        // Shuffle pieces
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
    setIsCreator(true);
    setGameState('waiting-player');
  };

  const joinSession = () => {
    if (!playerName.trim() || !inputCode.trim()) return;
    
    // Simulate joining an existing session
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
      originalImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UHV6emxlIERlbW88L3RleHQ+PC9zdmc+',
      gridSize: 3,
      pieces: [],
      isCompleted: false,
      state: 'playing'
    };
    
    setSession(mockSession);
    setSessionCode(inputCode.trim());
    setIsCreator(false);
    setGameState('playing');
  };

  const startGame = () => {
    if (!session) return;
    
    const updatedSession = {
      ...session,
      state: 'playing' as const,
      solver: {
        id: 'solver',
        name: 'Joueur 2',
        connected: true
      }
    };
    
    setSession(updatedSession);
    setGameState('playing');
  };

  const handlePieceMouseDown = (piece: PuzzlePiece, event: React.MouseEvent) => {
    if (!isCreator) { // Only solver can move pieces
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setDraggedPiece(piece);
      setDragOffset({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }
  };

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (draggedPiece && session) {
      const newX = event.clientX - dragOffset.x;
      const newY = event.clientY - dragOffset.y;
      
      const updatedPieces = session.pieces.map(piece =>
        piece.id === draggedPiece.id
          ? { ...piece, currentX: newX, currentY: newY }
          : piece
      );
      
      setSession({ ...session, pieces: updatedPieces });
    }
  }, [draggedPiece, dragOffset, session]);

  const handleMouseUp = useCallback(() => {
    if (draggedPiece && session) {
      // Check if piece is close to correct position (snap to grid)
      const snapThreshold = 30;
      const piece = session.pieces.find(p => p.id === draggedPiece.id);
      
      if (piece) {
        const isNearCorrectPosition = 
          Math.abs(piece.currentX - piece.correctX) < snapThreshold &&
          Math.abs(piece.currentY - piece.correctY) < snapThreshold;
        
        if (isNearCorrectPosition) {
          const updatedPieces = session.pieces.map(p =>
            p.id === piece.id
              ? { ...p, currentX: p.correctX, currentY: p.correctY, isPlaced: true }
              : p
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
      }
    }
    
    setDraggedPiece(null);
  }, [draggedPiece, session]);

  useEffect(() => {
    if (draggedPiece) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedPiece, handleMouseMove, handleMouseUp]);

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
    setDraggedPiece(null);
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

            {/* Mode Selection */}
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

            {/* Player Name */}
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

            {/* Join Code Input */}
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

            {/* Action Button */}
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
            {/* Image Upload */}
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

            {/* Difficulty Selection */}
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

            {/* Create Button */}
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
                {session.pieces.filter(p => p.isPlaced).length} / {session.pieces.length} pièces placées
              </p>
            </div>
            
            <div className="w-16"></div>
          </div>

          {/* Game Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Puzzle Board */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
              <h3 className="text-white font-semibold mb-4 text-center">Zone de reconstruction</h3>
              <div 
                className="relative bg-slate-700/30 rounded-lg mx-auto border-2 border-dashed border-blue-500/30"
                style={{ 
                  width: '300px', 
                  height: '300px',
                  backgroundImage: `url(${session.originalImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.1
                }}
              >
                {session.pieces.filter(piece => piece.isPlaced).map((piece) => (
                  <img
                    key={piece.id}
                    src={piece.imageData}
                    alt={`Pièce ${piece.id}`}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${(piece.currentX / session.pieces[0]?.width) * (300 / session.gridSize)}px`,
                      top: `${(piece.currentY / session.pieces[0]?.height) * (300 / session.gridSize)}px`,
                      width: `${300 / session.gridSize}px`,
                      height: `${300 / session.gridSize}px`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Pieces Pool */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
              <h3 className="text-white font-semibold mb-4 text-center">Pièces disponibles</h3>
              <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {session.pieces.filter(piece => !piece.isPlaced).map((piece) => (
                  <div
                    key={piece.id}
                    className="relative cursor-move hover:scale-105 transition-transform"
                    onMouseDown={(e) => handlePieceMouseDown(piece, e)}
                  >
                    <img
                      src={piece.imageData}
                      alt={`Pièce ${piece.id}`}
                      className="w-full h-auto rounded border-2 border-blue-500/30 hover:border-blue-400"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 text-center">
            <div className="bg-slate-700 rounded-full h-3 max-w-md mx-auto mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(session.pieces.filter(p => p.isPlaced).length / session.pieces.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-blue-300 text-sm">
              Progression : {Math.round((session.pieces.filter(p => p.isPlaced).length / session.pieces.length) * 100)}%
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
              <p className="text-blue-200">Félicitations ! 🎉</p>
            </div>

            {/* Completed Image */}
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
