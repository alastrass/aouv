import React, { useState, useEffect } from 'react';
import { AppState, GameType, Player } from './types';
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

function App() {
  const [appState, setAppState] = useState<AppState | 'store'>('welcome');
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [targetScore, setTargetScore] = useState<number | null>(null);
  const [prizes, setPrizes] = useState<{ [playerId: number]: { prize: string; isVisible: boolean } } | null>(null);

  const handleAgeVerification = (verified: boolean) => {
    setIsAgeVerified(verified);
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
    setIsAgeVerified(false);
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

  if (!isAgeVerified) {
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
      return <div>Error: Game data missing</div>;
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

export default App;
