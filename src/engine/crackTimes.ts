import type { ScenarioCrackTime, CrackScenario } from '../types/analyzer';

interface ScenarioDef {
  scenario: CrackScenario;
  label: string;
  description: string;
  guessesPerSecond: number;
}

const SCENARIOS: ScenarioDef[] = [
  {
    scenario: 'online_throttled',
    label: 'Online Throttled (100 / hour)',
    description: 'Defended web login with rate limits, lockouts, and CAPTCHAs (~0.028 guesses/sec)',
    guessesPerSecond: 100 / 3600,
  },
  {
    scenario: 'online_unthrottled',
    label: 'Online Unthrottled (10 / sec)',
    description: 'Poorly protected login endpoint or un-ratelimited API',
    guessesPerSecond: 10,
  },
  {
    scenario: 'offline_slow_hash',
    label: 'Offline Slow Hash (10k / sec)',
    description: 'Leaked database secured with Argon2id, bcrypt, or scrypt',
    guessesPerSecond: 1e4,
  },
  {
    scenario: 'offline_fast_hash',
    label: 'Offline GPU Cluster (100B / sec)',
    description: 'Modern multi-GPU cluster attacking fast hashes (MD5, SHA-1, SHA-256, NTLM)',
    guessesPerSecond: 1e11,
  },
];

/**
 * Formats a duration in seconds into clear, human-readable units.
 */
export function formatDuration(seconds: number): string {
  if (seconds < 1) return 'Instantly (< 1 sec)';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minute${Math.round(minutes) === 1 ? '' : 's'}`;
  
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hour${Math.round(hours) === 1 ? '' : 's'}`;
  
  const days = hours / 24;
  if (days < 30) return `${Math.round(days)} day${Math.round(days) === 1 ? '' : 's'}`;
  
  const months = days / 30.4375;
  if (months < 12) return `${Math.round(months)} month${Math.round(months) === 1 ? '' : 's'}`;
  
  const years = days / 365.25;
  if (years < 100) return `${Math.round(years)} year${Math.round(years) === 1 ? '' : 's'}`;
  if (years < 1000) return `${Math.round(years / 10) * 10} years`;
  if (years < 1e6) return `${(years / 1000).toFixed(1).replace(/\.0$/, '')}k years`;
  if (years < 1e9) return `${(years / 1e6).toFixed(1).replace(/\.0$/, '')} million years`;
  if (years < 1e12) return `${(years / 1e9).toFixed(1).replace(/\.0$/, '')} billion years`;
  if (years < 1e15) return `${(years / 1e12).toFixed(1).replace(/\.0$/, '')} trillion years`;
  
  return 'Eons (effectively uncrackable)';
}

/**
 * Calculates estimated crack times for a given number of estimated attack guesses.
 */
export function calculateCrackTimes(estimatedGuesses: number): ScenarioCrackTime[] {
  return SCENARIOS.map(({ scenario, label, description, guessesPerSecond }) => {
    // Expected search time is guesses / (2 * guessesPerSecond) for average case (50% probability)
    const seconds = estimatedGuesses / (2 * guessesPerSecond);
    return {
      scenario,
      label,
      description,
      guessesPerSecond,
      seconds,
      displayTime: formatDuration(seconds),
    };
  });
}
