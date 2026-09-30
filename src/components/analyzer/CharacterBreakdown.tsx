import React from 'react';
import type { CharacterVariety } from '../../types/analyzer';
import { Check, X } from 'lucide-react';
import { Card } from '../common/Card';

interface CharacterBreakdownProps {
  variety: CharacterVariety;
}

export const CharacterBreakdown: React.FC<CharacterBreakdownProps> = ({ variety }) => {
  const items = [
    { label: 'Length', count: `${variety.length}`, active: variety.length >= 12, hint: '12+ rec.' },
    { label: 'Lowercase (a-z)', count: `${variety.lowercase}`, active: variety.hasLowercase },
    { label: 'Uppercase (A-Z)', count: `${variety.uppercase}`, active: variety.hasUppercase },
    { label: 'Numbers (0-9)', count: `${variety.digits}`, active: variety.hasDigits },
    { label: 'Symbols (!@#$)', count: `${variety.symbols}`, active: variety.hasSymbols },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
          Character Diversity
        </h3>
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {items.filter(i => i.active).length} of 5 requirements
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {items.map(({ label, count, active, hint }) => (
          <div
            key={label}
            className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
              active
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-500/30 dark:text-emerald-300'
                : 'bg-slate-100/80 border-slate-200 text-slate-600 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-medium truncate">{label}</span>
              {active ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              )}
            </div>

            <div className="flex items-baseline justify-between mt-2 font-mono">
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">{count}</span>
              {hint && <span className="text-[10px] text-slate-500 dark:text-slate-400">{hint}</span>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
