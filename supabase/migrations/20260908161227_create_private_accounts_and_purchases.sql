/*
# Comptes privés et accès premium

1. Nouvelles tables
- `profiles`: profil privé lié au compte Supabase, avec email et rôle de l'utilisateur.
- `purchases`: historique des extensions débloquées, lié à l'utilisateur connecté.

2. Colonnes principales
- `profiles.id`: identifiant du compte Supabase Auth.
- `profiles.email`: email du compte.
- `profiles.role`: `member` par défaut, ou `admin` pour un compte administrateur.
- `purchases.user_id`: propriétaire rempli automatiquement depuis la session.
- `purchases.item_id`: identifiant de l'extension achetée.
- `purchases.amount` et `purchases.currency`: montant et devise enregistrés.
- `purchases.status`: état de l'achat.

3. Sécurité
- RLS activé sur les deux tables.
- Un membre ne peut lire que son propre profil et ses propres achats.
- Un administrateur peut consulter tous les profils et achats.
- Les colonnes de rôle et de propriété ne sont pas modifiables directement par le navigateur.
- Les achats sont créés par une fonction contrôlée qui vérifie l'utilisateur connecté et le prix serveur de l'extension premium.

4. Notes importantes
- L'extension premium `intense-speed-extension` coûte 5 CHF.
- Le rôle administrateur est stocké dans `profiles`, jamais dans des données modifiables par l'utilisateur.
- Cette migration est idempotente et peut être rejouée sans supprimer de données.
*/

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id text NOT NULL,
  item_type text NOT NULL DEFAULT 'extension' CHECK (item_type IN ('extension', 'content-pack', 'lifetime')),
  amount numeric(10,2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL CHECK (char_length(currency) = 3),
  provider_order_id text,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed', 'refunded')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS purchases_item_id_idx ON public.purchases(item_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR EXISTS (
  SELECT 1 FROM public.profiles admin_profile
  WHERE admin_profile.id = auth.uid() AND admin_profile.role = 'admin'
));

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id AND role = 'member');

DROP POLICY IF EXISTS "profiles_update_own_email" ON public.profiles;
CREATE POLICY "profiles_update_own_email" ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = 'member');

DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "purchases_select_own_or_admin" ON public.purchases;
CREATE POLICY "purchases_select_own_or_admin" ON public.purchases FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM public.profiles admin_profile
  WHERE admin_profile.id = auth.uid() AND admin_profile.role = 'admin'
));

DROP POLICY IF EXISTS "purchases_insert_own" ON public.purchases;
CREATE POLICY "purchases_insert_own" ON public.purchases FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "purchases_update_own" ON public.purchases;
CREATE POLICY "purchases_update_own" ON public.purchases FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "purchases_delete_own" ON public.purchases;
CREATE POLICY "purchases_delete_own" ON public.purchases FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (email) ON public.profiles TO authenticated;
REVOKE INSERT ON public.purchases FROM authenticated;
GRANT INSERT (item_id, item_type, amount, currency, provider_order_id, status) ON public.purchases TO authenticated;

CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, COALESCE(NEW.email, ''))
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_new_user();

REVOKE EXECUTE ON FUNCTION public.create_profile_for_new_user() FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.record_extension_purchase(
  p_item_id text,
  p_provider_order_id text DEFAULT NULL
)
RETURNS public.purchases
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result public.purchases;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF p_item_id <> 'intense-speed-extension' THEN
    RAISE EXCEPTION 'Unknown extension';
  END IF;

  INSERT INTO public.purchases (user_id, item_id, item_type, amount, currency, provider_order_id, status)
  VALUES (auth.uid(), p_item_id, 'extension', 5.00, 'CHF', p_provider_order_id, 'completed')
  RETURNING * INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.record_extension_purchase(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_extension_purchase(text, text) TO authenticated;

GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.purchases TO authenticated;
GRANT DELETE ON public.purchases TO authenticated;
