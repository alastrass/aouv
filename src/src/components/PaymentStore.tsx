import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Crown, Star, Lock, Unlock, Check, ShoppingCart,
  CreditCard, Calendar, Infinity, ChevronRight, X
} from 'lucide-react';
import { contentPacks } from '../data/contentPacks';
import { paymentPlans } from '../data/paymentPlans';
import { ContentPack, PaymentPlan } from '../types/payment';

interface PaymentStoreProps {
  onBack: () => void;
}

// ── Premium state (localStorage, no backend) ─────────────────────────────────
const PREMIUM_KEY = 'hasLifetimeAccess';
const PACKS_KEY   = 'unlockedContentPacks';

function getUnlockedPacks(): string[] {
  try { return JSON.parse(localStorage.getItem(PACKS_KEY) ?? '[]'); } catch { return []; }
}
function unlockPack(id: string) {
  const cur = getUnlockedPacks();
  if (!cur.includes(id)) localStorage.setItem(PACKS_KEY, JSON.stringify([...cur, id]));
}
function setLifetimeAccess() { localStorage.setItem(PREMIUM_KEY, 'true'); }
function hasLifetime() { return localStorage.getItem(PREMIUM_KEY) === 'true'; }

// ── Difficulty badge config ───────────────────────────────────────────────────
const DIFF_STYLES: Record<string, { badge: string }> = {
  soft:    { badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
  intense: { badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  extreme: { badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
};

// ── Simulated purchase modal ──────────────────────────────────────────────────
interface ModalItem { name: string; price: number; interval?: string; onSuccess: () => void }

const PurchaseModal: React.FC<{ item: ModalItem; onCancel: () => void }> = ({ item, onCancel }) => {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm');

  const handleConfirm = () => {
    setStep('processing');
    setTimeout(() => setStep('success'), 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-slide-up">

        {step === 'confirm' && (
          <>
            <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-b border-slate-700 px-6 py-5 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Finaliser l'achat</h3>
              <button onClick={onCancel} className="p-1.5 rounded-lg bg-slate-700 text-slate-300 mobile-button touch-action-none"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-slate-700/50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{item.name}</p>
                  {item.interval && <p className="text-slate-400 text-xs mt-0.5">Renouvellement hebdomadaire</p>}
                </div>
                <p className="text-2xl font-black text-white">
                  {item.price}€
                  {item.interval && <span className="text-sm text-slate-400 font-normal">/sem</span>}
                </p>
              </div>
              <div className="space-y-2">
                {['Paiement sécurisé simulé', 'Aucune carte bancaire réelle requise', 'Démo d\'intégration PayPal'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-slate-400 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />{t}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={onCancel} className="py-3 rounded-xl bg-slate-700 text-slate-300 font-semibold hover:bg-slate-600 transition-colors mobile-button touch-action-none">Annuler</button>
                <button onClick={handleConfirm} className="py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold hover:opacity-90 flex items-center justify-center gap-2 mobile-button touch-action-none">
                  <CreditCard className="w-4 h-4" />Confirmer
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div className="p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin mb-5" />
            <p className="text-white font-semibold text-lg">Traitement en cours…</p>
            <p className="text-slate-400 text-sm mt-1">Simulation du paiement</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-10 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-5 animate-challenge-pop">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-white font-black text-2xl mb-2">Débloqué !</h3>
            <p className="text-slate-400 text-sm mb-6">{item.name} est maintenant accessible.</p>
            <button onClick={item.onSuccess} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:opacity-90 mobile-button touch-action-none">Continuer</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const PaymentStore: React.FC<PaymentStoreProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'packs'>('plans');
  const [isPremium, setIsPremium] = useState(false);
  const [unlockedPacks, setUnlockedPacks] = useState<string[]>([]);
  const [purchaseTarget, setPurchaseTarget] = useState<ModalItem | null>(null);
  const [expandedPack, setExpandedPack] = useState<string | null>(null);

  useEffect(() => {
    setIsPremium(hasLifetime());
    setUnlockedPacks(getUnlockedPacks());
  }, []);

  const isPackUnlocked = (id: string) => isPremium || unlockedPacks.includes(id);

  const handleBuyPack = (pack: ContentPack) => {
    setPurchaseTarget({
      name: pack.name,
      price: pack.price,
      onSuccess: () => {
        unlockPack(pack.id);
        setUnlockedPacks(getUnlockedPacks());
        setPurchaseTarget(null);
      },
    });
  };

  const handleBuyPlan = (plan: PaymentPlan) => {
    setPurchaseTarget({
      name: plan.name,
      price: plan.price,
      interval: plan.interval,
      onSuccess: () => {
        if (plan.type === 'lifetime') { setLifetimeAccess(); setIsPremium(true); }
        setPurchaseTarget(null);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 safe-area-inset">
      {purchaseTarget && <PurchaseModal item={purchaseTarget} onCancel={() => setPurchaseTarget(null)} />}

      {/* ── Hero header ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/15 to-transparent pointer-events-none" />
        <div className="relative px-4 pt-6 pb-8">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-700/60 text-slate-300 hover:bg-slate-700 transition-colors mobile-button touch-action-none mb-5">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/30 mb-4 animate-gentle-float">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-1">Boutique Premium</h1>
            <p className="text-slate-400 text-sm">Débloquez du contenu exclusif et tous les niveaux</p>
          </div>

          {isPremium && (
            <div className="mt-5 bg-gradient-to-r from-amber-600/25 to-orange-600/20 border border-amber-500/40 rounded-2xl p-4 flex items-center gap-3 animate-slide-up">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-amber-300 font-bold text-sm">Accès Premium à Vie activé</p>
                <p className="text-amber-400/70 text-xs">Tout le contenu actuel et futur est débloqué.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div className="px-4 mb-6">
        <div className="bg-slate-800/60 rounded-2xl p-1.5 flex border border-slate-700/50">
          {([
            { key: 'plans' as const, label: 'Abonnements', icon: Crown },
            { key: 'packs' as const, label: 'Packs de questions', icon: Star },
          ]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 mobile-button touch-action-none ${
                activeTab === key
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-12">

        {/* ── PLANS ── */}
        {activeTab === 'plans' && (
          <div className="space-y-5 max-w-lg mx-auto">
            {paymentPlans.map((plan, pi) => {
              const isLifetimePlan = plan.type === 'lifetime';
              const alreadyOwned = isLifetimePlan && isPremium;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 animate-slide-up ${
                    isLifetimePlan
                      ? 'border-amber-500/60 bg-gradient-to-br from-amber-900/20 to-slate-800/80'
                      : 'border-slate-600/50 bg-slate-800/60'
                  }`}
                  style={{ animationDelay: `${pi * 0.08}s` }}
                >
                  {isLifetimePlan && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
                        Meilleure valeur
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        isLifetimePlan
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25'
                          : 'bg-gradient-to-br from-slate-600 to-slate-700'
                      }`}>
                        {isLifetimePlan ? <Infinity className="w-7 h-7 text-white" /> : <Calendar className="w-7 h-7 text-slate-300" />}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{plan.name}</h3>
                        <p className="text-slate-400 text-xs mt-0.5">{plan.description}</p>
                      </div>
                    </div>

                    <div className="mb-5">
                      <span className="text-4xl font-black text-white">{plan.price}€</span>
                      {plan.interval && <span className="text-slate-400 text-sm ml-1">/{plan.interval === 'week' ? 'semaine' : 'mois'}</span>}
                      {isLifetimePlan && <span className="ml-2 text-amber-400 text-sm font-semibold">paiement unique</span>}
                    </div>

                    <div className="space-y-2.5 mb-6">
                      {plan.features.map(f => (
                        <div key={f} className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isLifetimePlan ? 'bg-amber-500/20' : 'bg-slate-700'}`}>
                            <Check className={`w-3 h-3 ${isLifetimePlan ? 'text-amber-400' : 'text-emerald-400'}`} />
                          </div>
                          <span className="text-slate-300 text-sm">{f}</span>
                        </div>
                      ))}
                    </div>

                    {alreadyOwned ? (
                      <div className="w-full py-3.5 rounded-xl bg-emerald-900/30 border border-emerald-500/40 flex items-center justify-center gap-2 text-emerald-400 font-semibold text-sm">
                        <Check className="w-4 h-4" /> Déjà acheté
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBuyPlan(plan)}
                        className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 mobile-button touch-action-none active:scale-95 ${
                          isLifetimePlan
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 hover:opacity-90 shadow-lg shadow-amber-500/20'
                            : 'bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-500 hover:to-slate-600 border border-slate-500/50'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        {plan.type === 'lifetime' ? "Acheter l'accès à vie" : "S'abonner"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30 text-center">
              <p className="text-slate-500 text-xs leading-relaxed">
                Paiement sécurisé via PayPal · Annulation à tout moment · Remboursement sous 14 jours
              </p>
            </div>
          </div>
        )}

        {/* ── PACKS ── */}
        {activeTab === 'packs' && (
          <div className="max-w-lg mx-auto space-y-4">
            {!isPremium && (
              <div
                className="bg-gradient-to-r from-amber-900/30 to-orange-900/20 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:border-amber-500/50 transition-colors"
                onClick={() => setActiveTab('plans')}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-amber-300 text-sm font-semibold">Accès à vie — tous les packs inclus</p>
                  <p className="text-amber-400/60 text-xs">Débloquez tout dès 19,99 €</p>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-400 flex-shrink-0" />
              </div>
            )}

            {contentPacks.map((pack, pi) => {
              const unlocked = isPackUnlocked(pack.id);
              const diff = DIFF_STYLES[pack.difficulty] ?? DIFF_STYLES.intense;
              const isExpanded = expandedPack === pack.id;

              return (
                <div
                  key={pack.id}
                  className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 animate-slide-up ${
                    unlocked ? 'border-emerald-500/40 bg-slate-800/60' : 'border-slate-600/40 bg-slate-800/50'
                  }`}
                  style={{ animationDelay: `${pi * 0.06}s` }}
                >
                  <div className="p-5 cursor-pointer" onClick={() => setExpandedPack(isExpanded ? null : pack.id)}>
                    <div className="flex items-center gap-4">
                      <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${unlocked ? 'bg-emerald-500/15' : 'bg-slate-700/60'}`}>
                        {!unlocked && <div className="absolute inset-0 shimmer-locked" />}
                        {unlocked
                          ? <Unlock className="w-7 h-7 text-emerald-400" />
                          : <Lock className="w-7 h-7 text-slate-400" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-white font-bold text-base">{pack.name}</h3>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${diff.badge}`}>
                            {pack.difficulty.charAt(0).toUpperCase() + pack.difficulty.slice(1)}
                          </span>
                          {unlocked && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Débloqué</span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{pack.description}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                    <div className="mt-3 flex gap-3 text-xs text-slate-500">
                      <span>{pack.questionsCount} vérités</span>
                      <span>·</span>
                      <span>{pack.truthsCount} actions</span>
                      <span>·</span>
                      {unlocked
                        ? <span className="text-emerald-400 font-semibold">✓ Inclus</span>
                        : <span className="text-white font-bold">{pack.price}€</span>
                      }
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-slate-700/50 pt-4 space-y-4 animate-slide-up">
                      <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Aperçu</p>
                        <div className="space-y-2">
                          {pack.preview.map((p, i) => (
                            <div key={i} className="flex gap-2 items-start">
                              <span className="text-slate-600 text-xs mt-0.5">•</span>
                              <p className="text-slate-300 text-sm italic">"{p}"</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {isPremium ? (
                        <div className="flex items-center gap-2 bg-amber-900/20 border border-amber-500/30 rounded-xl p-3">
                          <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <p className="text-amber-300 text-sm font-medium">Inclus dans votre accès Premium à vie</p>
                        </div>
                      ) : unlocked ? (
                        <div className="flex items-center gap-2 bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-3">
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <p className="text-emerald-300 text-sm font-medium">Pack déjà débloqué</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBuyPack(pack)}
                          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all mobile-button touch-action-none shadow-lg"
                        >
                          <ShoppingCart className="w-4 h-4" />Acheter pour {pack.price}€
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30 text-center">
              <p className="text-slate-500 text-xs leading-relaxed">
                Paiement sécurisé · Accès permanent après achat · Contenu stocké localement
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStore;
