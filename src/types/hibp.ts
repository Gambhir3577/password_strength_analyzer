export type HibpStatus = 'idle' | 'loading' | 'safe' | 'breached' | 'error' | 'offline';

export interface HibpBreachResult {
  status: HibpStatus;
  prefix: string; // 5 uppercase hex chars
  breachCount: number;
  errorMessage?: string;
  queriedAt?: number;
}
