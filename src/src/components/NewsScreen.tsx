import React, { useEffect, useState } from 'react';
import { ArrowLeft, Newspaper, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewsItem {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

interface NewsScreenProps {
  onBack: () => void;
}

const NewsScreen: React.FC<NewsScreenProps> = ({ onBack }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error: fetchError } = await supabase
        .from('news')
        .select('id, title, body, created_at')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('news fetch failed', fetchError);
        setError(true);
      } else {
        setNews(data ?? []);
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 safe-area-inset">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour</span>
          </button>
          <div className="flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">Nouveautés</h1>
          </div>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-purple-200 text-sm">Chargement des nouveautés…</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-2xl p-6 text-center">
            <p className="text-red-200">Impossible de charger les nouveautés. Vérifiez votre connexion et réessayez.</p>
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-purple-500/20">
            <Newspaper className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-purple-200">Aucune nouveauté pour le moment. Revenez bientôt !</p>
          </div>
        )}

        {!loading && !error && news.length > 0 && (
          <div className="space-y-6">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-500/20 shadow-2xl"
              >
                <div className="flex items-center gap-2 text-purple-300 text-xs mb-3">
                  <Calendar className="w-4 h-4" />
                  {new Date(item.created_at).toLocaleDateString('fr-CH', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{item.title}</h2>
                <p className="text-purple-100 text-sm sm:text-base leading-relaxed whitespace-pre-line">{item.body}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsScreen;
