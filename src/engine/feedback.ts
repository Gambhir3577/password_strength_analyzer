import type { ActionableFeedback, CharacterVariety, PatternMatch, StrengthScore } from '../types/analyzer';

/**
 * Generates highly contextual, actionable feedback rather than generic advice.
 */
export function generateActionableFeedback(
  password: string,
  score: StrengthScore,
  variety: CharacterVariety,
  patterns: PatternMatch[]
): ActionableFeedback {
  if (!password) {
    return {
      warning: undefined,
      suggestions: ['Enter a password to inspect its entropy, vulnerabilities, and crack times.'],
      positiveObservations: [],
    };
  }

  const suggestions: string[] = [];
  const positiveObservations: string[] = [];
  let warning: string | undefined = undefined;

  // 1. Length-specific recommendations
  if (variety.length < 8) {
    suggestions.push(`Add ${8 - variety.length} more characters to reach the absolute minimum standard of 8 characters.`);
  } else if (variety.length < 12) {
    suggestions.push(`Add ${12 - variety.length} more characters to reach the recommended baseline length of 12+ characters.`);
  } else if (variety.length < 16) {
    suggestions.push(`Consider extending to 16+ characters for resilience against high-performance offline GPU clusters.`);
  } else {
    positiveObservations.push(`Excellent length (${variety.length} characters) creates a massive search space.`);
  }

  // 2. Pattern-based actionable advice
  const dictionaryPatterns = patterns.filter(p => p.type === 'dictionary');
  if (dictionaryPatterns.length > 0) {
    const words = dictionaryPatterns.map(p => `"${p.token}"`).join(', ');
    warning = `Contains predictable dictionary word(s): ${words}.`;
    suggestions.push(`Replace dictionary word(s) ${words} with random words or unrelated character strings.`);
  }

  const keyboardPatterns = patterns.filter(p => p.type === 'keyboard_walk');
  if (keyboardPatterns.length > 0) {
    const walks = keyboardPatterns.map(p => `"${p.token}"`).join(', ');
    suggestions.push(`Avoid keyboard walk pattern ${walks}—automated attack tools test spatial walks first.`);
  }

  const sequencePatterns = patterns.filter(p => p.type === 'sequence');
  if (sequencePatterns.length > 0) {
    const seqs = sequencePatterns.map(p => `"${p.token}"`).join(', ');
    suggestions.push(`Eliminate predictable sequence ${seqs}; use non-sequential characters instead.`);
  }

  const repeatPatterns = patterns.filter(p => p.type === 'repetition');
  if (repeatPatterns.length > 0) {
    const reps = repeatPatterns.map(p => `"${p.token}"`).join(', ');
    suggestions.push(`Remove repeated characters ${reps} to increase unique character entropy.`);
  }

  const leetPatterns = patterns.filter(p => p.type === 'leet_sub');
  if (leetPatterns.length > 0) {
    suggestions.push(`Basic l33t speak substitutions (e.g. '@' for 'a', '3' for 'e') are decoded instantly by modern cracking dictionaries.`);
  }

  const userPatterns = patterns.filter(p => p.type === 'user_input');
  if (userPatterns.length > 0) {
    warning = `Contains your personal identity information (${userPatterns.map(p => `"${p.token}"`).join(', ')}).`;
    suggestions.push('Never include names, usernames, or email fragments in sensitive credentials.');
  }

  // 3. Character variety advice
  const missingSets: string[] = [];
  if (!variety.hasLowercase) missingSets.push('lowercase letters');
  if (!variety.hasUppercase) missingSets.push('uppercase letters');
  if (!variety.hasDigits) missingSets.push('numbers');
  if (!variety.hasSymbols) missingSets.push('special symbols');

  if (missingSets.length > 0 && variety.length < 20) {
    suggestions.push(`Mix in ${missingSets.join(', ')} to expand the character search pool from ${variety.poolSize} to 95+ characters.`);
  } else if (missingSets.length === 0) {
    positiveObservations.push('Comprehensive character set diversity (uppercase, lowercase, numbers, and symbols).');
  }

  // 4. Positive observations for strong passwords
  if (patterns.length === 0 && variety.length >= 12) {
    positiveObservations.push('No predictable sequences, dictionary words, or keyboard walks detected.');
  }
  if (variety.hasUnicode) {
    positiveObservations.push('Contains extended Unicode characters, significantly multiplying attack entropy.');
  }
  if (variety.spaceCount >= 3 && variety.length >= 16) {
    positiveObservations.push('Strong multi-word passphrase structure with spaces.');
  }

  // Fallback suggestion if strong
  if (suggestions.length === 0 && score >= 3) {
    suggestions.push('Keep this password unique—never reuse passwords across multiple services.');
  }

  return {
    warning,
    suggestions: suggestions.slice(0, 4), // keep top 4 most actionable
    positiveObservations,
  };
}
