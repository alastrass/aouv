import React, { useState, useEffect } from 'react';
import { ArrowLeft, Crown, Star, Lock, Unlock, Check, ShoppingCart, CreditCard, Calendar, Infinity } from 'lucide-react';
import { usePayPal } from '../hooks/usePayPal';
import { contentPacks } from '../data/contentPacks';
import { paymentPlans } from '../data/paymentPlans';
import { ContentPack, PaymentPlan } from '../types/payment';

interface PaymentStoreProps {
  onBack: () => void;
}

const PaymentStore: React.FC<PaymentStoreProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'packs'>('plans');
  const [selectedPack, setSelectedPack] = useState<ContentPack | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const {
    paymentState,
    isSDKLoaded,
    purchaseContentPack,
    purchaseLifetimeAccess,
    subscribeWeeklyPremium,
    hasLifetimeAccess,
    isContentPackUnlocked
  } = usePayPal();

  const handlePurchasePack = async (pack: ContentPack) => {
    if (!isSDKLoaded) {
      alert('PayPal n\'est pas encore chargé. Veuillez patienter...');
      return;
    }

    setSelectedPack(pack);
    setShowPayment(true);
    
    try {
      await purchaseContentPack(pack.id, pack.price);
      alert(`Pack "${pack.name}" acheté avec succès !`);
      setShowPayment(false);
      setSelectedPack(null);
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Erreur lors de l\'achat. Veuillez réessayer.');
      setShowPayment(false);
    }
  };

  const handlePurchasePlan = async (plan: PaymentPlan) => {
    if (!isSDKLoaded) {
      alert('PayPal n\'est pas encore chargé. Veuillez patienter...');
      return;
    }

    setSelectedPlan(plan);
    setShowPayment(true);

    try {
      if (plan.type === 'lifetime') {
        await purchaseLifetimeAccess(plan.price);
        alert('Accès à vie activé avec succès !');
      } else if (plan.type === 'subscription') {
        await subscribeWeeklyPremium(plan.id);
        alert('Abonnement premium activé !');
      }
      setShowPayment(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Erreur lors de l\'achat. Veuillez réessayer.');
      setShowPayment(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'soft': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'intense': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'extreme': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 safe-area-inset">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-amber-400" />
              Boutique Premium
            </h1>
            <p className="text-purple-200 text-sm">Débloquez du contenu exclusif</p>
          </div>
          
          <div className="w-16"></div>
        </div>

        {/* Lifetime Access Banner */}
        {hasLifetimeAccess() && (
          <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/50 rounded-2xl p-6 mb-8 text-center">
            <Crown className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-amber-300 mb-2">Accès Premium à Vie Activé !</h2>
            <p className="text-amber-100 text-sm">
              Vous avez accès à tous les contenus actuels et futurs sans limitation.
            </p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex bg-slate-800/50 rounded-xl p-1 mb-8 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${
              activeTab === 'plans'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4 inline mr-2" />
            Abonnements
          </button>
          <button
            onClick={() => setActiveTab('packs')}
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${
              activeTab === 'packs'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Star className="w-4 h-4 inline mr-2" />
            Packs de Contenu
          </button>
        </div>

        {/* Payment Plans Tab */}
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {paymentPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 ${
                  plan.type === 'lifetime'
                    ? 'border-amber-500/50 shadow-amber-500/20 shadow-lg'
                    : 'border-purple-500/30 hover:border-purple-400/50'
                }`}
              >
                <div className="text-center mb-6">
                  {plan.type === 'lifetime' ? (
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4">
                      <Infinity className="w-8 h-8 text-white" />
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-purple-200 text-sm mb-4">{plan.description}</p>
                  
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-white">{plan.price}€</span>
                    {plan.interval && (
                      <span className="text-purple-300 text-sm">/{plan.interval === 'week' ? 'semaine' : 'mois'}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-purple-200 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePurchasePlan(plan)}
                  disabled={paymentState.isLoading || (plan.type === 'lifetime' && hasLifetimeAccess())}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 mobile-button touch-action-none ${
                    plan.type === 'lifetime'
                      ? hasLifetimeAccess()
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {paymentState.isLoading ? (
                    'Traitement...'
                  ) : plan.type === 'lifetime' && hasLifetimeAccess() ? (
                    <>
                      <Check className="w-4 h-4 inline mr-2" />
                      Déjà Acheté
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 inline mr-2" />
                      {plan.type === 'lifetime' ? 'Acheter' : 'S\'abonner'}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Content Packs Tab */}
        {activeTab === 'packs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentPacks.map((pack) => {
              const isUnlocked = isContentPackUnlocked(pack.id);
              const isLifetime = hasLifetimeAccess();
              
              return (
                <div
                  key={pack.id}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 ${
                    isUnlocked || isLifetime
                      ? 'border-green-500/50 shadow-green-500/20 shadow-lg'
                      : 'border-purple-500/30 hover:border-purple-400/50'
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className="relative inline-block mb-3">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        isUnlocked || isLifetime
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}>
                        {isUnlocked || isLifetime ? (
                          <Unlock className="w-8 h-8 text-white" />
                        ) : (
                          <Lock className="w-8 h-8 text-white" />
                        )}
                      </div>
                      
                      <div className={`absolute -top-1 -right-1 px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(pack.difficulty)}`}>
                        {pack.difficulty.charAt(0).toUpperCase() + pack.difficulty.slice(1)}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{pack.name}</h3>
                    <p className="text-purple-200 text-sm mb-3">{pack.description}</p>
                    
                    <div className="flex justify-center gap-4 text-xs text-purple-300 mb-4">
                      <span>{pack.questionsCount} Vérités</span>
                      <span>•</span>
                      <span>{pack.truthsCount} Actions</span>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
                    <h4 className="text-white font-medium text-sm mb-2">Aperçu :</h4>
                    <div className="space-y-1">
                      {pack.preview.slice(0, 2).map((preview, index) => (
                        <p key={index} className="text-purple-200 text-xs italic">
                          "• {preview}"
                        </p>
                      ))}
                      <p className="text-purple-300 text-xs">
                        ... et {pack.questionsCount + pack.truthsCount - 2} autres défis !
                      </p>
                    </div>
                  </div>

                  {/* Price and Purchase */}
                  <div className="text-center">
                    {isLifetime ? (
                      <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3 mb-3">
                        <Crown className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <p className="text-green-300 text-sm font-medium">Inclus dans votre accès à vie</p>
                      </div>
                    ) : isUnlocked ? (
                      <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3 mb-3">
                        <Check className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <p className="text-green-300 text-sm font-medium">Pack Débloqué</p>
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-white mb-3">
                          {pack.price}€
                        </div>
                        <button
                          onClick={() => handlePurchasePack(pack)}
                          disabled={paymentState.isLoading}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed mobile-button touch-action-none"
                        >
                          {paymentState.isLoading ? (
                            'Traitement...'
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 inline mr-2" />
                              Acheter
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PayPal Payment Container */}
        {showPayment && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-white font-semibold text-lg mb-4 text-center">
                Finaliser l'achat
              </h3>
              
              {selectedPack && (
                <div className="text-center mb-6">
                  <p className="text-purple-200 mb-2">{selectedPack.name}</p>
                  <p className="text-2xl font-bold text-white">{selectedPack.price}€</p>
                </div>
              )}
              
              {selectedPlan && (
                <div className="text-center mb-6">
                  <p className="text-purple-200 mb-2">{selectedPlan.name}</p>
                  <p className="text-2xl font-bold text-white">
                    {selectedPlan.price}€
                    {selectedPlan.interval && <span className="text-sm">/{selectedPlan.interval === 'week' ? 'sem' : 'mois'}</span>}
                  </p>
                </div>
              )}

              <div id="paypal-button-container" className="mb-4"></div>
              <div id="paypal-subscription-container" className="mb-4"></div>
              
              <button
                onClick={() => {
                  setShowPayment(false);
                  setSelectedPack(null);
                  setSelectedPlan(null);
                }}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {paymentState.error && (
          <div className="fixed bottom-4 right-4 bg-red-900/90 border border-red-500/50 text-red-100 p-4 rounded-lg max-w-sm">
            <p className="text-sm">{paymentState.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStore;
