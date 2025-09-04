import React, { useState } from 'react';
import { Shield, AlertTriangle, Check, X } from 'lucide-react';

interface AgeVerificationProps {
  onVerify: (isVerified: boolean) => void;
}

const AgeVerification: React.FC<AgeVerificationProps> = ({ onVerify }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirm = () => {
    onVerify(true);
  };

  const handleDeny = () => {
    onVerify(false);
    alert("Accès refusé. Ce contenu est réservé aux adultes.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8 safe-area-inset">
      <div className="max-w-sm w-full text-center">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-purple-500/20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-amber-400" />
            <h1 className="text-xl sm:text-3xl font-bold text-white">Vérification d'âge</h1>
          </div>
          
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-red-200 font-semibold mb-2 sm:mb-3 text-lg sm:text-xl">Contenu pour Adultes</h2>
            <p className="text-red-100 text-xs sm:text-sm leading-relaxed">
              Ce jeu contient du contenu à caractère intime et suggestif destiné exclusivement 
              aux personnes majeures. L'accès est strictement réservé aux adultes consentants.
            </p>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Conditions d'accès :</h3>
            <ul className="text-purple-200 text-xs sm:text-sm space-y-1 sm:space-y-2 text-left">
              <li>• Vous devez être âgé(e) de 18 ans ou plus</li>
              <li>• Vous jouez en couple avec une personne consentante</li>
              <li>• Vous acceptez la nature intime du contenu</li>
              <li>• Vous respectez les limites de votre partenaire</li>
            </ul>
          </div>
          
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-purple-200 font-medium mb-4">
              Confirmez-vous avoir 18 ans ou plus et consentir à accéder à ce contenu ?
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleDeny}
              className="flex-1 bg-red-600 active:bg-red-700 text-white font-semibold py-4 px-4 sm:px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mobile-button touch-action-none"
            >
              <X className="w-5 h-5" />
              <span className="text-sm sm:text-base">Non, j'ai moins de 18 ans</span>
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-green-600 active:bg-green-700 text-white font-semibold py-4 px-4 sm:px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mobile-button touch-action-none"
            >
              <Check className="w-5 h-5" />
              <span className="text-sm sm:text-base">Oui, j'ai 18 ans ou plus</span>
            </button>
          </div>
          
          <p className="text-purple-300 text-xs mt-4 sm:mt-6">
            En confirmant, vous certifiez sur l'honneur être majeur(e) et consentant(e)
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerification;
