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
