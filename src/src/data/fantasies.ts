export interface SystemFantasy {
  id: number;
  text: string;
  intensity: 'doux' | 'hot' | 'intense';
}

export const systemFantasies: SystemFantasy[] = [
  // Doux / romantiques
  { id: 1,  text: "Faire l'amour sous les étoiles, dans un champ isolé", intensity: 'doux' },
  { id: 2,  text: "Prendre un bain aux chandelles ensemble, avec de la mousse et de la musique douce", intensity: 'doux' },
  { id: 3,  text: "Se faire masser mutuellement avec une huile parfumée pendant une heure", intensity: 'doux' },
  { id: 4,  text: "Faire l'amour devant une cheminée crépitante en hiver", intensity: 'doux' },
  { id: 5,  text: "Passer une nuit dans un hôtel de luxe et ne pas quitter la chambre", intensity: 'doux' },
  { id: 6,  text: "S'embrasser passionnément sous la pluie, sans s'arrêter", intensity: 'doux' },
  { id: 7,  text: "Faire l'amour très lentement, en se regardant dans les yeux tout du long", intensity: 'doux' },
  { id: 8,  text: "Se réveiller avec des caresses et continuer au lit toute la matinée", intensity: 'doux' },
  { id: 9,  text: "Faire l'amour sur une plage déserte au coucher du soleil", intensity: 'doux' },
  { id: 10, text: "Passer une soirée entière à explorer le corps de l'autre sans jamais aller plus loin", intensity: 'doux' },
  { id: 11, text: "Cuisiner ensemble à moitié déshabillé(e)s et finir par faire l'amour dans la cuisine", intensity: 'doux' },
  { id: 12, text: "Danser sensuellement ensemble dans le salon, juste pour le plaisir", intensity: 'doux' },
  { id: 13, text: "S'embrasser longuement dans un endroit semi-public sans aller trop loin", intensity: 'doux' },
  { id: 14, text: "Faire l'amour en écoutant votre playlist préférée du début à la fin", intensity: 'doux' },
  { id: 15, text: "Prendre une longue douche ensemble et se savonner mutuellement", intensity: 'doux' },

  // Hot / sensuels
  { id: 16, text: "Utiliser des menottes en velours et explorer ce qu'on peut faire", intensity: 'hot' },
  { id: 17, text: "Jouer avec des glaçons sur le corps de l'autre pour explorer la chaleur et le froid", intensity: 'hot' },
  { id: 18, text: "Porter un bandeau sur les yeux pour vivre l'intimité avec tous les autres sens", intensity: 'hot' },
  { id: 19, text: "Faire l'amour debout contre un mur, sans prévenir", intensity: 'hot' },
  { id: 20, text: "Se faire un strip-tease réciproque, chacun à son tour, en musique", intensity: 'hot' },
  { id: 21, text: "Faire l'amour dans la voiture, garée dans un endroit discret et isolé", intensity: 'hot' },
  { id: 22, text: "Utiliser des plumes ou des gants de satin pour explorer la sensibilité de l'autre", intensity: 'hot' },
  { id: 23, text: "Faire l'amour dans une position qu'on n'a jamais essayée", intensity: 'hot' },
  { id: 24, text: "Se regarder dans les yeux pendant tout l'acte, sans en détourner le regard", intensity: 'hot' },
  { id: 25, text: "Faire l'amour uniquement à la lueur de bougies, très lentement", intensity: 'hot' },
  { id: 26, text: "Utiliser de la cire de bougie (tiède et adaptée) pour jouer avec les sensations", intensity: 'hot' },
  { id: 27, text: "S'envoyer des messages très coquins toute la journée avant de se retrouver le soir", intensity: 'hot' },
  { id: 28, text: "Faire l'amour habillé(e)s, en ne retirant que le strict minimum", intensity: 'hot' },
  { id: 29, text: "Explorer les zones érogènes de l'autre pendant 20 minutes sans toucher les zones intimes", intensity: 'hot' },
  { id: 30, text: "Se filmer en train de faire l'amour, uniquement pour regarder ça ensemble après", intensity: 'hot' },

  // Intenses / jeux de rôle / fantasmes
  { id: 31, text: "Jouer au médecin et à la patiente — examen complet inclus", intensity: 'intense' },
  { id: 32, text: "Se déguiser en inconnus qui se rencontrent pour la première fois dans un bar", intensity: 'intense' },
  { id: 33, text: "Jouer au patron exigeant et à l'employé(e) qui veut une promotion", intensity: 'intense' },
  { id: 34, text: "Incarner le fantasme : séduction d'un(e) inconnu(e), sans se parler au préalable", intensity: 'intense' },
  { id: 35, text: "Jouer au maître et à l'esclave — l'un obéit à toutes les demandes raisonnables de l'autre", intensity: 'intense' },
  { id: 36, text: "Utiliser un jouet intime ensemble pour la première fois", intensity: 'intense' },
  { id: 37, text: "Faire l'amour dans les toilettes d'un restaurant ou d'un bar", intensity: 'intense' },
  { id: 38, text: "Jouer à celui qui doit plaire à l'autre en moins de 5 minutes, chrono en main", intensity: 'intense' },
  { id: 39, text: "Faire l'amour en se comportant comme lors de la toute première fois — tout recommencer de zéro", intensity: 'intense' },
  { id: 40, text: "Se retrouver dans un hôtel sous de faux noms et jouer la scène d'une rencontre clandestine", intensity: 'intense' },
  { id: 41, text: "Jouer au jeu de la soumission : l'un dit exactement ce qu'il veut, l'autre exécute sans discuter", intensity: 'intense' },
  { id: 42, text: "Explorer ensemble un fantasme tabou qu'aucun de vous n'a jamais osé dire à voix haute", intensity: 'intense' },
  { id: 43, text: "Faire l'amour en public (de manière discrète) — parking, parc, cinéma…", intensity: 'intense' },
  { id: 44, text: "Jouer à qui tient le plus longtemps sans céder pendant que l'autre fait tout pour le/la faire craquer", intensity: 'intense' },
  { id: 45, text: "Inventer et jouer un scénario érotique complet ensemble : décor, personnages, script", intensity: 'intense' },
];
