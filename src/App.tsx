import React, { useState, useEffect } from 'react';
import { AppState, GameType, Player } from './types';
import ErrorBoundary from './components/ErrorBoundary';
import WelcomeScreen from './components/WelcomeScreen';
import AgeVerification from './components/AgeVerification';
import GameSelection from './components/GameSelection';
import TruthOrDareGame from './components/TruthOrDareGame';
import KiffeOuKiffePasGame from './components/KiffeOuKiffePasGame';
import KarmaSutraGame from './components/KarmaSutraGame';
import PuzzleGame from './components/PuzzleGame';
import PaymentStore from './components/PaymentStore';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import PlayerSetup from './components/PlayerSetup';
import GameOverScreen from './components/GameOverScreen';
import { isAgeVerified, setAgeVerified } from './utils/storageUtils';

function App() {
  const [appState, setAppState] = useState<AppState | 'store'>('welcome');
  const [ageVerified, setAgeVerifiedState] = useState(false);
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [targetScore, setTargetScore] = useState<number | null>(null);
  const [prizes, setPrizes] = useState<{ [playerId: number]: { prize: string; isVisible: boolean } } | null>(null);

  // Check age verification on app start
  useEffect(() => {
    const verified = isAgeVerified();
    setAgeVerifiedState(verified);
    if (verified) {
      setAppState('game-selection');
    }
  }, []);

  const handleAgeVerification = (verified: boolean) => {
    setAgeVerifiedState(verified);
    setAgeVerified(verified);
    if (verified) {
      setAppState('game-selection');
    }
  };

  const handleGameSelection = (gameType: GameType) => {
    setCurrentGame(gameType);
    setAppState(gameType);
  };

  const handleBackToGameSelection = () => {
    setCurrentGame(null);
    setAppState('game-selection');
  };

  const handleBackToWelcome = () => {
    setAgeVerifiedState(false);
    setAgeVerified(false);
    setCurrentGame(null);
    setAppState('welcome');
  };

  const handleStoreOpen = () => {
    setAppState('store');
  };

  const handlePlayerSetupComplete = (
    players: Player[],
    category: string,
    customChallenges: any[],
    targetScore: number,
    prizes: { [playerId: number]: { prize: string; isVisible: boolean } }
  ) => {
    setPlayers(players);
    setTargetScore(targetScore);
    setPrizes(prizes);
    setAppState('truth-or-dare'); // Start with Truth or Dare for now
  };

  const handleGameOver = () => {
    setAppState('game-over');
  };

  return (
    <ErrorBoundary>
      <div className="App">
        {renderCurrentScreen()}
        <PWAInstallPrompt />
      </div>
    </ErrorBoundary>
  );

  function renderCurrentScreen() {
    if (!ageVerified) {
      if (appState === 'welcome') {
        return <WelcomeScreen onStart={() => setAppState('age-verification')} />;
      }
      if (appState === 'age-verification') {
        return <AgeVerification onVerify={handleAgeVerification} />;
      }
    }

    if (appState === 'game-selection') {
      return <GameSelection onGameSelect={handleGameSelection} onStoreOpen={handleStoreOpen} />;
    }

    if (appState === 'store') {
      return <PaymentStore onBack={handleBackToGameSelection} />;
    }

    if (appState === 'truth-or-dare') {
      return <TruthOrDareGame onBack={handleBackToGameSelection} onGameOver={handleGameOver} />;
    }

    if (appState === 'kiffe-ou-kiffe-pas') {
      return <KiffeOuKiffePasGame onBack={handleBackToGameSelection} />;
    }

    if (appState === 'karma-sutra') {
      return <KarmaSutraGame onBack={handleBackToGameSelection} />;
    }

    if (appState === 'puzzle') {
      return <PuzzleGame onBack={handleBackToGameSelection} />;
    }

    if (appState === 'game-over') {
      if (!players || targetScore === null || !prizes) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
            <div className="text-center text-white">
              <p>Erreur : Données de jeu manquantes</p>
              <button 
                onClick={handleBackToGameSelection}
                className="mt-4 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
              >
                Retour
              </button>
            </div>
          </div>
        );
      }
      return (
        <GameOverScreen
          players={players}
          targetScore={targetScore}
          prizes={prizes}
          onBack={handleBackToGameSelection}
        />
      );
    }

    return <PlayerSetup onComplete={handlePlayerSetupComplete} />;
  }
}

export default App;