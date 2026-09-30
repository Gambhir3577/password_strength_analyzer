import { describe, it, expect } from 'vitest';
import { findKeyboardWalks } from '../../engine/patterns/keyboard';
import { findSequences } from '../../engine/patterns/sequences';
import { findRepeats } from '../../engine/patterns/repeats';
import { findDates } from '../../engine/patterns/dates';
import { findLeetSubstitutions } from '../../engine/patterns/leet';
import { findDictionaryWords, COMMON_DICTIONARY_WORDS } from '../../engine/patterns/dictionary';
import { findUserContextMatches } from '../../engine/patterns/userInputs';

describe('Pattern Matchers', () => {
  it('detects QWERTY horizontal and vertical keyboard walks', () => {
    const walks1 = findKeyboardWalks('qwerty');
    expect(walks1.length).toBeGreaterThan(0);
    expect(walks1[0].token.toLowerCase()).toBe('qwerty');

    const walks2 = findKeyboardWalks('1qaz2wsx');
    expect(walks2.some(w => w.token.toLowerCase().includes('1qaz'))).toBe(true);

    const walks3 = findKeyboardWalks('asdfgh');
    expect(walks3.some(w => w.token.toLowerCase().includes('asdf'))).toBe(true);
  });

  it('detects ascending and descending numerical and alphabetical sequences', () => {
    const seqNum = findSequences('123456');
    expect(seqNum.length).toBeGreaterThan(0);
    expect(seqNum[0].token).toBe('123456');

    const seqAlpha = findSequences('abcdef');
    expect(seqAlpha.length).toBeGreaterThan(0);
    expect(seqAlpha[0].token).toBe('abcdef');

    const seqRev = findSequences('987654');
    expect(seqRev.length).toBeGreaterThan(0);
    expect(seqRev[0].token).toBe('987654');
  });

  it('detects character and block repetitions', () => {
    const charRep = findRepeats('passwordaaaa123');
    expect(charRep.some(r => r.token === 'aaaa')).toBe(true);

    const blockRep = findRepeats('abcabcabc');
    expect(blockRep.some(r => r.token === 'abcabcabc')).toBe(true);
  });

  it('detects full dates and years', () => {
    const dateMatch = findDates('pass2024summer');
    expect(dateMatch.some(d => d.token === '2024')).toBe(true);

    const fullDate = findDates('user_1998-05-12_secret');
    expect(fullDate.some(d => d.token === '1998-05-12')).toBe(true);
  });

  it('detects l33t speak substitutions', () => {
    const leetMatch = findLeetSubstitutions('p@ssw0rd3', COMMON_DICTIONARY_WORDS);
    expect(leetMatch.length).toBeGreaterThan(0);
    expect(leetMatch[0].description).toContain('L33t speak substitution');
  });

  it('detects dictionary words', () => {
    const dict = findDictionaryWords('mysecretpassword123');
    expect(dict.some(d => d.token.toLowerCase() === 'password')).toBe(true);
    expect(dict.some(d => d.token.toLowerCase() === 'secret')).toBe(true);
  });

  it('detects user-provided personal context and leet-obfuscated names', () => {
    const userMatches = findUserContextMatches('Alice123!', {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      username: 'alicej',
    });
    expect(userMatches.some(u => u.token.toLowerCase() === 'alice')).toBe(true);

    const leetUserMatches = findUserContextMatches('@l1ce123', {
      username: 'alice',
    });
    expect(leetUserMatches.length).toBeGreaterThan(0);
  });
});
