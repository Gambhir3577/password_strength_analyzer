import type { CharacterVariety } from '../types/analyzer';

/**
 * Calculates character variety metrics and pool size for a given string.
 */
export function analyzeCharacterVariety(password: string): CharacterVariety {
  if (!password) {
    return {
      length: 0,
      lowercase: 0,
      uppercase: 0,
      digits: 0,
      symbols: 0,
      unicode: 0,
      spaceCount: 0,
      poolSize: 0,
      hasLowercase: false,
      hasUppercase: false,
      hasDigits: false,
      hasSymbols: false,
      hasUnicode: false,
    };
  }

  let lowercase = 0;
  let uppercase = 0;
  let digits = 0;
  let symbols = 0;
  let unicode = 0;
  let spaceCount = 0;

  for (const char of password) {
    const code = char.codePointAt(0) || 0;
    if (char === ' ') {
      spaceCount++;
    } else if (/[a-z]/.test(char)) {
      lowercase++;
    } else if (/[A-Z]/.test(char)) {
      uppercase++;
    } else if (/[0-9]/.test(char)) {
      digits++;
    } else if (/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/.test(char)) {
      symbols++;
    } else if (code > 127) {
      unicode++;
    } else {
      symbols++;
    }
  }

  let poolSize = 0;
  if (lowercase > 0) poolSize += 26;
  if (uppercase > 0) poolSize += 26;
  if (digits > 0) poolSize += 10;
  if (symbols > 0) poolSize += 33;
  if (spaceCount > 0) poolSize += 1;
  if (unicode > 0) poolSize += 100; // conservative unicode character set weight

  return {
    length: password.length,
    lowercase,
    uppercase,
    digits,
    symbols,
    unicode,
    spaceCount,
    poolSize,
    hasLowercase: lowercase > 0,
    hasUppercase: uppercase > 0,
    hasDigits: digits > 0,
    hasSymbols: symbols > 0,
    hasUnicode: unicode > 0,
  };
}

/**
 * Calculates theoretical raw entropy (bits) = length * log2(poolSize)
 */
export function calculateRawEntropy(_password: string, variety: CharacterVariety): number {
  if (variety.length === 0 || variety.poolSize === 0) return 0;
  const entropy = variety.length * Math.log2(variety.poolSize);
  return Math.round(entropy * 10) / 10;
}

/**
 * Calculates Shannon Entropy based on character frequency distribution.
 */
export function calculateShannonEntropy(password: string): number {
  if (!password) return 0;
  const len = password.length;
  const frequencies: Record<string, number> = {};

  for (const char of password) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }

  let shannonBits = 0;
  for (const count of Object.values(frequencies)) {
    const p = count / len;
    shannonBits -= p * Math.log2(p);
  }

  // Multiply by length to get total information content bits
  return Math.round(shannonBits * len * 10) / 10;
}
