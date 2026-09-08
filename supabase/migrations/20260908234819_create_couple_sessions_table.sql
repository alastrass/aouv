/*
# Sessions à distance pour le jeu Couple (Fantasmes sous couverture)

1. Nouvelle table
- `couple_sessions` : stocke l'état d'une session à distance entre deux joueurs.
- `id` (uuid, clé primaire)
- `code` (text, unique, code à 6 caractères pour rejoindre)
- `host_id` (text, identifiant du joueur hôte)
- `host_name` (text, nom du joueur hôte)
- `host_fantasies` (text[], fantasmes saisis par l'hôte)
- `host_done` (boolean, hôte a terminé sa saisie)
- `host_vote` (text, vote de l'hôte pour la carte courante: 'validate' | 'pass' | null)
- `guest_id` (text, identifiant du joueur invité)
- `guest_name` (text, nom du joueur invité)
- `guest_fantasies` (text[], fantasmes saisis par l'invité)
- `guest_done` (boolean, invité a terminé sa saisie)
- `guest_vote` (text, vote de l'invité pour la carte courante: 'validate' | 'pass' | null)
- `period_friendly` (boolean, mode douceur)
- `deck` (jsonb, paquet de cartes mélangé)
- `current_index` (int, index de la carte courante)
- `matches` (jsonb, liste des matchs)
- `phase` (text, phase du jeu: 'waiting' | 'input' | 'ready' | 'voting' | 'results')
- `vote_phase` (text, sous-phase de vote: 'p1' | 'p2' | 'reveal')
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

2. Sécurité
- RLS activé.
- Lecture/écriture pour anon et authenticated (la session est identifiée par son code, pas par un user_id).
- Pas de politique restrictive: les deux joueurs accèdent à la même ligne via le code.

3. Notes
- La session est créée par l'hôte qui obtient un code à partager.
- L'invité rejoint avec le code.
- Les deux joueurs voient les mises à jour en temps réel via Supabase realtime.
*/

CREATE TABLE IF NOT EXISTS public.couple_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  host_id text NOT NULL,
  host_name text NOT NULL,
  host_fantasies text[] NOT NULL DEFAULT '{}',
  host_done boolean NOT NULL DEFAULT false,
  host_vote text,
  guest_id text,
  guest_name text,
  guest_fantasies text[] NOT NULL DEFAULT '{}',
  guest_done boolean NOT NULL DEFAULT false,
  guest_vote text,
  period_friendly boolean NOT NULL DEFAULT false,
  deck jsonb NOT NULL DEFAULT '[]',
  current_index integer NOT NULL DEFAULT 0,
  matches jsonb NOT NULL DEFAULT '[]',
  phase text NOT NULL DEFAULT 'waiting',
  vote_phase text NOT NULL DEFAULT 'p1',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.couple_sessions ENABLE ROW LEVEL SECURITY;

-- Pas de restriction: la session est identifiée par son code, pas par un user_id.
-- Les deux joueurs (anon ou authenticated) accèdent à la même ligne.
DROP POLICY IF EXISTS "couple_sessions_all" ON public.couple_sessions;
CREATE POLICY "couple_sessions_all" ON public.couple_sessions
  FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION public.update_couple_sessions_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS couple_sessions_updated_at ON public.couple_sessions;
CREATE TRIGGER couple_sessions_updated_at
  BEFORE UPDATE ON public.couple_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_couple_sessions_updated_at();

REVOKE ALL ON FUNCTION public.update_couple_sessions_updated_at() FROM PUBLIC;

-- Permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.couple_sessions TO anon, authenticated;

-- Index
CREATE INDEX IF NOT EXISTS couple_sessions_code_idx ON public.couple_sessions(code);

-- Activer realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.couple_sessions;

-- Nettoyage automatique des sessions de plus de 24h (via pg_cron si disponible, sinon manuel)
-- Pas de pg_cron ici pour éviter les dépendances.
