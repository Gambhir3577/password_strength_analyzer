import type { PatternMatch } from '../../types/analyzer';

/**
 * Detects alphabetical (abcde, zyxwv) and numerical (12345, 98765) sequences.
 */
export function findSequences(password: string): PatternMatch[] {
  const matches: PatternMatch[] = [];
  if (password.length < 3) return matches;

  let currentRunStart = 0;
  let currentDelta = 0;
  let runLength = 1;

  for (let i = 1; i < password.length; i++) {
    const prevChar = password.charCodeAt(i - 1);
    const currChar = password.charCodeAt(i);
    const delta = currChar - prevChar;

    // Check if consecutive in ASCII order (delta = +1 or delta = -1)
    const isAlphabetical =
      (/[a-zA-Z]/.test(password[i - 1]) && /[a-zA-Z]/.test(password[i])) &&
      (delta === 1 || delta === -1);

    const isNumerical =
      (/[0-9]/.test(password[i - 1]) && /[0-9]/.test(password[i])) &&
      (delta === 1 || delta === -1);

    if ((isAlphabetical || isNumerical) && (runLength === 1 || delta === currentDelta)) {
      currentDelta = delta;
      runLength++;
    } else {
      if (runLength >= 3) {
        const token = password.slice(currentRunStart, currentRunStart + runLength);
        const direction = currentDelta > 0 ? 'ascending' : 'descending';
        const typeStr = /[0-9]/.test(token[0]) ? 'numerical' : 'alphabetical';
        matches.push({
          id: `seq-${currentRunStart}-${runLength}`,
          type: 'sequence',
          token,
          startIndex: currentRunStart,
          endIndex: currentRunStart + runLength,
          description: `Predictable ${direction} ${typeStr} sequence ("${token}")`,
          severity: runLength >= 4 ? 'high' : 'medium',
        });
      }
      currentRunStart = i;
      runLength = 1;
      currentDelta = 0;
    }
  }

  if (runLength >= 3) {
    const token = password.slice(currentRunStart, currentRunStart + runLength);
    const direction = currentDelta > 0 ? 'ascending' : 'descending';
    const typeStr = /[0-9]/.test(token[0]) ? 'numerical' : 'alphabetical';
    matches.push({
      id: `seq-${currentRunStart}-${runLength}`,
      type: 'sequence',
      token,
      startIndex: currentRunStart,
      endIndex: currentRunStart + runLength,
      description: `Predictable ${direction} ${typeStr} sequence ("${token}")`,
      severity: runLength >= 4 ? 'high' : 'medium',
    });
  }

  return matches;
}
