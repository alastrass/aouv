import { PaymentPlan } from '../types/payment';

export const paymentPlans: PaymentPlan[] = [
  {
    id: 'lifetime-premium',
    name: 'Accès à Vie Premium',
    description: 'Débloquez tous les contenus actuels et futurs pour toujours',
    price: 19.99,
    currency: 'EUR',
    type: 'lifetime',
    features: [
      'Accès illimité à tous les jeux',
      'Tous les packs de contenu inclus',
      'Nouveaux contenus gratuits à vie',
      'Mode hors ligne',
      'Support prioritaire',
      'Aucun abonnement requis'
    ]
  },
  {
    id: 'weekly-premium',
    name: 'Premium Hebdomadaire',
    description: 'Abonnement hebdomadaire pour accéder à tous les contenus premium',
    price: 2.99,
    currency: 'EUR',
    type: 'subscription',
    interval: 'week',
    features: [
      'Accès à tous les jeux premium',
      'Nouveaux packs de contenu',
      'Mode multijoueur en ligne',
      'Statistiques avancées',
      'Annulation à tout moment'
    ]
  }
];
