import React from 'react';
import type { ActionableFeedback as FeedbackType } from '../../types/analyzer';
import { Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';

interface ActionableFeedbackProps {
  feedback: FeedbackType;
}

export const ActionableFeedback: React.FC<ActionableFeedbackProps> = ({ feedback }) => {
  return (
    <Card>
      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
          Actionable Suggestions
        </h3>
      </div>

      {feedback.warning && (
        <div className="mb-3.5 p-3 rounded-xl bg-amber-50/90 border border-amber-300 flex items-start gap-2.5 text-xs text-amber-900 dark:bg-amber-950/30 dark:border-amber-500/30 dark:text-amber-300 transition-colors">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>{feedback.warning}</span>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {feedback.suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-slate-100/90 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-800 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-300 transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1.5 shrink-0" />
            <span>{suggestion}</span>
          </div>
        ))}
      </div>

      {feedback.positiveObservations.length > 0 && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 transition-colors">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
            Strength Highlights
          </span>
          <div className="space-y-1.5">
            {feedback.positiveObservations.map((obs, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{obs}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
