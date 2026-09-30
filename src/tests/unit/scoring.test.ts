import { describe, it, expect } from 'vitest';
import { analyzePassword } from '../../engine/scoring';

describe('Scoring Engine', () => {
  it('identifies very weak passwords correctly', () => {
    const weakList = ['123456', 'password', 'qwerty', 'admin', 'abc'];
    for (const pwd of weakList) {
      const res = analyzePassword(pwd);
      expect(res.score).toBeLessThanOrEqual(1);
      expect(['Very Weak', 'Weak']).toContain(res.level);
    }
  });

  it('identifies medium passwords correctly', () => {
    const mediumRes = analyzePassword('Tr0ub4dor&3');
    expect(mediumRes.score).toBeGreaterThanOrEqual(1);
    expect(mediumRes.feedback.suggestions.length).toBeGreaterThan(0);
  });

  it('identifies strong Diceware passphrases correctly', () => {
    const strongRes = analyzePassword('correct-horse-battery-staple');
    expect(strongRes.score).toBeGreaterThanOrEqual(3);
    expect(['Strong', 'Very Strong']).toContain(strongRes.level);
    expect(strongRes.entropyBits).toBeGreaterThan(50);
  });

  it('identifies complex high-entropy passwords correctly', () => {
    const highEntropyRes = analyzePassword('vX8#mK9!qL2$zP1~');
    expect(highEntropyRes.score).toBeGreaterThanOrEqual(3);
    expect(highEntropyRes.variety.hasLowercase).toBe(true);
    expect(highEntropyRes.variety.hasUppercase).toBe(true);
    expect(highEntropyRes.variety.hasDigits).toBe(true);
    expect(highEntropyRes.variety.hasSymbols).toBe(true);
  });

  it('provides detailed crack times across 4 scenarios', () => {
    const res = analyzePassword('password123');
    expect(res.crackTimes.length).toBe(4);
    expect(res.crackTimes.map(c => c.scenario)).toEqual([
      'online_throttled',
      'online_unthrottled',
      'offline_slow_hash',
      'offline_fast_hash',
    ]);
  });
});
