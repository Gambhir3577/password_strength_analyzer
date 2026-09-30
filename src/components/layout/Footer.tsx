import React from 'react';
import { Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white/60 dark:border-slate-800/80 dark:bg-slate-950/60 backdrop-blur-md mt-auto py-8 text-xs text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-slate-900 dark:text-slate-200 font-semibold">Strict Privacy Assurance</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              No password is ever transmitted, logged, or cached in persistent storage.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Strict Outbound CSP
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            k-Anonymity HIBP Verification
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            WCAG 2.1 AA Compliant
          </span>
        </div>
      </div>
    </footer>
  );
};
