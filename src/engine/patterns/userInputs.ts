import type { PatternMatch, UserContext } from '../../types/analyzer';
import { unleet } from './leet';

/**
 * Detects if user-provided personal context (name, email, username, custom tokens) appears in the password.
 */
export function findUserContextMatches(password: string, context?: UserContext): PatternMatch[] {
  const matches: PatternMatch[] = [];
  if (!context || !password) return matches;

  const candidateTokens: string[] = [];

  if (context.name && context.name.trim().length >= 3) {
    const parts = context.name.trim().split(/\s+/);
    candidateTokens.push(...parts);
  }

  if (context.email && context.email.includes('@')) {
    const [userPart] = context.email.split('@');
    if (userPart.length >= 3) {
      candidateTokens.push(userPart);
      // Also split email user parts by dot or dash (e.g. john.doe -> john, doe)
      const subParts = userPart.split(/[._-]/).filter(p => p.length >= 3);
      candidateTokens.push(...subParts);
    }
  }

  if (context.username && context.username.trim().length >= 3) {
    candidateTokens.push(context.username.trim());
  }

  if (context.customTokens && Array.isArray(context.customTokens)) {
    candidateTokens.push(...context.customTokens.filter(t => t && t.trim().length >= 3));
  }

  const lower = password.toLowerCase();
  const { normalized: unLeeted } = unleet(password);

  for (const token of candidateTokens) {
    const lowerToken = token.toLowerCase();
    
    // Direct match
    let idx = lower.indexOf(lowerToken);
    while (idx !== -1) {
      matches.push({
        id: `user-token-${idx}-${lowerToken.length}`,
        type: 'user_input',
        token: password.slice(idx, idx + lowerToken.length),
        startIndex: idx,
        endIndex: idx + lowerToken.length,
        description: `Contains your personal information ("${token}")`,
        severity: 'high',
      });
      idx = lower.indexOf(lowerToken, idx + 1);
    }

    // Leet-substituted personal token match
    let leetIdx = unLeeted.indexOf(lowerToken);
    while (leetIdx !== -1) {
      const alreadyFound = matches.some(m => m.startIndex === leetIdx && m.endIndex === leetIdx + lowerToken.length);
      if (!alreadyFound) {
        matches.push({
          id: `user-token-leet-${leetIdx}-${lowerToken.length}`,
          type: 'user_input',
          token: password.slice(leetIdx, leetIdx + lowerToken.length),
          startIndex: leetIdx,
          endIndex: leetIdx + lowerToken.length,
          description: `Contains obfuscated personal info based on "${token}"`,
          severity: 'high',
        });
      }
      leetIdx = unLeeted.indexOf(lowerToken, leetIdx + 1);
    }
  }

  return matches;
}
