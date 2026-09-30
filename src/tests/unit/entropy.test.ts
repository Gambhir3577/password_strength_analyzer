import { describe, it, expect } from 'vitest';
import { analyzeCharacterVariety, calculateRawEntropy, calculateShannonEntropy } from '../../engine/entropy';

describe('Entropy and Character Variety Analysis', () => {
  it('correctly calculates empty string metrics', () => {
    const variety = analyzeCharacterVariety('');
    expect(variety.length).toBe(0);
    expect(variety.poolSize).toBe(0);
    expect(calculateRawEntropy('', variety)).toBe(0);
    expect(calculateShannonEntropy('')).toBe(0);
  });

  it('correctly calculates character variety breakdown', () => {
    const variety = analyzeCharacterVariety('Abc123!@#');
    expect(variety.length).toBe(9);
    expect(variety.lowercase).toBe(2);
    expect(variety.uppercase).toBe(1);
    expect(variety.digits).toBe(3);
    expect(variety.symbols).toBe(3);
    expect(variety.hasLowercase).toBe(true);
    expect(variety.hasUppercase).toBe(true);
    expect(variety.hasDigits).toBe(true);
    expect(variety.hasSymbols).toBe(true);
    // Pool size: 26 + 26 + 10 + 33 = 95
    expect(variety.poolSize).toBe(95);
  });

  it('calculates theoretical raw entropy', () => {
    const variety = analyzeCharacterVariety('abcdefgh'); // 8 lowercase letters
    const raw = calculateRawEntropy('abcdefgh', variety);
    // 8 * log2(26) ≈ 8 * 4.7004 = 37.6
    expect(raw).toBeCloseTo(37.6, 1);
  });

  it('calculates Shannon entropy detecting uniform vs repetitive distributions', () => {
    const repetitive = calculateShannonEntropy('aaaaa');
    const diverse = calculateShannonEntropy('abcde');
    expect(repetitive).toBe(0);
    expect(diverse).toBeGreaterThan(10);
  });
});
