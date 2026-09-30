import React from 'react';
import type { StrengthLevel, StrengthScore } from '../../types/analyzer';
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
import { Badge } from '../common/Badge';
import type { BadgeVariant } from '../common/Badge';

interface StrengthMeterProps {
  score: StrengthScore;
  level: StrengthLevel;
  passwordLength: number;
}

const LEVEL_CONFIG: Record<
  StrengthScore,
  {
    label: StrengthLevel;
    color: string;
    badgeVariant: BadgeVariant;
    barColor: string;
    icon: React.ReactNode;
    summary: string;
  }
> = {
  0: {
    label: 'Very Weak',
    color: 'text-red-600 dark:text-red-400',
    badgeVariant: 'danger',
    barColor: 'bg-red-500',
    icon: <ShieldX className="w-4 h-4 text-red-600 dark:text-red-400" />,
    summary: 'Extremely vulnerable to dictionary & automated brute-force attacks.',
  },
  1: {
    label: 'Weak',
    color: 'text-orange-600 dark:text-orange-400',
    badgeVariant: 'warning',
    barColor: 'bg-orange-500',
    icon: <ShieldAlert className="w-4 h-4 text-orange-600 dark:text-orange-400" />,
    summary: 'Predictable patterns or short length make this easy to crack.',
  },
  2: {
    label: 'Fair',
    color: 'text-amber-600 dark:text-amber-400',
    badgeVariant: 'warning',
    barColor: 'bg-amber-500',
    icon: <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    summary: 'Moderate complexity, but vulnerable to dedicated offline attacks.',
  },
  3: {
    label: 'Strong',
    color: 'text-emerald-600 dark:text-emerald-400',
    badgeVariant: 'success',
    barColor: 'bg-emerald-500',
    icon: <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    summary: 'Good protection against both online and most offline attacks.',
  },
  4: {
    label: 'Very Strong',
    color: 'text-cyan-600 dark:text-cyan-400',
    badgeVariant: 'cyan',
    barColor: 'bg-cyan-500',
    icon: <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
    summary: 'Exceptional cryptographic entropy. Highly resilient against GPU clusters.',
  },
};

export const StrengthMeter: React.FC<StrengthMeterProps> = ({
  score,
  level,
  passwordLength,
}) => {
  const config = LEVEL_CONFIG[score];
  const isEmpty = passwordLength === 0;

  return (
    <div className="w-full space-y-3">
      {/* Visual meter bar segments */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Strength Level
          </span>
          <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
            {isEmpty ? '0/4' : `${score}/4`}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 h-2.5 w-full">
          {[0, 1, 2, 3, 4].map((step) => {
            const isFilled = !isEmpty && step <= score;
            const barBg = isFilled ? config.barColor : 'bg-slate-200 dark:bg-slate-800';
            return (
              <div
                key={step}
                className={`h-full rounded-full transition-all duration-300 ${barBg} ${
                  isFilled ? 'shadow-sm' : ''
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Text Label & Badge (Dual Visual Cues for WCAG AA) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <Badge
            variant={isEmpty ? 'neutral' : config.badgeVariant}
            size="md"
            icon={isEmpty ? <Shield className="w-4 h-4 text-slate-500" /> : config.icon}
          >
            {isEmpty ? 'Awaiting Input' : config.label}
          </Badge>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 italic">
          {isEmpty ? 'Enter a password to evaluate strength' : config.summary}
        </p>
      </div>

      {/* Screen reader live announcement */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isEmpty
          ? 'No password entered'
          : `Password strength evaluated as ${level}, score ${score} out of 4. ${config.summary}`}
      </div>
    </div>
  );
};
