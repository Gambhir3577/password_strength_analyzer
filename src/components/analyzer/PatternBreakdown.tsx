import React from 'react';
import type { PatternMatch } from '../../types/analyzer';
import { AlertTriangle, BookOpen, Keyboard, Repeat, Calendar, Hash, User, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import type { BadgeVariant } from '../common/Badge';

interface PatternBreakdownProps {
  patterns: PatternMatch[];
}

export const PatternBreakdown: React.FC<PatternBreakdownProps> = ({ patterns }) => {
  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'dictionary':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'keyboard_walk':
        return <Keyboard className="w-3.5 h-3.5" />;
      case 'sequence':
      case 'repetition':
        return <Repeat className="w-3.5 h-3.5" />;
      case 'date':
        return <Calendar className="w-3.5 h-3.5" />;
      case 'leet_sub':
        return <Hash className="w-3.5 h-3.5" />;
      case 'user_input':
        return <User className="w-3.5 h-3.5" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5" />;
    }
  };

  const getSeverityBadgeVariant = (severity: 'high' | 'medium' | 'low'): BadgeVariant => {
    switch (severity) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
            Detected Vulnerabilities & Patterns
          </h3>
        </div>
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {patterns.length} pattern{patterns.length === 1 ? '' : 's'} found
        </span>
      </div>

      {patterns.length === 0 ? (
        <div className="p-4 rounded-xl bg-emerald-50/90 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-500/20 flex items-center gap-3 transition-colors">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">Clean Pattern Profile</p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400/80">
              No dictionary words, keyboard walks, sequences, dates, or basic l33t substitutions detected.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {patterns.map((pattern) => (
            <div
              key={pattern.id}
              className="p-3 rounded-xl bg-slate-100/90 border border-slate-200 flex items-start justify-between gap-3 hover:border-slate-300 dark:bg-slate-900/80 dark:border-slate-800 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 mt-0.5 shrink-0 transition-colors">
                  {getPatternIcon(pattern.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-200 dark:text-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded transition-colors">
                      {pattern.token}
                    </span>
                    <Badge variant={getSeverityBadgeVariant(pattern.severity)} size="sm">
                      {pattern.severity} risk
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{pattern.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
