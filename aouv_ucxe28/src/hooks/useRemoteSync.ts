import { useState, useEffect, useCallback } from 'react';

export interface RemoteSession {
  id: string;
  host: {
    id: string;
    name: string;
    connected: boolean;
    ready: boolean;
  };
  guest?: {
    id: string;
    name: string;
    connected: boolean;
    ready: boolean;
  };
  state: 'waiting' | 'ready' | 'playing' | 'finished';
  data: any;
  lastUpdate: number;
}

export interface RemoteMessage {
  type: 'join' | 'ready' | 'update' | 'disconnect';
  sessionId: string;
  playerId: string;
  data?: any;
  timestamp: number;
}

export const useRemoteSync = (sessionId?: string) => {
  const [session, setSession] = useState<RemoteSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [playerId] = useState(() => 'player_' + Math.random().toString(36).substr(2, 9));
  const [isHost, setIsHost] = useState(false);

  // Générer un code de session unique
  const generateSessionCode = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  // Créer une nouvelle session
  const createSession = useCallback((hostName: string, initialData: any = {}) => {
    const code = generateSessionCode();
    const newSession: RemoteSession = {
      id: code,
      host: {
        id: playerId,
        name: hostName,
        connected: true,
        ready: false
      },
      state: 'waiting',
      data: initialData,
      lastUpdate: Date.now()
    };

    localStorage.setItem(`remote_session_${code}`, JSON.stringify(newSession));
    setSession(newSession);
    setIsHost(true);
    setIsConnected(true);
    
    return code;
  }, [playerId, generateSessionCode]);

  // Rejoindre une session existante
  const joinSession = useCallback((code: string, guestName: string) => {
    const sessionData = localStorage.getItem(`remote_session_${code}`);
    if (!sessionData) {
      throw new Error('Session non trouvée');
    }

    const existingSession: RemoteSession = JSON.parse(sessionData);
    if (existingSession.guest) {
      throw new Error('Session déjà complète');
    }

    const updatedSession: RemoteSession = {
      ...existingSession,
      guest: {
        id: playerId,
        name: guestName,
        connected: true,
        ready: false
      },
      state: 'ready',
      lastUpdate: Date.now()
    };

    localStorage.setItem(`remote_session_${code}`, JSON.stringify(updatedSession));
    setSession(updatedSession);
    setIsHost(false);
    setIsConnected(true);

    // Notifier l'hôte
    sendMessage({
      type: 'join',
      sessionId: code,
      playerId,
      data: { guestName },
      timestamp: Date.now()
    });

    return updatedSession;
  }, [playerId]);

  // Envoyer un message
  const sendMessage = useCallback((message: RemoteMessage) => {
    localStorage.setItem(`remote_message_${Date.now()}_${Math.random()}`, JSON.stringify(message));
    
    // Nettoyer les anciens messages (garder seulement les 10 derniers)
    const allKeys = Object.keys(localStorage).filter(key => key.startsWith('remote_message_'));
    if (allKeys.length > 10) {
      allKeys.sort().slice(0, -10).forEach(key => localStorage.removeItem(key));
    }
  }, []);

  // Mettre à jour la session
  const updateSession = useCallback((updates: Partial<RemoteSession['data']>) => {
    if (!session) return;

    const updatedSession: RemoteSession = {
      ...session,
      data: { ...session.data, ...updates },
      lastUpdate: Date.now()
    };

    localStorage.setItem(`remote_session_${session.id}`, JSON.stringify(updatedSession));
    setSession(updatedSession);

    // Notifier l'autre joueur
    sendMessage({
      type: 'update',
      sessionId: session.id,
      playerId,
      data: updates,
      timestamp: Date.now()
    });
  }, [session, playerId, sendMessage]);

  // Marquer comme prêt
  const setReady = useCallback((ready: boolean = true) => {
    if (!session) return;

    const updatedSession: RemoteSession = {
      ...session,
      host: isHost ? { ...session.host, ready } : session.host,
      guest: !isHost && session.guest ? { ...session.guest, ready } : session.guest,
      lastUpdate: Date.now()
    };

    // Vérifier si les deux joueurs sont prêts
    if (updatedSession.host.ready && updatedSession.guest?.ready) {
      updatedSession.state = 'playing';
    }

    localStorage.setItem(`remote_session_${session.id}`, JSON.stringify(updatedSession));
    setSession(updatedSession);

    sendMessage({
      type: 'ready',
      sessionId: session.id,
      playerId,
      data: { ready },
      timestamp: Date.now()
    });
  }, [session, isHost, playerId, sendMessage]);

  // Écouter les changements de localStorage (simulation WebSocket)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key) return;

      // Écouter les messages
      if (e.key.startsWith('remote_message_') && e.newValue) {
        const message: RemoteMessage = JSON.parse(e.newValue);
        
        // Ignorer nos propres messages
        if (message.playerId === playerId) return;
        
        // Traiter seulement les messages pour notre session
        if (session && message.sessionId === session.id) {
          handleRemoteMessage(message);
        }
      }

      // Écouter les changements de session
      if (session && e.key === `remote_session_${session.id}` && e.newValue) {
        const updatedSession: RemoteSession = JSON.parse(e.newValue);
        setSession(updatedSession);
      }
    };

    const handleRemoteMessage = (message: RemoteMessage) => {
      switch (message.type) {
        case 'join':
          // Recharger la session pour voir le nouvel invité
          if (session) {
            const sessionData = localStorage.getItem(`remote_session_${session.id}`);
            if (sessionData) {
              setSession(JSON.parse(sessionData));
            }
          }
          break;
        case 'ready':
          // La session sera mise à jour via l'événement storage
          break;
        case 'update':
          // La session sera mise à jour via l'événement storage
          break;
        case 'disconnect':
          // Gérer la déconnexion
          break;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [session, playerId]);

  // Nettoyer à la déconnexion
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (session) {
        sendMessage({
          type: 'disconnect',
          sessionId: session.id,
          playerId,
          timestamp: Date.now()
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session, playerId, sendMessage]);

  return {
    session,
    isConnected,
    isHost,
    playerId,
    createSession,
    joinSession,
    updateSession,
    setReady,
    sendMessage
  };
};
