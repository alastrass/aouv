export type RoleplayPreference = 'yes' | 'maybe' | 'no';

export interface RoleplayTheme {
  id: string;
  title: string;
  description: string;
  intensity: 'doux' | 'sensuel' | 'audacieux';
}

export interface RoleplayScenario {
  id: string;
  title: string;
  themeIds: string[];
  intro: string;
  roles: [string, string];
  rules: string[];
  ambiance: string;
  consentReminder: string;
}

export interface RoleplayMatch {
  theme: RoleplayTheme;
  playerOnePreference: Exclude<RoleplayPreference, 'no'>;
  playerTwoPreference: Exclude<RoleplayPreference, 'no'>;
}

export const roleplayThemes: RoleplayTheme[] = [
  {
    id: 'hotel-mystere',
    title: "Rencontre a l'hotel",
    description: 'Deux inconnus se croisent dans un lieu chic et jouent avec le mystere.',
    intensity: 'sensuel'
  },
  {
    id: 'bar-inconnus',
    title: 'Inconnus au bar',
    description: 'Rejouer une premiere rencontre avec charme, audace et nouvelles identites.',
    intensity: 'doux'
  },
  {
    id: 'masques',
    title: 'Bal masque',
    description: 'Une soiree elegante ou les regards, les gestes et les secrets guident le jeu.',
    intensity: 'sensuel'
  },
  {
    id: 'photographe-modele',
    title: 'Photographe et modele',
    description: 'Une session photo glamour ou chacun choisit la pose, le rythme et les limites.',
    intensity: 'sensuel'
  },
  {
    id: 'chef-invite',
    title: 'Chef prive et invite',
    description: 'Un diner intime ou les saveurs, les compliments et les surprises montent en intensite.',
    intensity: 'doux'
  },
  {
    id: 'spa-prive',
    title: 'Spa prive',
    description: 'Massages, huiles parfumees et consignes de detente dans une bulle de confiance.',
    intensity: 'doux'
  },
  {
    id: 'espions',
    title: 'Mission secrete',
    description: 'Deux espions doivent echanger un code secret sans se faire demasquer.',
    intensity: 'sensuel'
  },
  {
    id: 'cabaret',
    title: 'Cabaret prive',
    description: 'Un numero de seduction, de danse ou de lecture sensuelle reserve a une seule personne.',
    intensity: 'audacieux'
  },
  {
    id: 'dominance-legere',
    title: 'Guidage et obeissance legere',
    description: 'Un jeu de consignes simples, toujours negociables, pour explorer la confiance.',
    intensity: 'audacieux'
  },
  {
    id: 'yeux-bandes',
    title: 'Yeux bandes',
    description: 'Une experience sensorielle ou la personne guidee garde le controle avec un mot stop.',
    intensity: 'audacieux'
  },
  {
    id: 'interrogatoire',
    title: 'Interrogatoire charmeur',
    description: 'Questions intimes, defis doux et revelations consenties dans une ambiance de film noir.',
    intensity: 'sensuel'
  },
  {
    id: 'bibliotheque',
    title: 'Bibliotheque interdite',
    description: 'Un rendez-vous discret autour de mots murmures, de pages choisies et de regards appuyes.',
    intensity: 'doux'
  },
  {
    id: 'voyage-premiere-classe',
    title: 'Voyage premiere classe',
    description: 'Deux voyageurs partagent une destination imaginaire et inventent leurs rituels de bord.',
    intensity: 'doux'
  },
  {
    id: 'atelier-artiste',
    title: 'Artiste et muse',
    description: 'Dessiner, decrire ou mettre en scene la personne qui inspire, sans pression de resultat.',
    intensity: 'sensuel'
  },
  {
    id: 'roi-reine',
    title: 'Cour royale',
    description: 'Compliments, privileges et petits ordres ceremonialises dans un univers luxueux.',
    intensity: 'sensuel'
  },
  {
    id: 'lingerie-tenue',
    title: 'Tenue speciale',
    description: 'Choisir une tenue, un accessoire ou un detail qui transforme la soiree.',
    intensity: 'sensuel'
  },
  {
    id: 'slow-teasing',
    title: 'Teasing tres lent',
    description: 'Faire monter la tension avec des pauses, des regards et des permissions explicites.',
    intensity: 'audacieux'
  },
  {
    id: 'messages-secrets',
    title: 'Messages secrets',
    description: 'Se donner des missions par petits mots, SMS ou cartes cachees.',
    intensity: 'doux'
  },
  {
    id: 'miroir',
    title: 'Jeu du miroir',
    description: 'Imiter les gestes de l autre, alterner le controle et explorer la synchronisation.',
    intensity: 'sensuel'
  },
  {
    id: 'roulette-accessoires',
    title: 'Accessoires surprises',
    description: 'Selectionner quelques accessoires autorises et laisser le hasard choisir leur ordre.',
    intensity: 'audacieux'
  }
];

export const roleplayScenarios: RoleplayScenario[] = [
  {
    id: 'suite-hotel',
    title: "La suite reservee sous un faux nom",
    themeIds: ['hotel-mystere', 'bar-inconnus', 'lingerie-tenue', 'slow-teasing'],
    intro: "Vous arrivez separement dans un hotel imaginaire. L'un connait le numero de la suite, l'autre doit le deviner en gagnant des indices par le charme.",
    roles: ['Le client mysterieux qui garde un secret', "La personne qui decide quels indices meritent d'etre reveles"],
    rules: [
      'Choisissez ensemble un mot stop avant de commencer.',
      'Chaque indice se gagne avec un compliment sincere, une question intime ou une consigne douce.',
      'La personne qui recoit une consigne peut la transformer en version plus confortable a tout moment.'
    ],
    ambiance: 'Lumiere tamisee, musique lounge, deux verres prepares comme dans un bar elegant.',
    consentReminder: 'Le mystere doit rester excitant, jamais flou sur les limites : validez chaque nouvelle idee a voix haute.'
  },
  {
    id: 'studio-prive',
    title: 'La seance photo confidentielle',
    themeIds: ['photographe-modele', 'atelier-artiste', 'lingerie-tenue', 'miroir'],
    intro: 'Un studio prive ouvre pour une seule seance. Le modele choisit ce qui peut etre regarde, le photographe transforme chaque detail en compliment.',
    roles: ['Le photographe attentif qui propose sans imposer', 'La muse qui dirige le niveau de glamour'],
    rules: [
      'Definissez les zones, poses et tenues autorisees avant de jouer.',
      'Alternez toutes les cinq minutes pour que chacun puisse guider la scene.',
      'Remplacez toute photo reelle par des poses imaginaires si vous preferez garder le moment sans trace.'
    ],
    ambiance: 'Une playlist feutree, un drap sombre, une lampe orientee comme un projecteur.',
    consentReminder: 'Aucune image ne doit etre prise, gardee ou partagee sans accord clair et renouvelable.'
  },
  {
    id: 'mission-seduction',
    title: 'Mission seduction',
    themeIds: ['espions', 'interrogatoire', 'messages-secrets', 'yeux-bandes'],
    intro: 'Deux agents doivent echanger un code secret. Pour verifier leur identite, ils se lancent des defis de confiance et des questions de plus en plus personnelles.',
    roles: ["L'agent qui protege le code", "L'agent qui doit le faire avouer avec elegance"],
    rules: [
      'Ecrivez trois missions courtes et piochez-les au hasard.',
      'Une mission peut toujours etre refusee ou remplacee par une question.',
      'Le code final est une envie commune que vous choisissez de realiser ou de garder pour plus tard.'
    ],
    ambiance: 'Film noir, veste sur les epaules, lumiere basse et murmures de conspiration.',
    consentReminder: 'Le jeu fonctionne mieux quand refuser fait partie du charme et ne casse jamais l ambiance.'
  },
  {
    id: 'spa-rituel',
    title: 'Le rituel du spa prive',
    themeIds: ['spa-prive', 'chef-invite', 'yeux-bandes', 'slow-teasing'],
    intro: 'Un spa ferme ses portes pour vous. Une personne accueille, l autre choisit le soin secret : massage, degustation, respiration ou simple proximite.',
    roles: ["L'hote du spa qui annonce chaque etape", "L'invite qui note le plaisir de 1 a 5"],
    rules: [
      'Annoncez chaque contact avant de le commencer.',
      'Gardez une serviette, une couverture ou une option cocon disponible.',
      'A la fin de chaque etape, demandez : continuer, changer ou faire une pause ?'
    ],
    ambiance: 'Serviettes chaudes, parfum doux, bol de fruits ou boisson fraiche.',
    consentReminder: 'La detente est le coeur du scenario : ralentissez des que l un de vous en a besoin.'
  },
  {
    id: 'cour-royale',
    title: 'Audience a la cour royale',
    themeIds: ['roi-reine', 'dominance-legere', 'cabaret', 'messages-secrets'],
    intro: 'La cour organise une audience privee. Une personne accorde des privileges, l autre tente de les meriter par des attentions, des promesses ou une performance.',
    roles: ['La personne souveraine qui distribue les privileges', 'La personne invitee qui negocie une faveur'],
    rules: [
      'Listez trois privileges doux possibles avant de commencer.',
      'Les ordres restent simples, reveribles et limites a ce qui a ete valide.',
      'Changez de role au milieu du jeu pour equilibrer le pouvoir.'
    ],
    ambiance: 'Un fauteuil comme trone, une tenue soignee, une phrase ceremonielle pour entrer dans le role.',
    consentReminder: 'Le pouvoir est un accessoire du jeu : chacun garde exactement le meme droit de pause et de refus.'
  },
  {
    id: 'cabaret-secret',
    title: 'Le cabaret apres minuit',
    themeIds: ['cabaret', 'masques', 'bar-inconnus', 'miroir'],
    intro: 'Apres minuit, le cabaret ne joue que pour deux. La scene peut etre une danse, une lecture, un regard ou une invitation a imiter.',
    roles: ["L'artiste qui choisit son numero", 'Le spectateur privilegie qui encourage et demande un rappel'],
    rules: [
      'Le numero dure une chanson maximum pour garder le jeu leger.',
      'Le spectateur ne touche pas sans invitation explicite.',
      'Le rappel doit etre une version plus douce ou plus drole si la personne sur scene le souhaite.'
    ],
    ambiance: 'Une chanson sensuelle, un foulard, une lumiere indirecte ou une bougie LED.',
    consentReminder: 'Applaudir, rire et ajuster le ton ensemble rend le moment plus complice.'
  },
  {
    id: 'bibliotheque-secrete',
    title: 'La bibliotheque des envies cachees',
    themeIds: ['bibliotheque', 'messages-secrets', 'interrogatoire', 'atelier-artiste'],
    intro: 'Une bibliotheque imaginaire conserve les envies que personne ne lit a voix haute. Vous piochez des cartes et transformez les reponses communes en scene.',
    roles: ['La personne qui garde les archives secretes', 'La personne qui obtient le droit de lire une page'],
    rules: [
      'Ecrivez chacun trois mots ou ambiances sur des papiers separes.',
      'Ne lisez que les papiers acceptes par les deux joueurs.',
      'Composez une mini-scene avec deux mots communs et gardez les autres pour une prochaine partie.'
    ],
    ambiance: 'Silence complice, plaid, carnet, stylo et voix basse.',
    consentReminder: 'Ce qui est ecrit reste prive et peut etre dechire ou efface immediatement.'
  },
  {
    id: 'voyage-imprevu',
    title: 'Escale imprevue en premiere classe',
    themeIds: ['voyage-premiere-classe', 'chef-invite', 'hotel-mystere', 'roulette-accessoires'],
    intro: 'Votre vol imaginaire est detourne vers une destination inconnue. Pour patienter, vous inventez les rituels exclusifs de la premiere classe.',
    roles: ["La personne qui annonce l'escale et les surprises", 'La personne qui choisit la prochaine destination'],
    rules: [
      'Choisissez trois destinations imaginaires et associez chacune a une ambiance.',
      'A chaque escale, une personne propose une attention et l autre la valide ou la modifie.',
      'Terminez par une promesse de voyage reel ou imaginaire a refaire ensemble.'
    ],
    ambiance: 'Valise entrouverte, chemise elegante, boisson servie comme en cabine.',
    consentReminder: 'Les surprises doivent rester dans la liste de ce que vous avez tous les deux autorise.'
  },
  {
    id: 'roulette-complice',
    title: 'La roulette des accessoires complices',
    themeIds: ['roulette-accessoires', 'dominance-legere', 'yeux-bandes', 'slow-teasing'],
    intro: 'Vous preparez quelques accessoires acceptes par tous les deux. La roulette choisit seulement l ordre, jamais une limite non discutee.',
    roles: ['La personne qui fait tourner la roulette', 'La personne qui choisit comment adapter le resultat'],
    rules: [
      'Retirez tout accessoire qui provoque une hesitation.',
      'Appliquez chaque tirage pendant deux minutes maximum avant de demander un feedback.',
      'Ajoutez une case pause ou calin pour respirer entre deux tirages.'
    ],
    ambiance: 'Petits papiers plies, boite opaque, chronometre doux et lumiere chaude.',
    consentReminder: 'Le hasard ne remplace jamais le consentement : il ne choisit que parmi vos oui communs.'
  }
];

export const fallbackRoleplayScenario: RoleplayScenario = {
  id: 'conversation-envies',
  title: 'La conversation des envies communes',
  themeIds: [],
  intro: 'Vos selections ne dessinent pas encore un scenario evident. Transformez cette partie en discussion tendre pour trouver une premiere envie confortable.',
  roles: ['La personne qui propose une ambiance douce', 'La personne qui ajuste les limites et le rythme'],
  rules: [
    'Chacun choisit un theme marque "A tester" et explique ce qui l intrigue.',
    'Gardez uniquement les idees qui donnent envie aux deux.',
    'Finissez par une micro-scene de deux minutes, tres simple, que vous pouvez arreter a tout moment.'
  ],
  ambiance: 'Canape, lumiere douce, carnet de notes et zero pression de performance.',
  consentReminder: 'Un non ou un peut-etre est une information utile, jamais une deception.'
};

export const findScenarioForMatches = (matches: RoleplayMatch[]): RoleplayScenario => {
  if (matches.length === 0) {
    return fallbackRoleplayScenario;
  }

  const matchedThemeIds = new Set(matches.map((match) => match.theme.id));
  const scoredScenarios = roleplayScenarios
    .map((scenario) => ({
      scenario,
      score: scenario.themeIds.filter((themeId) => matchedThemeIds.has(themeId)).length
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scoredScenarios[0]?.scenario ?? fallbackRoleplayScenario;
};
