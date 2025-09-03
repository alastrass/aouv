import { ContentPack } from '../types/payment';
import { Challenge } from '../types';

export const contentPacks: ContentPack[] = [
  {
    id: 'voyeur-pack',
    name: 'Pack Voyeur',
    theme: 'Voyeur',
    description: 'Explorez vos fantasmes de voyeurisme avec 100 défis spécialement conçus pour les couples aventureux.',
    price: 4.99,
    currency: 'EUR',
    questionsCount: 50,
    truthsCount: 50,
    difficulty: 'intense',
    preview: [
      'Raconte-moi ton fantasme de voyeurisme le plus secret',
      'Regarde-moi me déshabiller lentement',
      'Décris ce que tu aimerais voir ton partenaire faire'
    ],
    isPurchased: false,
    isLocked: false
  },
  {
    id: 'outdoor-pack',
    name: 'Pack Outdoor',
    theme: 'Outdoor',
    description: 'Sortez de votre zone de confort avec des défis en plein air pour pimenter votre relation.',
    price: 4.99,
    currency: 'EUR',
    questionsCount: 50,
    truthsCount: 50,
    difficulty: 'intense',
    preview: [
      'Quel endroit en plein air te fait le plus fantasmer ?',
      'Embrasse-moi passionnément sous les étoiles',
      'Raconte-moi ton rêve d\'aventure en pleine nature'
    ],
    isPurchased: false,
    isLocked: false
  },
  {
    id: 'exhibition-pack',
    name: 'Pack Exhibition',
    theme: 'Exhibition',
    description: 'Pour les couples qui aiment être vus et admirés. Défis audacieux pour exhibitionnistes.',
    price: 5.99,
    currency: 'EUR',
    questionsCount: 50,
    truthsCount: 50,
    difficulty: 'extreme',
    preview: [
      'Aimerais-tu être regardé pendant nos ébats ?',
      'Montre-moi ton corps comme si on était observés',
      'Décris ton fantasme d\'exhibition le plus fou'
    ],
    isPurchased: false,
    isLocked: false
  },
  {
    id: 'hands-free-pack',
    name: 'Pack Hands-Free',
    theme: 'Hands-free',
    description: 'Découvrez le plaisir sans les mains. Défis créatifs pour explorer de nouvelles sensations.',
    price: 4.99,
    currency: 'EUR',
    questionsCount: 50,
    truthsCount: 50,
    difficulty: 'intense',
    preview: [
      'Comment peux-tu me faire plaisir sans utiliser tes mains ?',
      'Utilise seulement ta bouche pour me séduire',
      'Trouve une façon créative de me caresser sans les mains'
    ],
    isPurchased: false,
    isLocked: false
  },
  {
    id: 'romantic-pack',
    name: 'Pack Romantique',
    theme: 'Romantic',
    description: 'Pour les moments tendres et romantiques. Défis doux pour renforcer votre connexion émotionnelle.',
    price: 3.99,
    currency: 'EUR',
    questionsCount: 50,
    truthsCount: 50,
    difficulty: 'soft',
    preview: [
      'Quel est ton souvenir le plus romantique avec moi ?',
      'Écris-moi une lettre d\'amour de 3 lignes',
      'Danse avec moi sur notre chanson préférée'
    ],
    isPurchased: false,
    isLocked: false
  },
  {
    id: 'kinky-pack',
    name: 'Pack Kinky',
    theme: 'Kinky',
    description: 'Pour les couples expérimentés qui veulent explorer leurs limites. Contenu très audacieux.',
    price: 6.99,
    currency: 'EUR',
    questionsCount: 50,
    truthsCount: 50,
    difficulty: 'extreme',
    preview: [
      'Quel est ton kink secret que tu n\'as jamais avoué ?',
      'Utilise cet accessoire pour me faire plaisir',
      'Montre-moi ta position de domination préférée'
    ],
    isPurchased: false,
    isLocked: false
  }
];

// Content pack challenges (these would be loaded when pack is purchased)
export const contentPackChallenges: Record<string, Challenge[]> = {
  'voyeur-pack': [
    // 50 truth questions
    { id: 2001, type: 'truth', category: 'intense', text: 'Raconte-moi ton fantasme de voyeurisme le plus secret', isCustom: false },
    { id: 2002, type: 'truth', category: 'intense', text: 'Aimerais-tu qu\'on nous regarde faire l\'amour ?', isCustom: false },
    { id: 2003, type: 'truth', category: 'intense', text: 'Quel couple aimerais-tu observer en secret ?', isCustom: false },
    // ... 47 more truth questions
    
    // 50 dare actions
    { id: 2051, type: 'dare', category: 'intense', text: 'Regarde-moi me déshabiller lentement comme si tu étais caché', isCustom: false },
    { id: 2052, type: 'dare', category: 'intense', text: 'Fais-moi l\'amour devant le miroir en me regardant', isCustom: false },
    { id: 2053, type: 'dare', category: 'intense', text: 'Décris-moi ce que tu vois quand tu me regardes', isCustom: false },
    // ... 47 more dare actions
  ],
  
  'outdoor-pack': [
    // Similar structure for outdoor pack
    { id: 3001, type: 'truth', category: 'intense', text: 'Quel endroit en plein air te fait le plus fantasmer ?', isCustom: false },
    // ... more challenges
  ],
  
  // ... other packs
};
