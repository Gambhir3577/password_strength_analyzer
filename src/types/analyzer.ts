export type StrengthScore = 0 | 1 | 2 | 3 | 4;

export type StrengthLevel = 
  | 'Very Weak' 
  | 'Weak' 
  | 'Fair' 
  | 'Strong' 
  | 'Very Strong';

export interface CharacterVariety {
  length: number;
  lowercase: number;
  uppercase: number;
  digits: number;
  symbols: number;
  unicode: number;
  spaceCount: number;
  poolSize: number;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasDigits: boolean;
  hasSymbols: boolean;
  hasUnicode: boolean;
}

export type PatternType = 
  | 'dictionary' 
  | 'keyboard_walk' 
  | 'sequence' 
  | 'repetition' 
  | 'date' 
  | 'leet_sub' 
  | 'user_input';

export interface PatternMatch {
  id: string;
  type: PatternType;
  token: string;
  startIndex: number;
  endIndex: number;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export type CrackScenario = 
  | 'online_throttled' 
  | 'online_unthrottled' 
  | 'offline_slow_hash' 
  | 'offline_fast_hash';

export interface ScenarioCrackTime {
  scenario: CrackScenario;
  label: string;
  description: string;
  guessesPerSecond: number;
  seconds: number;
  displayTime: string;
}

export interface ActionableFeedback {
  warning?: string;
  suggestions: string[];
  positiveObservations: string[];
}

export interface UserContext {
  name?: string;
  email?: string;
  username?: string;
  customTokens?: string[];
}

export interface PasswordAnalysisResult {
  passwordLength: number;
  score: StrengthScore;
  level: StrengthLevel;
  entropyBits: number;
  estimatedGuesses: number;
  variety: CharacterVariety;
  patterns: PatternMatch[];
  crackTimes: ScenarioCrackTime[];
  feedback: ActionableFeedback;
  analysisTimeMs: number;
}
