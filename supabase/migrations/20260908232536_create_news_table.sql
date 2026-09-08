/*
# Table des nouveautés / actualités

1. Nouvelle table
- `news` : contient les actualités affichées aux utilisateurs.
- `id` (uuid, clé primaire)
- `title` (text, titre de l'actualité)
- `body` (text, contenu de l'actualité)
- `is_published` (boolean, indique si l'actualité est visible par les utilisateurs)
- `sort_order` (int, ordre d'affichage, plus petit = plus récent en premier)
- `created_at` (timestamptz, date de création)
- `updated_at` (timestamptz, date de dernière modification)

2. Sécurité
- RLS activé sur `news`.
- Lecture publique (anon + authenticated) limitée aux actualités publiées (`is_published = true`).
- Écriture (insert, update, delete) réservée aux administrateurs (via `profiles.role = 'admin'`).
- Aucune modification possible par les utilisateurs non-admin.

3. Notes
- Les administrateurs peuvent créer, modifier, supprimer et publier/dépublier des actualités.
- Les utilisateurs (connectés ou non) ne voient que les actualités publiées, triées par `sort_order` puis `created_at`.
*/

CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Lecture publique : tout le monde peut lire les actualités publiées
DROP POLICY IF EXISTS "news_select_published" ON public.news;
CREATE POLICY "news_select_published" ON public.news FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Lecture admin : les admins peuvent lire toutes les actualités (y compris non publiées)
DROP POLICY IF EXISTS "news_select_admin" ON public.news;
CREATE POLICY "news_select_admin" ON public.news FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles admin_profile
    WHERE admin_profile.id = auth.uid() AND admin_profile.role = 'admin'
  ));

-- Insert admin uniquement
DROP POLICY IF EXISTS "news_insert_admin" ON public.news;
CREATE POLICY "news_insert_admin" ON public.news FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles admin_profile
    WHERE admin_profile.id = auth.uid() AND admin_profile.role = 'admin'
  ));

-- Update admin uniquement
DROP POLICY IF EXISTS "news_update_admin" ON public.news;
CREATE POLICY "news_update_admin" ON public.news FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles admin_profile
    WHERE admin_profile.id = auth.uid() AND admin_profile.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles admin_profile
    WHERE admin_profile.id = auth.uid() AND admin_profile.role = 'admin'
  ));

-- Delete admin uniquement
DROP POLICY IF EXISTS "news_delete_admin" ON public.news;
CREATE POLICY "news_delete_admin" ON public.news FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles admin_profile
    WHERE admin_profile.id = auth.uid() AND admin_profile.role = 'admin'
  ));

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_news_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS news_updated_at ON public.news;
CREATE TRIGGER news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.update_news_updated_at();

REVOKE ALL ON FUNCTION public.update_news_updated_at() FROM PUBLIC;

-- Permissions
REVOKE ALL ON public.news FROM anon;
REVOKE ALL ON public.news FROM PUBLIC;
GRANT SELECT ON public.news TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.news TO authenticated;

-- Index pour le tri
CREATE INDEX IF NOT EXISTS news_sort_order_idx ON public.news(sort_order);
CREATE INDEX IF NOT EXISTS news_is_published_idx ON public.news(is_published);
