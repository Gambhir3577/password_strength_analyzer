import { ZxcvbnFactory } from '@zxcvbn-ts/core';
import { dictionary as commonDict, adjacencyGraphs } from '@zxcvbn-ts/language-common';
import { dictionary as enDict, translations as enTranslations } from '@zxcvbn-ts/language-en';
import type {
  PasswordAnalysisResult,
  PatternMatch,
  StrengthLevel,
  StrengthScore,
  UserContext,
} from '../types/analyzer';
import { analyzeCharacterVariety, calculateRawEntropy } from './entropy';
import { findKeyboardWalks } from './patterns/keyboard';
import { findSequences } from './patterns/sequences';
import { findRepeats } from './patterns/repeats';
import { findDates } from './patterns/dates';
import { findLeetSubstitutions } from './patterns/leet';
import { findDictionaryWords, COMMON_DICTIONARY_WORDS } from './patterns/dictionary';
import { findUserContextMatches } from './patterns/userInputs';
import { calculateCrackTimes } from './crackTimes';
import { generateActionableFeedback } from './feedback';

// Initialize zxcvbn instance with English and common dictionaries
const zxcvbnInstance = new ZxcvbnFactory({
  translations: enTranslations,
  graphs: adjacencyGraphs,
  dictionary: {
    ...commonDict,
    ...enDict,
  },
});

const SCORE_LEVEL_MAP: Record<StrengthScore, StrengthLevel> = {
  0: 'Very Weak',
  1: 'Weak',
  2: 'Fair',
  3: 'Strong',
  4: 'Very Strong',
};

/**
 * Full local password analysis engine.
 */
export function analyzePassword(password: string, userContext?: UserContext): PasswordAnalysisResult {
  const startTime = performance.now();

  if (!password) {
    const variety = analyzeCharacterVariety('');
    return {
      passwordLength: 0,
      score: 0,
      level: 'Very Weak',
      entropyBits: 0,
      estimatedGuesses: 1,
      variety,
      patterns: [],
      crackTimes: calculateCrackTimes(1),
      feedback: generateActionableFeedback('', 0, variety, []),
      analysisTimeMs: 0,
    };
  }

  // 1. Calculate variety & raw entropy
  const variety = analyzeCharacterVariety(password);
  const rawEntropy = calculateRawEntropy(password, variety);

  // 2. Custom pattern detection
  const patterns: PatternMatch[] = [];
  patterns.push(...findDictionaryWords(password));
  patterns.push(...findKeyboardWalks(password));
  patterns.push(...findSequences(password));
  patterns.push(...findRepeats(password));
  patterns.push(...findDates(password));
  patterns.push(...findLeetSubstitutions(password, COMMON_DICTIONARY_WORDS));
  patterns.push(...findUserContextMatches(password, userContext));

  // Deduplicate overlapping pattern matches
  const uniquePatterns = deduplicatePatterns(patterns);

  // 3. Run zxcvbn-ts estimation with user context tokens
  const userInputsList: string[] = [];
  if (userContext?.name) userInputsList.push(userContext.name);
  if (userContext?.email) userInputsList.push(userContext.email);
  if (userContext?.username) userInputsList.push(userContext.username);
  if (userContext?.customTokens) userInputsList.push(...userContext.customTokens);

  const zxcvbnResult = zxcvbnInstance.check(password, userInputsList);

  // 4. Determine effective score & guesses
  const estimatedGuesses = Math.max(1, zxcvbnResult.guesses);

  // Compute effective entropy = log2(estimatedGuesses)
  let effectiveEntropy = Math.round(Math.log2(estimatedGuesses) * 10) / 10;
  if (!isFinite(effectiveEntropy) || effectiveEntropy < 0) effectiveEntropy = 0;

  // Cap effective entropy by raw entropy
  if (effectiveEntropy > rawEntropy && rawEntropy > 0) {
    effectiveEntropy = rawEntropy;
  }

  // Calculate composite score (0-4)
  let score: StrengthScore = zxcvbnResult.score as StrengthScore;

  // Additional scoring adjustments for short / high pattern passwords
  if (password.length < 6) {
    score = 0;
  } else if (password.length < 8 && score > 1) {
    score = 1;
  } else if (uniquePatterns.some(p => p.severity === 'high' && p.token.length >= password.length * 0.75)) {
    // If high severity pattern covers >= 75% of the password
    score = Math.min(score, 1) as StrengthScore;
  } else if (effectiveEntropy >= 75 && score === 3 && uniquePatterns.length === 0) {
    score = 4;
  }

  const level: StrengthLevel = SCORE_LEVEL_MAP[score];

  // 5. Calculate crack times across 4 scenarios
  const crackTimes = calculateCrackTimes(estimatedGuesses);

  // 6. Actionable feedback
  const feedback = generateActionableFeedback(password, score, variety, uniquePatterns);

  const endTime = performance.now();

  return {
    passwordLength: password.length,
    score,
    level,
    entropyBits: effectiveEntropy,
    estimatedGuesses,
    variety,
    patterns: uniquePatterns,
    crackTimes,
    feedback,
    analysisTimeMs: Math.round((endTime - startTime) * 100) / 100,
  };
}

function deduplicatePatterns(patterns: PatternMatch[]): PatternMatch[] {
  // Sort by severity (high first) and length (longest first)
  const sorted = [...patterns].sort((a, b) => {
    const severityWeight = { high: 3, medium: 2, low: 1 };
    if (severityWeight[b.severity] !== severityWeight[a.severity]) {
      return severityWeight[b.severity] - severityWeight[a.severity];
    }
    return (b.endIndex - b.startIndex) - (a.endIndex - a.startIndex);
  });

  const result: PatternMatch[] = [];
  for (const match of sorted) {
    const isDuplicate = result.some(
      existing =>
        existing.type === match.type &&
        existing.startIndex === match.startIndex &&
        existing.endIndex === match.endIndex
    );
    if (!isDuplicate) {
      result.push(match);
    }
  }

  return result.sort((a, b) => a.startIndex - b.startIndex);
}
