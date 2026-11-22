// The backend stores every amount in kobo (a whole number).
// ₦1 = 100 kobo, so ₦55,000 is sent as 5500000.

/**
 * Turns what the user typed into a naira number.
 * Commas and spaces are allowed: "55,000" → 55000, "1 250.50" → 1250.5
 * Returns null if the text is not a valid amount with at most 2 decimal places.
 */
export function parseNaira(text: string): number | null {
  const cleaned = text.replace(/[,\s]/g, '');

  // Digits, then optionally a dot and 1 or 2 more digits
  const isValidAmount = /^\d+(\.\d{1,2})?$/.test(cleaned);
  if (!isValidAmount) return null;

  return Number(cleaned);
}

/**
 * Naira → kobo, for sending to the API. 550.5 → 55050
 * Math.round fixes tiny decimal errors (e.g. 19.99 * 100 = 1998.9999...).
 */
export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

/** Kobo → naira, for showing an API amount in a form. 55050 → 550.5 */
export function koboToNaira(kobo: number): number {
  return kobo / 100;
}
