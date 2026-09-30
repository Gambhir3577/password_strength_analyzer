import type { PatternMatch } from '../../types/analyzer';

/**
 * Finds repeated characters (e.g. 'aaa', '1111') and repeating block substrings (e.g. 'abcabc').
 */
export function findRepeats(password: string): PatternMatch[] {
  const matches: PatternMatch[] = [];
  if (password.length < 3) return matches;

  // 1. Single character repetitions (3+ identical consecutive chars)
  const singleCharRegex = /(.)\1{2,}/g;
  let singleMatch;
  while ((singleMatch = singleCharRegex.exec(password)) !== null) {
    const token = singleMatch[0];
    const startIndex = singleMatch.index;
    matches.push({
      id: `repeat-char-${startIndex}-${token.length}`,
      type: 'repetition',
      token,
      startIndex,
      endIndex: startIndex + token.length,
      description: `Repeated character "${token[0]}" (${token.length} times)`,
      severity: token.length >= 4 ? 'high' : 'medium',
    });
  }

  // 2. Repeating block patterns (e.g. "passpass", "123123")
  for (let blockSize = 2; blockSize <= Math.floor(password.length / 2); blockSize++) {
    for (let i = 0; i <= password.length - blockSize * 2; i++) {
      const block = password.slice(i, i + blockSize);
      let count = 1;
      let nextIdx = i + blockSize;

      while (nextIdx + blockSize <= password.length && password.slice(nextIdx, nextIdx + blockSize) === block) {
        count++;
        nextIdx += blockSize;
      }

      if (count >= 2) {
        const fullLength = count * blockSize;
        const token = password.slice(i, i + fullLength);
        
        // Avoid adding if already covered by single char repeat
        const alreadyCovered = matches.some(
          m => m.startIndex <= i && m.endIndex >= i + fullLength && m.token.split('').every(c => c === m.token[0])
        );

        if (!alreadyCovered) {
          matches.push({
            id: `repeat-block-${i}-${fullLength}`,
            type: 'repetition',
            token,
            startIndex: i,
            endIndex: i + fullLength,
            description: `Repeated sequence block "${block}" (${count} times)`,
            severity: 'high',
          });
        }
        i += fullLength - 1; // skip ahead
      }
    }
  }

  return matches;
}
