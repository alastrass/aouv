import React, { useState, useEffect } from 'react';
import { AppState, GameType, Player } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import AgeVerification from './components/AgeVerification';
import GameSelection from './components/GameSelection';
import TruthOrDareGame from './components/TruthOrDareGame';
import KiffeOuKiffePasGame from './components/KiffeOuKiffePasGame';
import KarmaSutraGame from './components/KarmaSutraGame';
import PuzzleGame from './components/PuzzleGame';
import StopTergiverserGame from './components/StopTergiverserGame';
import PaymentStore from './components/PaymentStore';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import PlayerSetup from './components/PlayerSetup';
import GameOverScreen from './components/GameOverScreen';
import PresentationGuide from './components/PresentationGuide';
import ClassicGame from './components/ClassicGame';
import CoupleGame from './components/CoupleGame';

function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [targetScore, setTargetScore] = useState<number | string | null>(null);
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

  const handleClassicOpen = () => {
    setAppState('classic');
  };

  const handleCoupleOpen = () => {
    setAppState('couple');
  };

  const handleStoreOpen = () => {
    setAppState('store');
  };

  const handleGuideOpen = () => {
    setAppState('guide');
  };

  const handlePlayerSetupComplete = (
    players: Player[],
    category: string,
    customChallenges: any[],
    targetScore: number | string,
    prizes: { [playerId: number]: { prize: string; isVisible: boolean } }
  ) => {
    setPlayers(players);
    setTargetScore(targetScore);
    setPrizes(prizes);
    if (currentGame) {
      setAppState(currentGame);
    }
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
    return <GameSelection onGameSelect={handleGameSelection} onStoreOpen={handleStoreOpen} onGuideOpen={handleGuideOpen} onClassicOpen={handleClassicOpen} onCoupleOpen={handleCoupleOpen} />;
  }

  if (appState === 'guide') {
    return <PresentationGuide onBack={handleBackToGameSelection} />;
  }

  if (appState === 'store') {
    return <PaymentStore onBack={handleBackToGameSelection} />;
  }

  if (appState === 'truth-or-dare') {
    return <TruthOrDareGame onBack={handleBackToGameSelection} onGameOver={handleGameOver} targetScore={targetScore} prizes={prizes} />;
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

  if (appState === 'classic') {
    return <ClassicGame onBack={handleBackToGameSelection} />;
  }

  if (appState === 'couple') {
    return <CoupleGame onBack={handleBackToGameSelection} />;
  }

  if (appState === 'stop-tergiverser') {
    return <StopTergiverserGame onBack={handleBackToGameSelection} onGameOver={handleGameOver} targetScore={targetScore} prizes={prizes} />;
  }

  if (appState === 'game-over') {
    if (!players || targetScore === null || !prizes) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/20 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Erreur</h1>
            <p className="text-purple-200 mb-6">Données de jeu manquantes</p>
            <button
              onClick={handleBackToGameSelection}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all"
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

export default App;
