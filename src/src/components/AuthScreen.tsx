import React, { useState } from 'react';
import { ArrowLeft, KeyRound, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthScreenProps {
  onComplete: () => void;
  onGuest: () => void;
  onBack: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onComplete, onGuest, onBack }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = mode === 'login'
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({ email: email.trim(), password });

      if (result.error) {
        setError(mode === 'login' ? 'Email ou mot de passe incorrect.' : 'Impossible de créer le compte avec ces informations.');
        return;
      }

      onComplete();
    } catch (cause) {
      console.error('auth request failed', cause);
      setError('La connexion est momentanément indisponible. Réessayez dans un instant.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="mb-6 p-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors mobile-button touch-action-none">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/15 flex items-center justify-center mb-5">
            {mode === 'login' ? <KeyRound className="w-7 h-7 text-sky-300" /> : <UserPlus className="w-7 h-7 text-sky-300" />}
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Votre espace privé</h1>
          <p className="text-slate-400 leading-relaxed mb-7">Retrouvez vos extensions, vos accès et vos achats sur tous vos appareils.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm text-slate-300 font-medium">Adresse email</span>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                <input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="w-full rounded-xl bg-slate-900 border border-slate-700 text-white pl-11 pr-4 py-3.5 outline-none focus:border-sky-400" autoComplete="email" />
              </div>
            </label>
            <label className="block">
              <span className="text-sm text-slate-300 font-medium">Mot de passe</span>
              <div className="relative mt-2">
                <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                <input required minLength={8} type="password" value={password} onChange={event => setPassword(event.target.value)} className="w-full rounded-xl bg-slate-900 border border-slate-700 text-white pl-11 pr-4 py-3.5 outline-none focus:border-sky-400" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
              </div>
            </label>
            {error && <p role="alert" className="rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm p-3">{error}</p>}
            <button disabled={isLoading} className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold transition-colors mobile-button touch-action-none">
              {isLoading ? 'Connexion en cours…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }} className="w-full mt-5 text-sky-300 hover:text-sky-200 text-sm font-medium transition-colors">
            {mode === 'login' ? 'Créer un compte gratuitement' : 'J’ai déjà un compte'}
          </button>
          <button onClick={onGuest} className="w-full mt-3 text-slate-400 hover:text-white text-sm transition-colors">Continuer sans compte</button>

          <div className="mt-7 pt-5 border-t border-slate-700 flex gap-3 text-xs text-slate-500 leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Vos achats et vos droits sont associés à votre compte et protégés par les règles de sécurité du service.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
