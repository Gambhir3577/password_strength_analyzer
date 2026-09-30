import type { PatternMatch } from '../../types/analyzer';

// Standard QWERTY rows, columns, and slants
const QWERTY_SEQUENCES = [
  // Horizontal rows
  '`1234567890-=',
  'qwertyuiop[]\\',
  "asdfghjkl;'",
  'zxcvbnm,./',

  // Vertical slants (standard QWERTY columns)
  '1qaz',
  '2wsx',
  '3edc',
  '4rfv',
  '5tgb',
  '6yhn',
  '7ujm',
  '8ik,',
  '9ol.',
  '0p;/',
  '-[\'',

  // Keypad rows and columns
  '789',
  '456',
  '123',
  '7410',
  '852.',
  '963',
];

/**
 * Checks if a string contains keyboard walks (e.g. "qwerty", "asdfgh", "1qaz", "789654").
 */
export function findKeyboardWalks(password: string): PatternMatch[] {
  const matches: PatternMatch[] = [];
  const lower = password.toLowerCase();
  const minLength = 3;

  for (const seq of QWERTY_SEQUENCES) {
    for (let len = minLength; len <= seq.length; len++) {
      for (let i = 0; i <= seq.length - len; i++) {
        const forward = seq.slice(i, i + len);
        const reverse = forward.split('').reverse().join('');

        // Forward check
        let idx = lower.indexOf(forward);
        while (idx !== -1) {
          matches.push({
            id: `kb-fwd-${idx}-${len}`,
            type: 'keyboard_walk',
            token: password.slice(idx, idx + len),
            startIndex: idx,
            endIndex: idx + len,
            description: `Keyboard walk pattern ("${forward}")`,
            severity: len >= 4 ? 'high' : 'medium',
          });
          idx = lower.indexOf(forward, idx + 1);
        }

        // Reverse check
        let revIdx = lower.indexOf(reverse);
        while (revIdx !== -1) {
          matches.push({
            id: `kb-rev-${revIdx}-${len}`,
            type: 'keyboard_walk',
            token: password.slice(revIdx, revIdx + len),
            startIndex: revIdx,
            endIndex: revIdx + len,
            description: `Reverse keyboard walk pattern ("${reverse}")`,
            severity: len >= 4 ? 'high' : 'medium',
          });
          revIdx = lower.indexOf(reverse, revIdx + 1);
        }
      }
    }
  }

  return filterLongestMatches(matches);
}

function filterLongestMatches(matches: PatternMatch[]): PatternMatch[] {
  // Sort by token length descending
  const sorted = [...matches].sort((a, b) => (b.endIndex - b.startIndex) - (a.endIndex - a.startIndex));
  const result: PatternMatch[] = [];

  for (const match of sorted) {
    const isCovered = result.some(
      (existing) =>
        match.startIndex >= existing.startIndex && match.endIndex <= existing.endIndex
    );
    if (!isCovered) {
      result.push(match);
    }
  }

  return result.sort((a, b) => a.startIndex - b.startIndex);
}
