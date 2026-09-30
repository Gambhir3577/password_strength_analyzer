import type { PatternMatch } from '../../types/analyzer';

// Curated high-frequency common passwords and root dictionary words
export const COMMON_DICTIONARY_WORDS = new Set([
  'password', 'pass', 'admin', 'administrator', 'welcome', 'login', 'monkey', 'dragon',
  'football', 'baseball', 'basketball', 'master', 'sunshine', 'princess', 'shadow',
  'superman', 'batman', 'michael', 'jessica', 'charlie', 'computer', 'secret',
  'security', 'system', 'default', 'access', 'freedom', 'trust', 'orange',
  'coffee', 'winter', 'summer', 'autumn', 'spring', 'family', 'yellow',
  'purple', 'guitar', 'guitarist', 'guitarhero', 'doctor', 'matrix', 'hunter',
  'robert', 'daniel', 'thomas', 'george', 'william', 'jordan', 'starwars',
  'pokemon', 'testing', 'testing123', 'iloveyou', 'iloveme', 'changeit',
  'letmein', 'trustno1', 'qwerty', 'keyboard', 'internet', 'server',
]);

/**
 * Searches for plain dictionary words and top common passwords in the input.
 */
export function findDictionaryWords(password: string): PatternMatch[] {
  const matches: PatternMatch[] = [];
  const lower = password.toLowerCase();

  for (const word of COMMON_DICTIONARY_WORDS) {
    if (word.length < 3) continue;
    let idx = lower.indexOf(word);
    while (idx !== -1) {
      matches.push({
        id: `dict-${idx}-${word.length}`,
        type: 'dictionary',
        token: password.slice(idx, idx + word.length),
        startIndex: idx,
        endIndex: idx + word.length,
        description: `Common dictionary word or frequent password ("${word}")`,
        severity: word.length >= 6 || word === 'password' || word === 'admin' ? 'high' : 'medium',
      });
      idx = lower.indexOf(word, idx + 1);
    }
  }

  // Deduplicate nested / covered matches
  return matches.sort((a, b) => (b.endIndex - b.startIndex) - (a.endIndex - a.startIndex))
    .filter((match, index, self) =>
      !self.slice(0, index).some(other => match.startIndex >= other.startIndex && match.endIndex <= other.endIndex)
    )
    .sort((a, b) => a.startIndex - b.startIndex);
}
