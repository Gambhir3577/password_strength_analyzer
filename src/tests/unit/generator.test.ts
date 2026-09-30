import { describe, it, expect } from 'vitest';
import { generateRandomPassword, generatePassphrase } from '../../engine/generator';

describe('Password & Passphrase Generator', () => {
  it('generates random password with specified length and character sets', () => {
    const pwd = generateRandomPassword({
      length: 18,
      includeLowercase: true,
      includeUppercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
    });

    expect(pwd.length).toBe(18);
    expect(/[a-z]/.test(pwd)).toBe(true);
    expect(/[A-Z]/.test(pwd)).toBe(true);
    expect(/[0-9]/.test(pwd)).toBe(true);
  });

  it('excludes ambiguous characters when requested', () => {
    for (let i = 0; i < 20; i++) {
      const pwd = generateRandomPassword({
        length: 24,
        includeLowercase: true,
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeAmbiguous: true,
      });
      expect(/[0Ol1I|`]/.test(pwd)).toBe(false);
    }
  });

  it('generates multi-word Diceware passphrases with custom delimiters', () => {
    const passphrase = generatePassphrase({
      wordCount: 4,
      delimiter: '-',
      capitalize: 'first',
      includeNumber: false,
    });

    const parts = passphrase.split('-');
    expect(parts.length).toBe(4);
    for (const part of parts) {
      expect(part[0]).toBe(part[0].toUpperCase());
    }
  });
});
