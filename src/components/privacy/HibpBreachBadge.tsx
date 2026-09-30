import React from 'react';
import type { HibpBreachResult } from '../../types/hibp';
import { Toggle } from '../common/Toggle';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { ShieldAlert, ShieldCheck, WifiOff, AlertTriangle, Loader2, Info } from 'lucide-react';

interface HibpBreachBadgeProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  result: HibpBreachResult;
  onExplainClick?: () => void;
}

export const HibpBreachBadge: React.FC<HibpBreachBadgeProps> = ({
  isEnabled,
  onToggle,
  result,
  onExplainClick,
}) => {
  return (
    <Card className="border-indigo-500/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
              Have I Been Pwned Breach Check
            </h3>
            <button
              type="button"
              onClick={onExplainClick}
              className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex items-center gap-0.5 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>How k-Anonymity works</span>
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Checks if this password has appeared in known data breaches using 5-character k-anonymity.
          </p>
        </div>

        <Toggle
          id="hibp-toggle"
          checked={isEnabled}
          onChange={onToggle}
          label={isEnabled ? 'Enabled' : 'Disabled (Default)'}
        />
      </div>

      {isEnabled && (
        <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
          {result.status === 'idle' && (
            <div className="text-xs text-slate-500 dark:text-slate-400 italic">
              Type a password to perform a zero-knowledge breach check.
            </div>
          )}

          {result.status === 'loading' && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking 5-character prefix with Pwned Passwords API...</span>
            </div>
          )}

          {result.status === 'breached' && (
            <div className="p-3 rounded-xl bg-red-50/90 border border-red-300 dark:bg-red-950/40 dark:border-red-500/30 flex items-start justify-between gap-3 transition-colors">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-900 dark:text-red-200">
                      Compromised Password!
                    </span>
                    <Badge variant="danger" size="sm">
                      {result.breachCount.toLocaleString()} breaches
                    </Badge>
                  </div>
                  <p className="text-[11px] text-red-800/90 dark:text-red-300/80 mt-1">
                    This exact password has appeared {result.breachCount.toLocaleString()} times in publicly exposed data breaches. Automated credential stuffing tools will crack this in seconds.
                  </p>
                </div>
              </div>
            </div>
          )}

          {result.status === 'safe' && (
            <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-500/30 flex items-center justify-between gap-3 transition-colors">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    No Known Breaches Found
                  </span>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400/80">
                    This password was not detected in HIBP's database of over 10 billion breached passwords.
                  </p>
                </div>
              </div>
              <Badge variant="success" size="sm">
                Clean
              </Badge>
            </div>
          )}

          {result.status === 'offline' && (
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-300 dark:bg-slate-900 dark:border-slate-700 flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-300 transition-colors">
              <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>You are currently offline. Local strength analysis remains fully operational.</span>
            </div>
          )}

          {result.status === 'error' && (
            <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-300 dark:bg-amber-950/30 dark:border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-300 transition-colors">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{result.errorMessage || 'Unable to connect to breach database.'}</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
