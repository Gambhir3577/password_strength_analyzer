import type { PatternMatch } from '../../types/analyzer';

const LEET_TABLE: Record<string, string[]> = {
  a: ['4', '@'],
  b: ['8'],
  c: ['(', '<', '{'],
  e: ['3'],
  g: ['9', '6'],
  i: ['1', '!', '|'],
  l: ['1', '|'],
  o: ['0'],
  s: ['5', '$'],
  t: ['7', '+'],
  z: ['2'],
};

/**
 * Normalizes a leet-substituted string back to its potential base characters.
 */
export function unleet(text: string): { normalized: string; substitutions: { index: number; original: string; decoded: string }[] } {
  let normalized = '';
  const substitutions: { index: number; original: string; decoded: string }[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    let decodedChar = char.toLowerCase();
    let foundSub = false;

    for (const [letter, subs] of Object.entries(LEET_TABLE)) {
      if (subs.includes(char)) {
        decodedChar = letter;
        substitutions.push({ index: i, original: char, decoded: letter });
        foundSub = true;
        break;
      }
    }

    normalized += foundSub ? decodedChar : char.toLowerCase();
  }

  return { normalized, substitutions };
}

/**
 * Detects if a token is using l33t substitutions over a dictionary word.
 */
export function findLeetSubstitutions(password: string, knownWords: Set<string>): PatternMatch[] {
  const matches: PatternMatch[] = [];
  const { normalized, substitutions } = unleet(password);

  if (substitutions.length === 0) return matches;

  // Search for dictionary words inside the un-leeted string
  for (const word of knownWords) {
    if (word.length < 3) continue;
    let idx = normalized.indexOf(word);
    while (idx !== -1) {
      const originalToken = password.slice(idx, idx + word.length);
      const tokenSubs = substitutions.filter(s => s.index >= idx && s.index < idx + word.length);

      if (tokenSubs.length > 0) {
        matches.push({
          id: `leet-${idx}-${word.length}`,
          type: 'leet_sub',
          token: originalToken,
          startIndex: idx,
          endIndex: idx + word.length,
          description: `L33t speak substitution for word "${word}" (e.g. ${tokenSubs.map(s => `'${s.original}' for '${s.decoded}'`).join(', ')})`,
          severity: 'high',
        });
      }

      idx = normalized.indexOf(word, idx + 1);
    }
  }

  return matches;
}
