import { ShootingChallenge, ShootingIntensity } from '../types';

export const shootingIntensityConfig: Record<ShootingIntensity, {
  label: string;
  color: string;
  gradient: string;
  border: string;
  icon: string;
  description: string;
}> = {
  soft: {
    label: 'Soft',
    color: 'text-sky-300',
    gradient: 'from-sky-500 to-blue-600',
    border: 'border-sky-500/40',
    icon: '🌸',
    description: 'Poses romantiques, regards tendres, ambiance douce',
  },
  hot: {
    label: 'Hot',
    color: 'text-amber-300',
    gradient: 'from-amber-500 to-orange-600',
    border: 'border-amber-500/40',
    icon: '🔥',
    description: 'Sensualité affirmée, poses suggestives, lingerie',
  },
  hard: {
    label: 'Hard',
    color: 'text-rose-300',
    gradient: 'from-rose-500 to-red-600',
    border: 'border-rose-500/40',
    icon: '💋',
    description: 'Déshabillage, poses très osées, corps mis en valeur',
  },
  extreme: {
    label: 'Extrême',
    color: 'text-fuchsia-300',
    gradient: 'from-fuchsia-600 to-pink-700',
    border: 'border-fuchsia-500/40',
    icon: '⚡',
    description: 'Mises en scène audacieuses, scénarios provocants',
  },
};

export const shootingChallenges: ShootingChallenge[] = [
  // ── SOFT ──────────────────────────────────────────────────────────────────────
  { id: 5001, intensity: 'soft', mediaType: 'photo', instruction: "Prends une photo de ton/ta partenaire avec un sourire complice et les yeux dans les yeux." },
  { id: 5002, intensity: 'soft', mediaType: 'photo', instruction: "Photographie ton/ta partenaire en train de te faire un câlin de dos, la tête sur ton épaule." },
  { id: 5003, intensity: 'soft', mediaType: 'photo', instruction: "Capture le moment où tu murmures quelque chose à l'oreille de ton/ta partenaire." },
  { id: 5004, intensity: 'soft', mediaType: 'photo', instruction: "Prends une photo de vos mains entrelacées de près." },
  { id: 5005, intensity: 'soft', mediaType: 'photo', instruction: "Photographie ton/ta partenaire en train de t'embrasser le front, avec une lumière douce." },
  { id: 5006, intensity: 'soft', mediaType: 'photo', instruction: "Prends une photo de ton/ta partenaire de profil, regard tourné vers la fenêtre, expression rêveuse." },
  { id: 5007, intensity: 'soft', mediaType: 'photo', instruction: "Capture ton/ta partenaire en train de te masser les épaules." },
  { id: 5008, intensity: 'soft', mediaType: 'video', instruction: "Filme ton/ta partenaire te faisant un massage des mains pendant 30 secondes.", durationSeconds: 30 },
  { id: 5009, intensity: 'soft', mediaType: 'video', instruction: "Filme un baiser tendre et prolongé de 15 secondes.", durationSeconds: 15 },
  { id: 5010, intensity: 'soft', mediaType: 'video', instruction: "Capture ton/ta partenaire te regardant avec tendresse pendant 20 secondes en silence.", durationSeconds: 20 },
  { id: 5011, intensity: 'soft', mediaType: 'photo', instruction: "Prends une photo de votre reflet ensemble dans un miroir, en vous tenant par la taille." },
  { id: 5012, intensity: 'soft', mediaType: 'photo', instruction: "Photographie ton/ta partenaire en train de te préparer une boisson, avec un sourire." },
  { id: 5013, intensity: 'soft', mediaType: 'photo', instruction: "Prends une photo artistique de ton/ta partenaire allongé(e), couverture tirée jusqu'aux épaules." },
  { id: 5014, intensity: 'soft', mediaType: 'video', instruction: "Filme ton/ta partenaire te chantant ou fredonnant une chanson douce pendant 20 secondes.", durationSeconds: 20 },
  { id: 5015, intensity: 'soft', mediaType: 'photo', instruction: "Capture l'instant où vous vous faites un câlin face caméra, visages rapprochés." },

  // ── HOT ───────────────────────────────────────────────────────────────────────
  { id: 5101, intensity: 'hot', mediaType: 'photo', instruction: "Photographie ton/ta partenaire en pose seduction, une main sur la hanche, regard intense." },
  { id: 5102, intensity: 'hot', mediaType: 'photo', instruction: "Prends une photo de ton/ta partenaire en train de mordre sa lèvre inférieure, regard caméra." },
  { id: 5103, intensity: 'hot', mediaType: 'photo', instruction: "Capture ton/ta partenaire assis(e) sur tes genoux, bras autour de ton cou." },
  { id: 5104, intensity: 'hot', mediaType: 'photo', instruction: "Photographie le dos nu de ton/ta partenaire, cheveux relevés, regard par-dessus l'épaule." },
  { id: 5105, intensity: 'hot', mediaType: 'photo', instruction: "Prends une photo de ton/ta partenaire en lingerie/sous-vêtements, pose allongée sur le lit." },
  { id: 5106, intensity: 'hot', mediaType: 'photo', instruction: "Capture le moment où tu embrasses le cou de ton/ta partenaire, une main sur sa taille." },
  { id: 5107, intensity: 'hot', mediaType: 'photo', instruction: "Photographie ton/ta partenaire contre un mur, bras au-dessus de la tête, regard provocant." },
  { id: 5108, intensity: 'hot', mediaType: 'video', instruction: "Filme ton/ta partenaire faisant un strip-tease léger (haut uniquement) pendant 30 secondes.", durationSeconds: 30 },
  { id: 5109, intensity: 'hot', mediaType: 'video', instruction: "Capture un baiser passionné de 20 secondes, mains de ton/ta partenaire dans tes cheveux.", durationSeconds: 20 },
  { id: 5110, intensity: 'hot', mediaType: 'video', instruction: "Filme ton/ta partenaire se caressant lentement le bras et l'épaule pendant 20 secondes.", durationSeconds: 20 },
  { id: 5111, intensity: 'hot', mediaType: 'photo', instruction: "Prends une photo de ton/ta partenaire en train d'enlever son haut, à mi-chemin, regard caméra." },
  { id: 5112, intensity: 'hot', mediaType: 'photo', instruction: "Photographie ton/ta partenaire de dos, en train de défaire son soutien-gorge/brassard." },
  { id: 5113, intensity: 'hot', mediaType: 'photo', instruction: "Capture vos silhouettes enlacées devant une lumière tamisée, ombres sur le mur." },
  { id: 5114, intensity: 'hot', mediaType: 'video', instruction: "Filme ton/ta partenaire dansant sensuellement pour toi pendant 30 secondes.", durationSeconds: 30 },
  { id: 5115, intensity: 'hot', mediaType: 'photo', instruction: "Prends une photo en plongée de ton/ta partenaire allongé(e), regard qui monte vers toi." },

  // ── HARD ──────────────────────────────────────────────────────────────────────
  { id: 5201, intensity: 'hard', mediaType: 'photo', instruction: "Photographie ton/ta partenaire en pose allongée, torse nu, une main sur le ventre." },
  { id: 5202, intensity: 'hard', mediaType: 'photo', instruction: "Prends une photo de ton/ta partenaire en sous-vêtements uniquement, debout, regard caméra, pose assurée." },
  { id: 5203, intensity: 'hard', mediaType: 'photo', instruction: "Capture ton/ta partenaire à quatre pattes, regard vers l'objectif, expression coquine." },
  { id: 5204, intensity: 'hard', mediaType: 'photo', instruction: "Photographie ton/ta partenaire en train de retirer son dernier vêtement, à l'instant précis." },
  { id: 5205, intensity: 'hard', mediaType: 'photo', instruction: "Prends une photo de ton/ta partenaire complètement dénudé(e), drap stratégiquement placé." },
  { id: 5206, intensity: 'hard', mediaType: 'photo', instruction: "Capture ton/ta partenaire assis(e) sur toi, vous deux enlacés, peu ou pas habillés." },
  { id: 5207, intensity: 'hard', mediaType: 'photo', instruction: "Photographie une caresse intime de ton/ta partenaire, gros plan sur les mains." },
  { id: 5208, intensity: 'hard', mediaType: 'video', instruction: "Filme ton/ta partenaire se caressant lentement le corps de la tête aux hanches pendant 30 secondes.", durationSeconds: 30 },
  { id: 5209, intensity: 'hard', mediaType: 'video', instruction: "Capture un moment intime où vous vous embrassez sans vêtements, pendant 20 secondes.", durationSeconds: 20 },
  { id: 5210, intensity: 'hard', mediaType: 'video', instruction: "Filme ton/ta partenaire en train de faire un strip-tease complet pendant 45 secondes.", durationSeconds: 45 },
  { id: 5211, intensity: 'hard', mediaType: 'photo', instruction: "Prends une photo de ton/ta partenaire dans la baignoire/douche, eau et mousse sur la peau." },
  { id: 5212, intensity: 'hard', mediaType: 'photo', instruction: "Photographie le corps nu de ton/ta partenaire en gros plan, zone au choix, jeu d'ombres." },
  { id: 5213, intensity: 'hard', mediaType: 'photo', instruction: "Capture ton/ta partenaire en pose soumise/dominante, expression intense, corps entier visible." },
  { id: 5214, intensity: 'hard', mediaType: 'video', instruction: "Filme un massage sensuel de ton/ta partenaire, dos nu, huile ou crème, pendant 45 secondes.", durationSeconds: 45 },
  { id: 5215, intensity: 'hard', mediaType: 'photo', instruction: "Prends une photo en contre-plongée de ton/ta partenaire au-dessus de toi, dominante." },

  // ── EXTRÊME ───────────────────────────────────────────────────────────────────
  { id: 5301, intensity: 'extreme', mediaType: 'photo', instruction: "Photographie ton/ta partenaire dans une pose suggestive très explicite, au lit, regard caméra." },
  { id: 5302, intensity: 'extreme', mediaType: 'photo', instruction: "Capture une scène de jeu de rôle : ton/ta partenaire en maître/maîtresse, accessoire au choix." },
  { id: 5303, intensity: 'extreme', mediaType: 'photo', instruction: "Prends une photo de ton/ta partenaire attaché(e) au lit avec une écharpe, expression complice." },
  { id: 5304, intensity: 'extreme', mediaType: 'photo', instruction: "Photographie ton/ta partenaire avec un aliment (chocolat, chantilly) sur le corps, à lécher." },
  { id: 5305, intensity: 'extreme', mediaType: 'photo', instruction: "Capture ton/ta partenaire dans une position du Kamasutra au choix, figée pour la photo." },
  { id: 5306, intensity: 'extreme', mediaType: 'video', instruction: "Filme une scène de jeu de rôle complète : l'inconnu(e) qui séduit, pendant 60 secondes.", durationSeconds: 60 },
  { id: 5307, intensity: 'extreme', mediaType: 'video', instruction: "Capture ton/ta partenaire exécutant trois ordres intimes que tu lui donnes, pendant 45 secondes.", durationSeconds: 45 },
  { id: 5308, intensity: 'extreme', mediaType: 'photo', instruction: "Photographie ton/ta partenaire bandant les yeux de quelqu'un (ou soi-même), sourire complice." },
  { id: 5309, intensity: 'extreme', mediaType: 'photo', instruction: "Prends une photo de ton/ta partenaire en tenue érotique au choix (latex, dentelle, etc.), pose dominante." },
  { id: 5310, intensity: 'extreme', mediaType: 'video', instruction: "Filme un teaser sensuel de ton/ta partenaire : préliminaires simulés pendant 60 secondes.", durationSeconds: 60 },
  { id: 5311, intensity: 'extreme', mediaType: 'photo', instruction: "Capture un instant intime très osé de votre choix, cadrage artistique, noir et blanc souhaité." },
  { id: 5312, intensity: 'extreme', mediaType: 'video', instruction: "Filme ton/ta partenaire se préparant pour toi : déshabillage, caresses, regards caméra, 45 secondes.", durationSeconds: 45 },
  { id: 5313, intensity: 'extreme', mediaType: 'photo', instruction: "Photographie ton/ta partenaire à genoux devant toi, regard vers le haut, expression soumise." },
  { id: 5314, intensity: 'extreme', mediaType: 'video', instruction: "Créez ensemble une courte scène de votre fantasme commun, filmée pendant 60 secondes.", durationSeconds: 60 },
  { id: 5315, intensity: 'extreme', mediaType: 'photo', instruction: "Prends la photo la plus audacieuse que vous osiez, cadrage libre, expression libre." },
];
