import { Challenge, Category } from '../types';

export const challenges: Record<Category, Challenge[]> = {
  soft: [
    // Truth questions - Soft
       // Truth questions - Soft
    { id: 1, type: 'truth', category: 'soft', text: "Quel est ton fantasme le plus doux que tu n'as jamais réalisé ?" },
    { id: 2, type: 'truth', category: 'soft', text: "Quelle partie de mon corps préfères-tu ?" },
    { id: 3, type: 'truth', category: 'soft', text: "Quel a été notre moment le plus romantique ensemble ?" },
    { id: 4, type: 'truth', category: 'soft', text: "Dans quel endroit aimerais-tu qu'on s'embrasse ?" },
    { id: 5, type: 'truth', category: 'soft', text: "Quelle chanson te rappelle nos moments intimes ?" },
    { id: 6, type: 'truth', category: 'soft', text: "Quel compliment aimerais-tu que je te fasse plus souvent ?" },
    { id: 7, type: 'truth', category: 'soft', text: "Quelle est ta façon préférée que je te touche ?" },
    { id: 8, type: 'truth', category: 'soft', text: "Quel est le geste le plus romantique que tu aimerais que je fasse ?" },
    { id: 9, type: 'truth', category: 'soft', text: "À quoi penses-tu quand tu me regardes ?" },
    { id: 10, type: 'truth', category: 'soft', text: "Quel est ton souvenir préféré de notre première fois ensemble ?" },
    { id: 11, type: 'truth', category: 'soft', text: "Quelle surprise romantique aimerais-tu que je te prépare ?" },
    { id: 12, type: 'truth', category: 'soft', text: "Dans quelle pièce de la maison préfères-tu qu'on soit intimes ?" },
    { id: 13, type: 'truth', category: 'soft', text: "Quel est le parfum ou l'odeur qui t'excite le plus chez moi ?" },
    { id: 14, type: 'truth', category: 'soft', text: "Quelle activité aimerais-tu qu'on fasse ensemble en tête-à-tête ?" },
    { id: 15, type: 'truth', category: 'soft', text: "Quel mot doux aimerais-tu que je te murmure à l'oreille ?" },
    { id: 16, type: 'truth', category: 'soft', text: "Quelle est la chose la plus sensuelle que tu aimerais qu'on partage ?" },
    { id: 17, type: 'truth', category: 'soft', text: "À quel moment de la journée penses-tu le plus à moi ?" },
    { id: 18, type: 'truth', category: 'soft', text: "Quel vêtement préfères-tu me voir porter ?" },
    { id: 19, type: 'truth', category: 'soft', text: "Quelle est ta position préférée pour les câlins ?" },
    { id: 20, type: 'truth', category: 'soft', text: "Quel endroit aimerais-tu qu'on découvre ensemble romantiquement ?" },
    { id: 21, type: 'truth', category: 'soft', text: "Quelle est la chose la plus mignonne que tu trouves chez moi ?" },
    { id: 22, type: 'truth', category: 'soft', text: "Quel type de massage aimerais-tu que je te fasse ?" },
    { id: 23, type: 'truth', category: 'soft', text: "Quelle musique aimes-tu entendre pendant nos moments intimes ?" },
    { id: 24, type: 'truth', category: 'soft', text: "Quel est ton rêve le plus romantique avec moi ?" },
    { id: 25, type: 'truth', category: 'soft', text: "Quelle partie de mon corps aimerais-tu que je mette plus en valeur ?" },
    { id: 26, type: 'truth', category: 'soft', text: "Quel petit déjeuner au lit aimerais-tu qu'on partage ?" },
    { id: 27, type: 'truth', category: 'soft', text: "Dans quelle ambiance lumineuse préfères-tu qu'on soit ensemble ?" },
    { id: 28, type: 'truth', category: 'soft', text: "Quelle déclaration d'amour aimerais-tu entendre ?" },
    { id: 29, type: 'truth', category: 'soft', text: "Quel film romantique aimerais-tu qu'on regarde ensemble ?" },
    { id: 30, type: 'truth', category: 'soft', text: "Quelle est ta façon préférée de me montrer ton affection ?" },
    { id: 31, type: 'truth', category: 'soft', text: "Quel surnom affectueux aimerais-tu que je t'invente ?" },
    { id: 32, type: 'truth', category: 'soft', text: "Quelle activité sensuelle aimerais-tu qu'on essaie ensemble ?" },
    { id: 33, type: 'truth', category: 'soft', text: "À quoi ressemble le rendez-vous parfait selon toi ?" },
    { id: 34, type: 'truth', category: 'soft', text: "Quelle est la chose la plus séduisante dans ma personnalité ?" },
    { id: 35, type: 'truth', category: 'soft', text: "Dans quel décor aimerais-tu qu'on passe une soirée romantique ?" },
    { id: 36, type: 'truth', category: 'soft', text: "Quel type de danse aimerais-tu qu'on apprenne ensemble ?" },
    { id: 37, type: 'truth', category: 'soft', text: "Quelle surprise aimerais-tu me faire pour me séduire ?" },
    { id: 38, type: 'truth', category: 'soft', text: "Quel est ton moment préféré de notre routine quotidienne ?" },
    { id: 39, type: 'truth', category: 'soft', text: "Quelle destination romantique aimerais-tu qu'on visite ?" },
    { id: 40, type: 'truth', category: 'soft', text: "Quel cadeau symbolique aimerais-tu qu'on s'offre ?" },
    { id: 41, type: 'truth', category: 'soft', text: "Quelle tradition romantique aimerais-tu qu'on crée ensemble ?" },
    { id: 42, type: 'truth', category: 'soft', text: "Dans quelle situation te sens-tu le plus connecté(e) à moi ?" },
    { id: 43, type: 'truth', category: 'soft', text: "Quel compliment physique aimerais-tu recevoir plus souvent ?" },
    { id: 44, type: 'truth', category: 'soft', text: "Quelle activité de couple aimerais-tu qu'on fasse régulièrement ?" },
    { id: 45, type: 'truth', category: 'soft', text: "Quel petit rituel d'intimité aimerais-tu qu'on développe ?" },
    { id: 46, type: 'truth', category: 'soft', text: "Quelle est ta façon préférée de recevoir de l'affection ?" },
    { id: 47, type: 'truth', category: 'soft', text: "Dans quel moment de la journée te sens-tu le plus romantique ?" },
    { id: 48, type: 'truth', category: 'soft', text: "Quel type de communication aimerais-tu qu'on améliore ?" },
    { id: 49, type: 'truth', category: 'soft', text: "Quelle expérience sensorielle aimerais-tu partager avec moi ?" },
    { id: 50, type: 'truth', category: 'soft', text: "Quel est ton fantasme de vacances romantiques avec moi ?" },
    
    // Dare actions - Soft
    { id: 51, type: 'dare', category: 'soft', text: "Fais-moi un massage des épaules pendant 2 minutes" },
    { id: 52, type: 'dare', category: 'soft', text: "Chante-moi ta chanson d'amour préférée" },
    { id: 53, type: 'dare', category: 'soft', text: "Embrasse-moi tendrement pendant 30 secondes" },
    { id: 54, type: 'dare', category: 'soft', text: "Dis-moi 5 choses que tu adores chez moi" },
    { id: 55, type: 'dare', category: 'soft', text: "Danse lentement avec moi sur notre chanson préférée" },
    { id: 56, type: 'dare', category: 'soft', text: "Dessine un cœur sur ma main avec ton doigt" },
    { id: 57, type: 'dare', category: 'soft', text: "Murmure-moi quelque chose de doux à l'oreille" },
    { id: 58, type: 'dare', category: 'soft', text: "Fais-moi un câlin de 1 minute sans parler" },
    { id: 59, type: 'dare', category: 'soft', text: "Raconte-moi ton rêve le plus romantique avec moi" },
    { id: 60, type: 'dare', category: 'soft', text: "Caresse doucement mes cheveux pendant 2 minutes" },
    { id: 61, type: 'dare', category: 'soft', text: "Écris 'Je t'aime' sur ma peau avec ton doigt" },
    { id: 62, type: 'dare', category: 'soft', text: "Regarde-moi dans les yeux pendant 1 minute sans parler" },
    { id: 63, type: 'dare', category: 'soft', text: "Fais semblant de me demander en mariage de façon romantique" },
    { id: 64, type: 'dare', category: 'soft', text: "Masse mes pieds pendant 3 minutes" },
    { id: 65, type: 'dare', category: 'soft', text: "Raconte-moi un souvenir précieux que tu as de nous" },
    { id: 66, type: 'dare', category: 'soft', text: "Imite la façon dont je dis 'Je t'aime'" },
    { id: 67, type: 'dare', category: 'soft', text: "Fais-moi un massage des mains avec de la crème" },
    { id: 68, type: 'dare', category: 'soft', text: "Décris-moi physiquement comme si tu me voyais pour la première fois" },
    { id: 69, type: 'dare', category: 'soft', text: "Embrasse chacun de mes doigts délicatement" },
    { id: 70, type: 'dare', category: 'soft', text: "Prépare-moi une boisson et sers-la moi romantiquement" },
    { id: 71, type: 'dare', category: 'soft', text: "Fais-moi une déclaration d'amour théâtrale" },
    { id: 72, type: 'dare', category: 'soft', text: "Caresse mon visage pendant que tu me regardes" },
    { id: 73, type: 'dare', category: 'soft', text: "Raconte-moi ce que tu aimerais faire avec moi demain" },
    { id: 74, type: 'dare', category: 'soft', text: "Embrasse mon front, mes joues et mon nez" },
    { id: 75, type: 'dare', category: 'soft', text: "Fais-moi un compliment sur chaque partie de mon visage" },
    { id: 76, type: 'dare', category: 'soft', text: "Tiens mes mains et raconte-moi tes projets avec moi" },
    { id: 77, type: 'dare', category: 'soft', text: "Imite notre premier baiser ensemble" },
    { id: 78, type: 'dare', category: 'soft', text: "Fais-moi rire avec ton imitation de quelqu'un" },
    { id: 79, type: 'dare', category: 'soft', text: "Dessine un petit cœur sur mon bras avec un stylo" },
    { id: 80, type: 'dare', category: 'soft', text: "Chuchote-moi tes 3 qualités préférées chez moi" },
    { id: 81, type: 'dare', category: 'soft', text: "Fais semblant de me voir pour la première fois et drague-moi" },
    { id: 82, type: 'dare', category: 'soft', text: "Masse mes épaules en me racontant ta journée" },
    { id: 83, type: 'dare', category: 'soft', text: "Embrasse ma main comme un gentleman/une lady" },
    { id: 84, type: 'dare', category: 'soft', text: "Raconte-moi ton fantasme de week-end parfait ensemble" },
    { id: 85, type: 'dare', category: 'soft', text: "Caresse mon bras de haut en bas très lentement" },
    { id: 86, type: 'dare', category: 'soft', text: "Fais-moi une sérénade avec une chanson inventée" },
    { id: 87, type: 'dare', category: 'soft', text: "Regarde-moi manger quelque chose que tu me donnes" },
    { id: 88, type: 'dare', category: 'soft', text: "Raconte-moi ce qui t'a séduit chez moi au début" },
    { id: 89, type: 'dare', category: 'soft', text: "Dessine nos initiales entrelacées quelque part sur moi" },
    { id: 90, type: 'dare', category: 'soft', text: "Fais-moi un bisou sur une partie de mon corps au choix" },
    { id: 91, type: 'dare', category: 'soft', text: "Raconte-moi un rêve que tu as fait avec moi récemment" },
    { id: 92, type: 'dare', category: 'soft', text: "Caresse ma nuque pendant que je ferme les yeux" },
    { id: 93, type: 'dare', category: 'soft', text: "Fais-moi deviner ce que tu penses de moi avec des mimes" },
    { id: 94, type: 'dare', category: 'soft', text: "Embrasse ma tempe et murmure quelque chose de doux" },
    { id: 95, type: 'dare', category: 'soft', text: "Raconte-moi pourquoi tu m'as choisi(e) moi" },
    { id: 96, type: 'dare', category: 'soft', text: "Fais-moi un massage du cuir chevelu" },
    { id: 97, type: 'dare', category: 'soft', text: "Dis-moi ce que tu aimerais qu'on fasse ensemble ce soir" },
    { id: 98, type: 'dare', category: 'soft', text: "Caresse le contour de mon visage avec tes doigts" },
    { id: 99, type: 'dare', category: 'soft', text: "Raconte-moi ce qui te rend heureux/heureuse avec moi" },
    { id: 100, type: 'dare', category: 'soft', text: "Fais-moi un câlin par derrière pendant 2 minutes" }
  ],
  intense: [
    // Truth questions - Intense
   {
  "id": 101,
  "type": "truth",
  "category": "intense",
  "text": "Partage ton fantasme le plus chaud avec ton partenaire."
},
{
  "id": 102,
  "type": "truth",
  "category": "intense",
  "text": "Quelle position aimerais-tu que vous essayiez ensemble ?"
},
{
  "id": 103,
  "type": "truth",
  "category": "intense",
  "text": "Quel endroit insolite te rendrait excité pour faire l'amour avec ton partenaire ?"
},
{
  "id": 104,
  "type": "truth",
  "category": "intense",
  "text": "Quelle partie du corps de ton partenaire te fait le plus d'effet ?"
},
{
  "id": 105,
  "type": "truth",
  "category": "intense",
  "text": "Quel rôle aimerais-tu jouer dans vos jeux intimes avec ton partenaire ?"
},
{
  "id": 106,
  "type": "truth",
  "category": "intense",
  "text": "Quelle expérience sensuelle aimerais-tu que vous découvriez ensemble ?"
},
{
  "id": 107,
  "type": "truth",
  "category": "intense",
  "text": "À quoi penses-tu quand tu désires le plus ton partenaire ?"
},
{
  "id": 108,
  "type": "truth",
  "category": "intense",
  "text": "Quel accessoire aimerais-tu qu'on utilise ensemble ?"
},
{
  "id": 109,
  "type": "truth",
  "category": "intense",
  "text": "Dans quelle tenue trouves-tu ton partenaire le plus séduisant(e) ?"
},
{
  "id": 110,
  "type": "truth",
  "category": "intense",
  "text": "Quel jeu intime aimerais-tu que vous inventiez ensemble ?"
},
{
  "id": 111,
  "type": "truth",
  "category": "intense",
  "text": "Quelle est ta zone érogène la plus sensible ?"
},
{
  "id": 112,
  "type": "truth",
  "category": "intense",
  "text": "Quel moment de la journée te donne le plus envie de ton partenaire ?"
},
{
  "id": 113,
  "type": "truth",
  "category": "intense",
  "text": "Quelle surprise sensuelle aimerais-tu que ton partenaire te fasse ?"
},
{
  "id": 114,
  "type": "truth",
  "category": "intense",
  "text": "Quel type de massage te procure le plus de plaisir ?"
},
{
  "id": 115,
  "type": "truth",
  "category": "intense",
  "text": "Dans quelle ambiance préfères-tu vos moments intimes ?"
},
{
  "id": 116,
  "type": "truth",
  "category": "intense",
  "text": "Quelle expérience sensuelle veux-tu absolument vivre avec ton partenaire ?"
},
{
  "id": 117,
  "type": "truth",
  "category": "intense",
  "text": "Quel est votre souvenir le plus excitant de vous deux ?"
},
{
  "id": 118,
  "type": "truth",
  "category": "intense",
  "text": "Quelle partie du corps de ton partenaire aimerais-tu explorer davantage ?"
},
{
  "id": 119,
  "type": "truth",
  "category": "intense",
  "text": "Que choisis-tu : Se filmer ou se photographier avec ton partenaire ?"
},
{
  "id": 120,
  "type": "truth",
  "category": "intense",
  "text": "Quelle sensation physique préfères-tu que ton partenaire te procure ?"
},
{
  "id": 121,
  "type": "truth",
  "category": "intense",
  "text": "Quel fantasme de domination ou soumission as-tu ?"
},
{
  "id": 122,
  "type": "truth",
  "category": "intense",
  "text": "Dans quelle position te sens-tu le plus désirable ?"
},
{
  "id": 123,
  "type": "truth",
  "category": "intense",
  "text": "Quel type de préliminaires préfères-tu ?"
},
{
  "id": 124,
  "type": "truth",
  "category": "intense",
  "text": "Quelle expérience à trois t'intrigue le plus ?"
},
{
  "id": 125,
  "type": "truth",
  "category": "intense",
  "text": "Quel endroit de ton corps aimerais-tu que ton partenaire embrasse plus ?"
},
{
  "id": 126,
  "type": "truth",
  "category": "intense",
  "text": "Quelle pratique sensuelle aimerais-tu maîtriser ?"
},
{
  "id": 127,
  "type": "truth",
  "category": "intense",
  "text": "Quel rythme préfères-tu pendant vos ébats ?"
},
{
  "id": 128,
  "type": "truth",
  "category": "intense",
  "text": "Quelle température ambiante préfères-tu pour l'intimité ?"
},
{
  "id": 129,
  "type": "truth",
  "category": "intense",
  "text": "Quel jeu de rôle aimerais-tu que vous exploriez ?"
},
{
  "id": 130,
  "type": "truth",
  "category": "intense",
  "text": "Quelle partie des préliminaires de ton partenaire préfères-tu ?"
},
{
  "id": 131,
  "type": "truth",
  "category": "intense",
  "text": "Quel objet du quotidien détournes-tu en accessoire sensuel ?"
},
{
  "id": 132,
  "type": "truth",
  "category": "intense",
  "text": "Dans quelle pièce aimerais-tu que vous soyez plus aventureux ?"
},
{
  "id": 133,
  "type": "truth",
  "category": "intense",
  "text": "Quelle expérience de plaisir mutuel veux-tu tenter avec ton partenaire ?"
},
{
  "id": 134,
  "type": "truth",
  "category": "intense",
  "text": "Que penses-tu de la façon dont ton partenaire te suce/lèche ?"
},
{
  "id": 135,
  "type": "truth",
  "category": "intense",
  "text": "Quelle fantaisie aimerais-tu réaliser cette semaine avec ton partenaire ?"
},
{
  "id": 136,
  "type": "truth",
  "category": "intense",
  "text": "Quel moment de votre intimité te procure le plus d'émotion ?"
},
{
  "id": 137,
  "type": "truth",
  "category": "intense",
  "text": "Quelle surprise érotique aimerais-tu découvrir ?"
},
{
  "id": 138,
  "type": "truth",
  "category": "intense",
  "text": "Dans quelle situation te sens-tu le plus excité(e) ?"
},
{
  "id": 139,
  "type": "truth",
  "category": "intense",
  "text": "Quel type de caresse te fait perdre la tête ?"
},
{
  "id": 140,
  "type": "truth",
  "category": "intense",
  "text": "Quelle nouvelle expérience sensuelle veux-tu essayer avec ton partenaire ?"
},
{
  "id": 141,
  "type": "truth",
  "category": "intense",
  "text": "Quel endroit intime aimerais-tu que ton partenaire explore chez toi ?"
},
{
  "id": 142,
  "type": "truth",
  "category": "intense",
  "text": "Quelle technique aimerais-tu que ton partenaire perfectionne ?"
},
{
  "id": 143,
  "type": "truth",
  "category": "intense",
  "text": "Quel moment d'abandon total aimerais-tu vivre ?"
},
{
  "id": 144,
  "type": "truth",
  "category": "intense",
  "text": "Quelle expérience de plaisir partagé te tente le plus avec ton partenaire ?"
},
{
  "id": 145,
  "type": "truth",
  "category": "intense",
  "text": "Dans quelle position aimerais-tu me dominer ?"
},
{
  "id": 146,
  "type": "truth",
  "category": "intense",
  "text": "Quel fantasme secret aimerais-tu me confier ?"
},
{
  "id": 147,
  "type": "truth",
  "category": "intense",
  "text": "Quelle sensation physique te procure le plus de frissons ?"
},
{
  "id": 148,
  "type": "truth",
  "category": "intense",
  "text": "Quel jeu sensuel aimerais-tu qu'on invente ensemble ?"
},
{
  "id": 149,
  "type": "truth",
  "category": "intense",
  "text": "Quelle partie de mon corps aimerais-tu posséder complètement ?"
},
{
  "id": 150,
  "type": "truth",
  "category": "intense",
  "text": "Quel moment d'extase aimerais-tu qu'on atteigne ensemble ?"
},
    
    // Dare actions - Intense
   {
  "id": 151,
  "type": "dare",
  "category": "intense",
  "text": "Fais un massage sensuel à ton partenaire, sans utiliser tes mains."
},
{
  "id": 152,
  "type": "dare",
  "category": "intense",
  "text": "Utilise ta langue pour suivre le parcours de la main de ton partenaire sur ton propre corps."
},
{
  "id": 153,
  "type": "dare",
  "category": "intense",
  "text": "Caresse ton partenaire sensuellement pendant 3 minutes."
},
{
  "id": 154,
  "type": "dare",
  "category": "intense",
  "text": "Murmure tes fantasmes les plus secrets à l'oreille de ton partenaire."
},
{
  "id": 155,
  "type": "dare",
  "category": "intense",
  "text": "Ton partenaire ne doit pas bander/mouiller pendant que tu te touches. Il y aura des contrôles !"
},
{
  "id": 156,
  "type": "dare",
  "category": "intense",
  "text": "Embrasse une partie du corps de ton partenaire de ton choix pendant 2 minutes."
},
{
  "id": 157,
  "type": "dare",
  "category": "intense",
  "text": "Fais un massage intime à ton partenaire, avec de l'huile."
},
{
  "id": 158,
  "type": "dare",
  "category": "intense",
  "text": "Raconte en détail à ton partenaire ce que tu veux lui faire."
},
{
  "id": 159,
  "type": "dare",
  "category": "intense",
  "text": "Caresse tout le corps de ton partenaire sans utiliser tes mains."
},
{
  "id": 160,
  "type": "dare",
  "category": "intense",
  "text": "Fais un strip-tease lent et sensuel à ton partenaire."
},
{
  "id": 161,
  "type": "dare",
  "category": "intense",
  "text": "Embrasse ton partenaire partout pendant 3 minutes."
},
{
  "id": 162,
  "type": "dare",
  "category": "intense",
  "text": "Utilise tes lèvres pour explorer le corps de ton partenaire."
},
{
  "id": 163,
  "type": "dare",
  "category": "intense",
  "text": "Fais un massage complet du corps à ton partenaire pendant 10 minutes, sans les mains, avec de l'huile."
},
{
  "id": 164,
  "type": "dare",
  "category": "intense",
  "text": "Raconte tes zones érogènes à ton partenaire en les touchant."
},
{
  "id": 165,
  "type": "dare",
  "category": "intense",
  "text": "Caresse ton partenaire avec un objet doux (plume, soie, etc.)."
},
{
  "id": 166,
  "type": "dare",
  "category": "intense",
  "text": "Embrasse sensuellement l'intérieur des cuisses de ton partenaire."
},
{
  "id": 167,
  "type": "dare",
  "category": "intense",
  "text": "Fais un massage très sensuel à ton partenaire."
},
{
  "id": 168,
  "type": "dare",
  "category": "intense",
  "text": "Souffle doucement sur tout le corps de ton partenaire."
},
{
  "id": 169,
  "type": "dare",
  "category": "intense",
  "text": "Utilise ta langue pour tracer des formes sur la peau de ton partenaire."
},
{
  "id": 170,
  "type": "dare",
  "category": "intense",
  "text": "Fais découvrir à ton partenaire une nouvelle sensation avec tes mains."
},
{
  "id": 171,
  "type": "dare",
  "category": "intense",
  "text": "Caresse les cheveux de ton partenaire pendant que tu l'embrasses."
},
{
  "id": 172,
  "type": "dare",
  "category": "intense",
  "text": "Fais un massage anal très doux à ton partenaire."
},
{
  "id": 173,
  "type": "dare",
  "category": "intense",
  "text": "Embrasse la nuque de ton partenaire pendant qu'il ne te regarde pas."
},
{
  "id": 174,
  "type": "dare",
  "category": "intense",
  "text": "Utilise de la glace pour procurer des sensations à ton partenaire."
},
{
  "id": 175,
  "type": "dare",
  "category": "intense",
  "text": "Bande les yeux de ton partenaire et fais-lui ce que tu veux."
},
{
  "id": 176,
  "type": "dare",
  "category": "intense",
  "text": "Choisis une vidéo porno qui te plaît et explique à ton partenaire ce qui te plaît pendant que vous la regardez."
},
{
  "id": 177,
  "type": "dare",
  "category": "intense",
  "text": "Explore le corps de ton partenaire avec tes mains, les yeux fermés."
},
{
  "id": 178,
  "type": "dare",
  "category": "intense",
  "text": "Fais un massage des hanches sensuellement à ton partenaire."
},
{
  "id": 179,
  "type": "dare",
  "category": "intense",
  "text": "Utilise tes cheveux pour caresser ton partenaire."
},
{
  "id": 180,
  "type": "dare",
  "category": "intense",
  "text": "Embrasse les oreilles de ton partenaire pendant 3 minutes."
},
{
  "id": 181,
  "type": "dare",
  "category": "intense",
  "text": "Caresse la peau de ton partenaire avec différentes textures."
},
{
  "id": 182,
  "type": "dare",
  "category": "intense",
  "text": "Fais ressentir du plaisir à ton partenaire avec seulement ton souffle."
},
{
  "id": 183,
  "type": "dare",
  "category": "intense",
  "text": "Masse les mains de ton partenaire de façon très sensuelle."
},
{
  "id": 184,
  "type": "dare",
  "category": "intense",
  "text": "Embrasse les doigts de ton partenaire un par un, très lentement."
},
{
  "id": 185,
  "type": "dare",
  "category": "intense",
  "text": "Caresse ton partenaire en le regardant dans les yeux."
},
{
  "id": 186,
  "type": "dare",
  "category": "intense",
  "text": "Trouve une position inhabituelle pour faire un bon cunnilingus ou une bonne fellation à ton partenaire."
},
{
  "id": 187,
  "type": "dare",
  "category": "intense",
  "text": "Ta main est possédée, tu la contrôles pendant 3 minutes."
},
{
  "id": 188,
  "type": "dare",
  "category": "intense",
  "text": "Caresse la peau de ton partenaire avec des glaçons pendant 1 minute."
},
{
  "id": 189,
  "type": "dare",
  "category": "intense",
  "text": "Embrasse le creux du cou de ton partenaire passionnément."
},
{
  "id": 190,
  "type": "dare",
  "category": "intense",
  "text": "Explore les zones sensibles de ton partenaire avec tes lèvres."
},
{
  "id": 191,
  "type": "dare",
  "category": "intense",
  "text": "Fais frissonner ton partenaire avec seulement tes doigts."
},
{
  "id": 192,
  "type": "dare",
  "category": "intense",
  "text": "Caresse l'arrière des fesses de ton partenaire sensuellement."
},
{
  "id": 193,
  "type": "dare",
  "category": "intense",
  "text": "Utilise différentes pressions pour masser ton partenaire."
},
{
  "id": 194,
  "type": "dare",
  "category": "intense",
  "text": "Caresse ton partenaire en te caressant toi-même en même temps."
},
{
  "id": 195,
  "type": "dare",
  "category": "intense",
  "text": "Fais découvrir à ton partenaire une nouvelle zone érogène sur son propre corps."
},
{
  "id": 196,
  "type": "dare",
  "category": "intense",
  "text": "Choisis : Tu fais ce que ton partenaire veut ou il fait ce que tu veux pendant 3 minutes."
},
{
  "id": 197,
  "type": "dare",
  "category": "intense",
  "text": "Utilise ta langue pour dessiner sur la peau de ton partenaire."
},
{
  "id": 198,
  "type": "dare",
  "category": "intense",
  "text": "Fais un massage complet à ton partenaire avec tes lèvres."
},
{
  "id": 199,
  "type": "dare",
  "category": "intense",
  "text": "Explore le corps de ton partenaire comme une carte au trésor."
},
{
  "id": 200,
  "type": "dare",
  "category": "intense",
  "text": "JOKER - Tu choisis ce que tu veux !"
}
  ]
};
