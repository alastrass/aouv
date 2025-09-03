import React, { useState, useEffect } from 'react';
import { Wifi, Copy, Users, Settings, Plus, Trash2, Heart, Check, RefreshCw, Home, UserCheck, Clock, Play } from 'lucide-react';
import { Player, Category, Challenge, CustomChallengeInput, RemoteGameSession } from '../types';

interface RemoteGameSetupProps {
  onComplete: (players: Player[], category: Category, customChallenges: Challenge[], sessionCode: string) => void;
  onBack: () => void;
}

const RemoteGameSetup: React.FC<RemoteGameSetupProps> = ({ onComplete, onBack }) => {
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [sessionCode, setSessionCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [category, setCategory] = useState<Category>('soft');
  const [customChallenges, setCustomChallenges] = useState<Challenge[]>([]);
  const [newChallenge, setNewChallenge] = useState<CustomChallengeInput>({
    type: 'truth',
    category: 'soft',
    text: '',
    recipients: [],
    target: 'both'
  });
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [session, setSession] = useState<RemoteGameSession | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [playerId, setPlayerId] = useState('');

  const generateSessionCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6, i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generatePlayerId = () => {
    return 'player_' + Math.random().toString(36).substr(2, 9);
  };

  useEffect(() => {
    setPlayerId(generatePlayerId());
  }, []);

  const handleCreateSession = () => {
    if (!playerName.trim()) return;
    
    const code = generateSessionCode();
    const newSession: RemoteGameSession = {
      code,
      host: {
        id: playerId,
        name: playerName.trim(),
        connected: true,
        ready: false
      },
      category,
      customChallenges,
      state: 'waiting-guest'
    };
    
    setSession(newSession);
    setSessionCode(code);
    setIsHost(true);
    
    // Simuler l'attente d'un invité
    setTimeout(() => {
      if (newSession.state === 'waiting-guest') {
        const guestSession = {
          ...newSession,
          guest: {
            id: 'guest_' + Math.random().toString(36).substr(2, 9),
            name: 'Joueur Invité',
            connected: true,
            ready: false
          },
          state: 'waiting-ready' as const
        };
        setSession(guestSession);
      }
    }, 3000);
  };

  const handleJoinSession = () => {
    if (!inputCode.trim() || !playerName.trim()) return;
    
    // Simuler la connexion à une session existante
    const joinedSession: RemoteGameSession = {
      code: inputCode.trim(),
      host: {
        id: 'host_' + Math.random().toString(36).substr(2, 9),
        name: 'Hôte',
        connected: true,
        ready: false
      },
      guest: {
        id: playerId,
        name: playerName.trim(),
        connected: true,
        ready: false
      },
      category: 'soft',
      customChallenges: [],
      state: 'waiting-ready'
    };
    
    setSession(joinedSession);
    setSessionCode(inputCode.trim());
    setIsHost(false);
  };

  const handleReady = () => {
    if (!session) return;
    
    const updatedSession = { ...session };
    
    if (isHost && updatedSession.host) {
      updatedSession.host.ready = true;
    } else if (!isHost && updatedSession.guest) {
      updatedSession.guest.ready = true;
    }
    
    // Vérifier si les deux joueurs sont prêts
    const bothReady = updatedSession.host?.ready && updatedSession.guest?.ready;
    if (bothReady) {
      updatedSession.state = 'ready';
      
      // Démarrer le jeu après un court délai
      setTimeout(() => {
        const players: Player[] = [
          { id: 1, name: updatedSession.host!.name, score: 0 },
          { id: 2, name: updatedSession.guest!.name, score: 0 }
        ];
        onComplete(players, updatedSession.category, updatedSession.customChallenges, updatedSession.code);
      }, 2000);
    } else {
      updatedSession.state = 'waiting-ready';
    }
    
    setSession(updatedSession);
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

  const handleAddCustomChallenge = () => {
    if (newChallenge.text.trim()) {
      const challenge: Challenge = {
        id: Date.now() + Math.random(),
        ...newChallenge,
        isCustom: true
      };
      setCustomChallenges(prev => [...prev, challenge]);
      setNewChallenge({
        type: 'truth',
        category: 'soft',
        text: '',
        recipients: [],
        target: 'both'
      });
      setShowCustomForm(false);
    }
  };

  const handleRemoveCustomChallenge = (id: number) => {
    setCustomChallenges(prev => prev.filter(c => c.id !== id));
  };

  const filteredCustomChallenges = customChallenges.filter(c => c.category === category);

  // Zone d'attente commune
  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 safe-area-inset">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Temple</span>
            </button>
            <h2 className="text-lg font-bold text-white">Session à Distance</h2>
            <div className="w-16"></div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-purple-500/20">
            {/* Code de session */}
            <div className="text-center mb-6">
              <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                <p className="text-purple-200 text-sm mb-2">Code de session :</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-600 rounded-lg p-3 font-mono text-2xl text-amber-400 text-center tracking-wider">
                    {sessionCode}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* État de la session */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-4 text-center">État de la connexion</h3>
              
              {/* Statut des joueurs */}
              <div className="space-y-3">
                {/* Hôte */}
                <div className={`p-4 rounded-lg border-2 ${
                  session.host?.connected 
                    ? session.host?.ready 
                      ? 'border-green-500 bg-green-500/20' 
                      : 'border-blue-500 bg-blue-500/20'
                    : 'border-slate-500 bg-slate-500/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        session.host?.connected ? 'bg-green-400' : 'bg-slate-400'
                      }`}></div>
                      <span className="text-white font-medium">
                        {session.host?.name} {isHost && '(Vous)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.host?.ready ? (
                        <div className="flex items-center gap-1 text-green-400">
                          <UserCheck className="w-4 h-4" />
                          <span className="text-xs">Prêt</span>
                        </div>
                      ) : session.host?.connected ? (
                        <div className="flex items-center gap-1 text-blue-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs">En ligne</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs">Hors ligne</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Invité */}
                <div className={`p-4 rounded-lg border-2 ${
                  session.guest?.connected 
                    ? session.guest?.ready 
                      ? 'border-green-500 bg-green-500/20' 
                      : 'border-blue-500 bg-blue-500/20'
                    : 'border-slate-500 bg-slate-500/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        session.guest?.connected ? 'bg-green-400' : 'bg-slate-400'
                      }`}></div>
                      <span className="text-white font-medium">
                        {session.guest?.name || 'En attente...'} {!isHost && session.guest && '(Vous)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.guest?.ready ? (
                        <div className="flex items-center gap-1 text-green-400">
                          <UserCheck className="w-4 h-4" />
                          <span className="text-xs">Prêt</span>
                        </div>
                      ) : session.guest?.connected ? (
                        <div className="flex items-center gap-1 text-blue-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs">En ligne</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-4 h-4 animate-spin" />
                          <span className="text-xs">Connexion...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages d'état */}
            <div className="text-center mb-6">
              {session.state === 'waiting-guest' && (
                <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4">
                  <div className="animate-spin w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-amber-200 text-sm font-medium">
                    En attente d'un second joueur...
                  </p>
                  <p className="text-amber-100 text-xs mt-1">
                    Partagez le code de session avec votre partenaire
                  </p>
                </div>
              )}

              {session.state === 'waiting-ready' && (
                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                  <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-200 text-sm font-medium">
                    Tous les joueurs sont connectés !
                  </p>
                  <p className="text-blue-100 text-xs mt-1">
                    Cliquez sur "Prêt" quand vous êtes prêt à jouer
                  </p>
                </div>
              )}

              {session.state === 'ready' && (
                <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                  <div className="animate-pulse">
                    <Play className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-green-200 text-sm font-medium">
                      Démarrage du jeu...
                    </p>
                    <p className="text-green-100 text-xs mt-1">
                      Tous les joueurs sont prêts !
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3">
              {session.state === 'waiting-ready' && session.guest && (
                <button
                  onClick={handleReady}
                  disabled={
                    (isHost && session.host?.ready) || 
                    (!isHost && session.guest?.ready)
                  }
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed mobile-button touch-action-none flex items-center justify-center gap-2"
                >
                  {((isHost && session.host?.ready) || (!isHost && session.guest?.ready)) ? (
                    <>
                      <Check className="w-5 h-5" />
                      Vous êtes prêt !
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-5 h-5" />
                      Je suis prêt
                    </>
                  )}
                </button>
              )}

              <button
                onClick={onBack}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 mobile-button touch-action-none flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Retour au Temple
              </button>
            </div>

            {/* Informations de session */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <div className="text-center">
                <p className="text-slate-400 text-xs">
                  Mode : {session.category === 'soft' ? 'Soft' : 'Intense'}
                </p>
                {session.customChallenges.length > 0 && (
                  <p className="text-slate-400 text-xs mt-1">
                    {session.customChallenges.length} défi{session.customChallenges.length > 1 ? 's' : ''} personnalisé{session.customChallenges.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interface de configuration initiale
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/20">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Wifi className="w-8 h-8 text-amber-400" />
              <h1 className="text-3xl font-bold text-white">Jeu à Distance</h1>
              <Wifi className="w-8 h-8 text-amber-400" />
            </div>
            <p className="text-purple-200">Connectez-vous avec votre partenaire</p>
          </div>

          {/* Mode Selection */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode('create')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  mode === 'create'
                    ? 'border-purple-400 bg-purple-500/20'
                    : 'border-purple-500/30 bg-slate-700/50 hover:border-purple-400/50'
                }`}
              >
                <Plus className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold">Créer une session</h3>
                <p className="text-purple-200 text-sm mt-1">Générer un code</p>
              </button>
              <button
                onClick={() => setMode('join')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  mode === 'join'
                    ? 'border-amber-400 bg-amber-500/20'
                    : 'border-purple-500/30 bg-slate-700/50 hover:border-purple-400/50'
                }`}
              >
                <Users className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold">Rejoindre</h3>
                <p className="text-purple-200 text-sm mt-1">Entrer un code</p>
              </button>
            </div>
          </div>

          {/* Player Name */}
          <div className="mb-6">
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Votre nom
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              placeholder="Entrez votre nom"
              maxLength={20}
            />
          </div>

          {mode === 'join' && (
            <div className="mb-6">
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Code de session
              </label>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 font-mono text-center text-xl tracking-wider"
                placeholder="XXXXXX"
                maxLength={6}
              />
            </div>
          )}

          {mode === 'create' && (
            <>
              {/* Category Selection */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Mode de Jeu</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setCategory('soft')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      category === 'soft'
                        ? 'border-purple-400 bg-purple-500/20'
                        : 'border-purple-500/30 bg-slate-700/50 hover:border-purple-400/50'
                    }`}
                  >
                    <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold">Mode Soft</h3>
                    <p className="text-purple-200 text-xs mt-1">Romantique et suggestif</p>
                  </button>
                  <button
                    onClick={() => setCategory('intense')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      category === 'intense'
                        ? 'border-red-400 bg-red-500/20'
                        : 'border-purple-500/30 bg-slate-700/50 hover:border-purple-400/50'
                    }`}
                  >
                    <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold">Mode Intense</h3>
                    <p className="text-purple-200 text-xs mt-1">Plus audacieux</p>
                  </button>
                </div>
              </div>

              {/* Custom Challenges */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Défis Personnalisés
                </h2>

                {!showCustomForm ? (
                  <button
                    onClick={() => setShowCustomForm(true)}
                    className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un défi
                  </button>
                ) : (
                  <div className="bg-slate-700/50 rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <select
                        value={newChallenge.type}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, type: e.target.value as 'truth' | 'dare' }))}
                        className="px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                      >
                        <option value="truth">Vérité</option>
                        <option value="dare">Action</option>
                      </select>
                      <select
                        value={newChallenge.category}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, category: e.target.value as Category }))}
                        className="px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                      >
                        <option value="soft">Soft</option>
                        <option value="intense">Intense</option>
                      </select>
                    </div>

                    {/* Recipient Selection */}
                    <div className="mb-3">
                      <label className="block text-purple-200 text-sm font-medium mb-2">
                        Destinataire(s)
                      </label>
                      <div className="flex gap-2">
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={newChallenge.recipients?.includes('self')}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setNewChallenge(prev => ({
                                ...prev,
                                recipients: checked
                                  ? [...(prev.recipients || []), 'self']
                                  : (prev.recipients || []).filter(r => r !== 'self')
                              }));
                            }}
                            className="text-purple-400 rounded focus:ring-purple-400"
                          />
                          <span className="text-purple-300 text-sm">Moi</span>
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={newChallenge.recipients?.includes('other')}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setNewChallenge(prev => ({
                                ...prev,
                                recipients: checked
                                  ? [...(prev.recipients || []), 'other']
                                  : (prev.recipients || []).filter(r => r !== 'other')
                              }));
                            }}
                            className="text-purple-400 rounded focus:ring-purple-400"
                          />
                          <span className="text-purple-300 text-sm">Autre</span>
                        </label>
                      </div>
                    </div>

                    {/* Target Selection */}
                    <div className="mb-3">
                      <label className="block text-purple-200 text-sm font-medium mb-2">
                        Cible
                      </label>
                      <select
                        value={newChallenge.target}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, target: e.target.value as 'player1' | 'player2' | 'both' }))}
                        className="w-full px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                      >
                        <option value="player1">Joueur 1</option>
                        <option value="player2">Joueur 2</option>
                        <option value="both">Les deux joueurs</option>
                      </select>
                    </div>

                    <textarea
                      value={newChallenge.text}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, text: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 resize-none text-sm"
                      placeholder="Votre défi personnalisé..."
                      rows={2}
                      maxLength={150}
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleAddCustomChallenge}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                        disabled={!newChallenge.text.trim()}
                      >
                        Ajouter
                      </button>
                      <button
                        onClick={() => setShowCustomForm(false)}
                        className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-3 rounded-lg transition-colors text-sm"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {filteredCustomChallenges.length > 0 && (
                  <div className="space-y-2">
                    {filteredCustomChallenges.map((challenge) => (
                      <div key={challenge.id} className="bg-slate-700/30 rounded-lg p-2 flex items-center justify-between">
                        <div className="flex-1">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium mr-2 ${
                            challenge.type === 'truth' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {challenge.type === 'truth' ? 'V' : 'A'}
                          </span>
                          <span className="text-purple-300 text-xs">
                            Défi personnalisé masqué
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveCustomChallenge(challenge.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 px-4 rounded-lg transition-colors"
            >
              Retour
            </button>
            <button
              onClick={mode === 'create' ? handleCreateSession : handleJoinSession}
              disabled={!playerName.trim() || (mode === 'join' && !inputCode.trim())}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            >
              {mode === 'create' ? 'Créer la session' : 'Rejoindre'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoteGameSetup;
