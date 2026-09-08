import React from 'react';
import { ArrowLeft, Check, Crown, LogOut, ShieldCheck, Star } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Purchase {
  id: string;
  item_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

interface AccountScreenProps {
  user: User;
  isAdmin: boolean;
  hasPremiumAccess: boolean;
  purchases: Purchase[];
  onBack: () => void;
  onSignedOut: () => void;
}

const AccountScreen: React.FC<AccountScreenProps> = ({ user, isAdmin, hasPremiumAccess, purchases, onBack, onSignedOut }) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignedOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-8 safe-area-inset">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors mobile-button touch-action-none mb-6"><ArrowLeft className="w-5 h-5" /></button>
        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sky-300 text-sm font-semibold uppercase tracking-widest">Espace privé</p>
              <h1 className="text-3xl font-black text-white mt-1">Mon compte</h1>
              <p className="text-slate-400 mt-2 break-all">{user.email}</p>
            </div>
            <button onClick={handleSignOut} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-700 text-slate-200 hover:bg-rose-900/50 hover:text-rose-200 transition-colors mobile-button touch-action-none"><LogOut className="w-4 h-4" /> Se déconnecter</button>
          </div>

          <div className={`rounded-2xl border p-5 mb-6 ${hasPremiumAccess ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900/50 border-slate-700'}`}>
            <div className="flex items-center gap-3">
              {hasPremiumAccess ? <Crown className="w-6 h-6 text-amber-300" /> : <ShieldCheck className="w-6 h-6 text-slate-400" />}
              <div>
                <h2 className="text-white font-bold">{hasPremiumAccess ? 'Extension Intense & Speed activée' : 'Compte standard'}</h2>
                <p className="text-slate-400 text-sm mt-1">{hasPremiumAccess ? 'Les modes Intense et Speed & Extrême sont disponibles.' : 'Achetez l’extension à 5 CHF pour débloquer les modes avancés.'}</p>
              </div>
            </div>
          </div>

          {isAdmin && <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex items-center gap-3"><Check className="w-6 h-6 text-emerald-300" /><div><h2 className="text-emerald-200 font-bold">Accès administrateur</h2><p className="text-emerald-300/70 text-sm">Toutes les extensions et tous les accès sont activés.</p></div></div>}

          <div>
            <div className="flex items-center gap-2 mb-4"><Star className="w-5 h-5 text-sky-300" /><h2 className="text-white font-bold text-lg">Mes extensions</h2></div>
            {purchases.length === 0 ? <p className="rounded-xl bg-slate-900/60 p-4 text-slate-500 text-sm">Aucune extension achetée pour le moment.</p> : <div className="space-y-3">{purchases.map(purchase => <div key={purchase.id} className="rounded-xl bg-slate-900/60 border border-slate-700 p-4 flex items-center justify-between gap-4"><div><p className="text-white font-semibold">{purchase.item_id === 'intense-speed-extension' ? 'Extension Intense & Speed' : purchase.item_id}</p><p className="text-slate-500 text-xs mt-1">{new Date(purchase.created_at).toLocaleDateString('fr-CH')}</p></div><span className="text-emerald-300 text-sm font-bold">{purchase.amount} {purchase.currency}</span></div>)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountScreen;
