-- Database schema for payment and user management
-- This is a PostgreSQL schema example

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false
);

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  interval_type VARCHAR(20) NOT NULL, -- 'week', 'month', 'year', 'lifetime'
  interval_count INTEGER DEFAULT 1,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) REFERENCES subscription_plans(id),
  paypal_subscription_id VARCHAR(255) UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'active', 'cancelled', 'expired', 'pending'
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content packs table
CREATE TABLE IF NOT EXISTS content_packs (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  theme VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  questions_count INTEGER NOT NULL DEFAULT 50,
  truths_count INTEGER NOT NULL DEFAULT 50,
  difficulty VARCHAR(20) NOT NULL DEFAULT 'soft', -- 'soft', 'intense', 'extreme'
  preview_content JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User purchases table (for one-time purchases like content packs and lifetime access)
CREATE TABLE IF NOT EXISTS user_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_id VARCHAR(50) NOT NULL, -- content pack id or 'lifetime-premium'
  item_type VARCHAR(20) NOT NULL, -- 'content-pack', 'lifetime'
  paypal_order_id VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'completed', 'pending', 'failed', 'refunded'
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content pack challenges table
CREATE TABLE IF NOT EXISTS content_pack_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id VARCHAR(50) REFERENCES content_packs(id) ON DELETE CASCADE,
  challenge_type VARCHAR(10) NOT NULL, -- 'truth', 'dare'
  category VARCHAR(20) NOT NULL, -- 'soft', 'intense', 'extreme'
  text TEXT NOT NULL,
  difficulty_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User unlocked content table (tracks what content each user has access to)
CREATE TABLE IF NOT EXISTS user_unlocked_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_type VARCHAR(20) NOT NULL, -- 'content-pack', 'lifetime'
  content_id VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- NULL for lifetime access
  UNIQUE(user_id, content_type, content_id)
);

-- Payment transactions log table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  paypal_transaction_id VARCHAR(255) UNIQUE NOT NULL,
  transaction_type VARCHAR(20) NOT NULL, -- 'purchase', 'subscription', 'refund'
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(20) NOT NULL,
  paypal_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_status ON user_purchases(status);
CREATE INDEX IF NOT EXISTS idx_user_unlocked_content_user_id ON user_unlocked_content(user_id);
CREATE INDEX IF NOT EXISTS idx_content_pack_challenges_pack_id ON content_pack_challenges(pack_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, description, price, currency, interval_type, features) VALUES
('lifetime-premium', 'Accès à Vie Premium', 'Débloquez tous les contenus actuels et futurs pour toujours', 19.99, 'EUR', 'lifetime', 
 '["Accès illimité à tous les jeux", "Tous les packs de contenu inclus", "Nouveaux contenus gratuits à vie", "Mode hors ligne", "Support prioritaire", "Aucun abonnement requis"]'::jsonb),
('weekly-premium', 'Premium Hebdomadaire', 'Abonnement hebdomadaire pour accéder à tous les contenus premium', 2.99, 'EUR', 'week',
 '["Accès à tous les jeux premium", "Nouveaux packs de contenu", "Mode multijoueur en ligne", "Statistiques avancées", "Annulation à tout moment"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert default content packs
INSERT INTO content_packs (id, name, theme, description, price, currency, difficulty, preview_content) VALUES
('voyeur-pack', 'Pack Voyeur', 'Voyeur', 'Explorez vos fantasmes de voyeurisme avec 100 défis spécialement conçus pour les couples aventureux.', 4.99, 'EUR', 'intense',
 '["Raconte-moi ton fantasme de voyeurisme le plus secret", "Regarde-moi me déshabiller lentement", "Décris ce que tu aimerais voir ton partenaire faire"]'::jsonb),
('outdoor-pack', 'Pack Outdoor', 'Outdoor', 'Sortez de votre zone de confort avec des défis en plein air pour pimenter votre relation.', 4.99, 'EUR', 'intense',
 '["Quel endroit en plein air te fait le plus fantasmer ?", "Embrasse-moi passionnément sous les étoiles", "Raconte-moi ton rêve d\'aventure en pleine nature"]'::jsonb),
('exhibition-pack', 'Pack Exhibition', 'Exhibition', 'Pour les couples qui aiment être vus et admirés. Défis audacieux pour exhibitionnistes.', 5.99, 'EUR', 'extreme',
 '["Aimerais-tu être regardé pendant nos ébats ?", "Montre-moi ton corps comme si on était observés", "Décris ton fantasme d\'exhibition le plus fou"]'::jsonb),
('hands-free-pack', 'Pack Hands-Free', 'Hands-free', 'Découvrez le plaisir sans les mains. Défis créatifs pour explorer de nouvelles sensations.', 4.99, 'EUR', 'intense',
 '["Comment peux-tu me faire plaisir sans utiliser tes mains ?", "Utilise seulement ta bouche pour me séduire", "Trouve une façon créative de me caresser sans les mains"]'::jsonb),
('romantic-pack', 'Pack Romantique', 'Romantic', 'Pour les moments tendres et romantiques. Défis doux pour renforcer votre connexion émotionnelle.', 3.99, 'EUR', 'soft',
 '["Quel est ton souvenir le plus romantique avec moi ?", "Écris-moi une lettre d\'amour de 3 lignes", "Danse avec moi sur notre chanson préférée"]'::jsonb),
('kinky-pack', 'Pack Kinky', 'Kinky', 'Pour les couples expérimentés qui veulent explorer leurs limites. Contenu très audacieux.', 6.99, 'EUR', 'extreme',
 '["Quel est ton kink secret que tu n\'as jamais avoué ?", "Utilise cet accessoire pour me faire plaisir", "Montre-moi ta position de domination préférée"]'::jsonb)
ON CONFLICT (id) DO NOTHING;
