export type GeneratorMode = 'password' | 'passphrase';

export interface PasswordGeneratorOptions {
  length: number;
  includeLowercase: boolean;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean; // e.g., 0, O, l, 1, I, |
}

export type PassphraseCapitalization = 'none' | 'first' | 'all' | 'random';

export interface PassphraseGeneratorOptions {
  wordCount: number;
  delimiter: string;
  capitalize: PassphraseCapitalization;
  includeNumber: boolean;
}
