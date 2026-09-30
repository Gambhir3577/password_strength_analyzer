import type { HibpBreachResult } from '../types/hibp';

/**
 * Computes SHA-1 hash of string using browser Web Crypto API.
 * Never logs or exposes password outside of local memory.
 */
export async function hashPasswordSha1(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/**
 * Queries the Have I Been Pwned Pwned Passwords API using k-Anonymity.
 * Sends ONLY the first 5 hexadecimal characters of the SHA-1 hash.
 */
export async function checkPasswordBreach(
  password: string,
  signal?: AbortSignal
): Promise<HibpBreachResult> {
  if (!password) {
    return { status: 'idle', prefix: '', breachCount: 0 };
  }

  // Check offline status
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return {
      status: 'offline',
      prefix: '',
      breachCount: 0,
      errorMessage: 'Network is offline. Cannot reach HIBP breach database.',
    };
  }

  try {
    const fullHash = await hashPasswordSha1(password);
    const prefix = fullHash.slice(0, 5);
    const suffix = fullHash.slice(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      method: 'GET',
      headers: {
        'Add-Padding': 'true', // instructs HIBP to add padding to thwart response length analysis
      },
      signal,
    });

    if (!response.ok) {
      return {
        status: 'error',
        prefix,
        breachCount: 0,
        errorMessage: `HIBP API error (HTTP ${response.status})`,
      };
    }

    const text = await response.text();
    const lines = text.split(/\r?\n/);

    let breachCount = 0;
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const [lineSuffix, countStr] = trimmed.split(':');
      if (lineSuffix && lineSuffix.trim().toUpperCase() === suffix) {
        breachCount = parseInt(countStr.trim(), 10) || 0;
        break;
      }
    }

    return {
      status: breachCount > 0 ? 'breached' : 'safe',
      prefix,
      breachCount,
      queriedAt: Date.now(),
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { status: 'idle', prefix: '', breachCount: 0 };
    }
    return {
      status: 'error',
      prefix: '',
      breachCount: 0,
      errorMessage: err instanceof Error ? err.message : 'Network request failed',
    };
  }
}
