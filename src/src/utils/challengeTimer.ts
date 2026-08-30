// Extracts a duration in seconds from a challenge text.
// Supports French phrasing: "pendant 2 minutes", "de 1 minute", "30 secondes",
// "pendant 30 secondes", "en 30 secondes", "1 minute", "2 minutes".
export function parseDurationSeconds(text: string): number | null {
  if (!text) return null;

  // "X minutes" or "X minute"
  const minutesMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:minute)s?/i);
  if (minutesMatch) {
    const value = parseFloat(minutesMatch[1].replace(',', '.'));
    if (!isNaN(value) && value > 0) return Math.round(value * 60);
  }

  // "X secondes" or "X seconde"
  const secondsMatch = text.match(/(\d+(?:[.,]\d+)?)\s*secondes?/i);
  if (secondsMatch) {
    const value = parseFloat(secondsMatch[1].replace(',', '.'));
    if (!isNaN(value) && value > 0) return Math.round(value);
  }

  return null;
}

// Challenges that require physical preparation before the timer can start:
// bondage, blindfolding, stripping, getting into position, etc.
const PREPARATION_KEYWORDS = [
  'attache',
  'bande les yeux',
  'bande-lui les yeux',
  'immobilise',
  'menotte',
  'plaque',
  'mets-toi à quatre pattes',
  'allonge',
  'retire un vêtement',
  'strip-tease',
  'mets dans une position',
  'soumets',
  'impose une position',
  'retourne',
];

export function requiresPreparation(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return PREPARATION_KEYWORDS.some(kw => lower.includes(kw));
}
