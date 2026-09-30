import type { PasswordGeneratorOptions, PassphraseGeneratorOptions } from '../types/generator';
import { EFF_WORDLIST } from './wordlist';

const CHARSET_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const CHARSET_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CHARSET_NUMBERS = '0123456789';
const CHARSET_SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS_CHARS = new Set(['0', 'O', 'o', 'l', '1', 'I', '|', '`', '\'']);

/**
 * Cryptographically secure random integer in range [0, max - 1] with rejection sampling to avoid modulo bias.
 */
export function getSecureRandomInt(max: number): number {
  if (max <= 0) return 0;
  if (max === 1) return 0;

  const uint32Max = 0xffffffff;
  const limit = uint32Max - (uint32Max % max);
  const buffer = new Uint32Array(1);

  let randomVal: number;
  do {
    crypto.getRandomValues(buffer);
    randomVal = buffer[0];
  } while (randomVal >= limit);

  return randomVal % max;
}

/**
 * Shuffles an array in place using Fisher-Yates with crypto.getRandomValues.
 */
export function secureShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates a random character-based password according to options.
 */
export function generateRandomPassword(options: PasswordGeneratorOptions): string {
  let lowerPool = CHARSET_LOWER;
  let upperPool = CHARSET_UPPER;
  let numPool = CHARSET_NUMBERS;
  let symPool = CHARSET_SYMBOLS;

  if (options.excludeAmbiguous) {
    lowerPool = lowerPool.split('').filter(c => !AMBIGUOUS_CHARS.has(c)).join('');
    upperPool = upperPool.split('').filter(c => !AMBIGUOUS_CHARS.has(c)).join('');
    numPool = numPool.split('').filter(c => !AMBIGUOUS_CHARS.has(c)).join('');
    symPool = symPool.split('').filter(c => !AMBIGUOUS_CHARS.has(c)).join('');
  }

  const activePools: string[] = [];
  const requiredChars: string[] = [];

  if (options.includeLowercase && lowerPool.length > 0) {
    activePools.push(lowerPool);
    requiredChars.push(lowerPool[getSecureRandomInt(lowerPool.length)]);
  }
  if (options.includeUppercase && upperPool.length > 0) {
    activePools.push(upperPool);
    requiredChars.push(upperPool[getSecureRandomInt(upperPool.length)]);
  }
  if (options.includeNumbers && numPool.length > 0) {
    activePools.push(numPool);
    requiredChars.push(numPool[getSecureRandomInt(numPool.length)]);
  }
  if (options.includeSymbols && symPool.length > 0) {
    activePools.push(symPool);
    requiredChars.push(symPool[getSecureRandomInt(symPool.length)]);
  }

  // Fallback if no pools selected
  if (activePools.length === 0) {
    activePools.push(CHARSET_LOWER);
    requiredChars.push(CHARSET_LOWER[getSecureRandomInt(CHARSET_LOWER.length)]);
  }

  const combinedPool = activePools.join('');
  const length = Math.max(requiredChars.length, options.length);
  const passwordChars = [...requiredChars];

  while (passwordChars.length < length) {
    const randomChar = combinedPool[getSecureRandomInt(combinedPool.length)];
    passwordChars.push(randomChar);
  }

  return secureShuffle(passwordChars).join('');
}

/**
 * Generates a Diceware-style multi-word passphrase.
 */
export function generatePassphrase(options: PassphraseGeneratorOptions): string {
  const count = Math.max(3, Math.min(12, options.wordCount));
  const chosenWords: string[] = [];

  for (let i = 0; i < count; i++) {
    const wordIndex = getSecureRandomInt(EFF_WORDLIST.length);
    let word = EFF_WORDLIST[wordIndex];

    switch (options.capitalize) {
      case 'first':
        word = word.charAt(0).toUpperCase() + word.slice(1);
        break;
      case 'all':
        word = word.toUpperCase();
        break;
      case 'random':
        if (getSecureRandomInt(2) === 1) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        break;
      case 'none':
      default:
        word = word.toLowerCase();
        break;
    }

    chosenWords.push(word);
  }

  if (options.includeNumber) {
    const randomDigit = getSecureRandomInt(100);
    const insertIndex = getSecureRandomInt(chosenWords.length);
    chosenWords[insertIndex] = `${chosenWords[insertIndex]}${randomDigit}`;
  }

  return chosenWords.join(options.delimiter);
}
