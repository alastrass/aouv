import React from 'react';
import { Heart, Play, Download, Smartphone } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { isInstallable, isInstalled, installApp } = usePWA();

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      console.log('Application installée avec succès');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8 safe-area-inset">
      <div className="max-w-sm w-full text-center">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-purple-500/20">
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-rose-400" />
              <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-rose-400" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white text-center leading-tight">Le temple des plaisirs...</h1>
          </div>
          
          <p className="text-purple-200 mb-6 text-base sm:text-lg leading-relaxed">
            Plusieurs jeux intimes conçus spécialement pour ne pas avoir de limites comme les autres applications disponibles. Du lourd, vous allez transpirer !
          </p>
          
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
            <p className="text-amber-200 text-xs sm:text-sm font-medium">
              ⚠️ Contenu réservé aux adultes (18+)
            </p>
            <p className="text-amber-100 text-xs mt-1 sm:mt-2">
              Ce jeu contient du contenu à caractère intime destiné exclusivement aux adultes consentants.
            </p>
          </div>
          
          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 active:from-purple-700 active:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg active:shadow-xl flex items-center justify-center gap-3 mobile-button touch-action-none"
          >
            <Play className="w-5 h-5" />
            Commencer à jouer
          </button>
          
          {/* PWA Install Button */}
          {isInstallable && !isInstalled && (
            <button
              onClick={handleInstall}
              className="w-full mt-3 bg-gradient-to-r from-amber-600 to-orange-600 active:from-amber-700 active:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg active:shadow-xl flex items-center justify-center gap-3 mobile-button touch-action-none"
            >
              <Download className="w-4 h-4" />
              Installer l'application
            </button>
          )}
          
          {isInstalled && (
            <div className="mt-3 bg-green-900/30 border border-green-500/50 rounded-lg p-3">
              <div className="flex items-center justify-center gap-2">
                <Smartphone className="w-4 h-4 text-green-400" />
                <p className="text-green-200 text-xs font-medium">
                  Application installée !
                </p>
              </div>
            </div>
          )}
          
          <p className="text-purple-300 text-xs mt-4 sm:mt-6">
            En continuant, vous confirmez être majeur(e) et consentant(e)
          </p>
          <p className="text-amber-100 text-xs mt-2">
            Jeu en cours de développement par : Jérôme Joly - 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
