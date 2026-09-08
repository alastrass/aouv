import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Plus, Trash2, Edit3, Eye, EyeOff, X, Check, Newspaper } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewsItem {
  id: string;
  title: string;
  body: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface AdminNewsScreenProps {
  onBack: () => void;
}

const AdminNewsScreen: React.FC<AdminNewsScreenProps> = ({ onBack }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '', is_published: false, sort_order: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(false);
    const { data, error: fetchError } = await supabase
      .from('news')
      .select('id, title, body, is_published, sort_order, created_at, updated_at')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('admin news fetch failed', fetchError);
      setError(true);
    } else {
      setNews(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const openCreateForm = () => {
    setEditing(null);
    setFormData({ title: '', body: '', is_published: false, sort_order: 0 });
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (item: NewsItem) => {
    setEditing(item);
    setFormData({ title: item.title, body: item.body, is_published: item.is_published, sort_order: item.sort_order });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormError(null);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.body.trim()) {
      setFormError('Le titre et le contenu sont obligatoires.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    if (editing) {
      const { error: updateError } = await supabase
        .from('news')
        .update({
          title: formData.title.trim(),
          body: formData.body.trim(),
          is_published: formData.is_published,
          sort_order: formData.sort_order,
        })
        .eq('id', editing.id);

      if (updateError) {
        setFormError(updateError.message);
        setSubmitting(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from('news').insert({
        title: formData.title.trim(),
        body: formData.body.trim(),
        is_published: formData.is_published,
        sort_order: formData.sort_order,
      });

      if (insertError) {
        setFormError(insertError.message);
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    closeForm();
    fetchNews();
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase.from('news').delete().eq('id', id);
    if (deleteError) {
      console.error('delete failed', deleteError);
      return;
    }
    fetchNews();
  };

  const togglePublish = async (item: NewsItem) => {
    const { error: updateError } = await supabase
      .from('news')
      .update({ is_published: !item.is_published })
      .eq('id', item.id);
    if (updateError) {
      console.error('toggle publish failed', updateError);
      return;
    }
    fetchNews();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 safe-area-inset">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Retour</span>
            </button>
            <div className="flex items-center gap-3">
              <Newspaper className="w-6 h-6 text-amber-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">Gestion des nouveautés</h1>
            </div>
          </div>
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 active:bg-emerald-700 text-white rounded-lg transition-colors mobile-button touch-action-none"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Nouvelle</span>
          </button>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-purple-200 text-sm">Chargement…</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-2xl p-6 text-center">
            <p className="text-red-200">Impossible de charger les nouveautés. Vérifiez votre connexion et réessayez.</p>
          </div>
        )}

        {!loading && !error && news.length === 0 && !showForm && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-purple-500/20">
            <Newspaper className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-purple-200 mb-4">Aucune nouveauté pour le moment.</p>
            <button
              onClick={openCreateForm}
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors mobile-button touch-action-none"
            >
              <Plus className="w-5 h-5" />
              Créer la première actualité
            </button>
          </div>
        )}

        {!loading && !error && news.length > 0 && (
          <div className="space-y-4">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-purple-500/20 shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          item.is_published
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-600/30 text-slate-400 border border-slate-600'
                        }`}
                      >
                        {item.is_published ? 'Publiée' : 'Brouillon'}
                      </span>
                      <span className="text-purple-300 text-xs">
                        {new Date(item.created_at).toLocaleDateString('fr-CH')}
                      </span>
                      <span className="text-slate-500 text-xs">Ordre {item.sort_order}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 truncate">{item.title}</h3>
                    <p className="text-purple-200 text-sm leading-relaxed line-clamp-2 whitespace-pre-line">{item.body}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-purple-500/10">
                  <button
                    onClick={() => togglePublish(item)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors mobile-button touch-action-none ${
                      item.is_published
                        ? 'bg-slate-600 hover:bg-slate-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {item.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {item.is_published ? 'Dépublier' : 'Publier'}
                  </button>
                  <button
                    onClick={() => openEditForm(item)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-medium transition-colors mobile-button touch-action-none"
                  >
                    <Edit3 className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors mobile-button touch-action-none"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl shadow-2xl border border-purple-500/30 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-purple-500/20">
              <h2 className="text-lg font-bold text-white">{editing ? 'Modifier' : 'Nouvelle actualité'}</h2>
              <button
                onClick={closeForm}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  placeholder="Titre de l'actualité"
                  maxLength={120}
                />
              </div>
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">Contenu</label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData((prev) => ({ ...prev, body: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
                  placeholder="Contenu de l'actualité…"
                  rows={6}
                  maxLength={2000}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Ordre d'affichage</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  />
                  <p className="text-slate-400 text-xs mt-1">Plus petit = affiché en premier</p>
                </div>
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">Statut</label>
                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, is_published: !prev.is_published }))}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-colors mobile-button touch-action-none ${
                      formData.is_published
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-600 text-slate-300'
                    }`}
                  >
                    {formData.is_published ? 'Publiée' : 'Brouillon'}
                  </button>
                </div>
              </div>
              {formError && (
                <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
                  {formError}
                </div>
              )}
            </div>
            <div className="flex gap-3 p-5 border-t border-purple-500/20">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors mobile-button touch-action-none"
              >
                <Check className="w-5 h-5" />
                {submitting ? 'Enregistrement…' : editing ? 'Enregistrer' : 'Créer'}
              </button>
              <button
                onClick={closeForm}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 rounded-xl transition-colors mobile-button touch-action-none"
              >
                <X className="w-5 h-5" />
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsScreen;
