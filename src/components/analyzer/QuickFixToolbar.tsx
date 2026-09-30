import React from 'react';
import { Sparkles, Plus, Wand2, RefreshCw } from 'lucide-react';
import type { PasswordAnalysisResult } from '../../types/analyzer';
import { generatePassphrase } from '../../engine/generator';

interface QuickFixToolbarProps {
  password: string;
  analysis: PasswordAnalysisResult;
  onApplyFix: (newPassword: string) => void;
}

export const QuickFixToolbar: React.FC<QuickFixToolbarProps> = ({
  password,
  analysis,
  onApplyFix,
}) => {
  if (!password || analysis.score === 4) return null;

  const handleAddSymbolsAndDigits = () => {
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const digits = '23456789';
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const randomDigit = digits[Math.floor(Math.random() * digits.length)];
    onApplyFix(`${password}${randomSymbol}${randomDigit}`);
  };

  const handlePadTo16 = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*';
    let added = '';
    const needed = Math.max(4, 16 - password.length);
    for (let i = 0; i < needed; i++) {
      added += chars[Math.floor(Math.random() * chars.length)];
    }
    onApplyFix(`${password}${added}`);
  };

  const handleConvertToPassphrase = () => {
    const passphrase = generatePassphrase({
      wordCount: 4,
      delimiter: '-',
      capitalize: 'first',
      includeNumber: true,
    });
    onApplyFix(passphrase);
  };

  const handleDeduplicate = () => {
    // Remove triple repeats (e.g. "aaa" -> "a")
    let cleaned = password.replace(/(.)\1{2,}/g, '$1');
    if (cleaned === password) {
      cleaned = password.replace(/(.)\1/g, '$1');
    }
    onApplyFix(cleaned);
  };

  return (
    <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-purple-500/10 border border-indigo-200/80 dark:border-indigo-900/40 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Instant Security Enhancers
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Click to apply cryptographic fixes
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {(!analysis.variety.hasSymbols || !analysis.variety.hasDigits) && (
          <button
            onClick={handleAddSymbolsAndDigits}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-all flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Symbol & Digit
          </button>
        )}

        {password.length < 16 && (
          <button
            onClick={handlePadTo16}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 transition-all flex items-center gap-1 shadow-sm"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Pad to 16+ Chars
          </button>
        )}

        {analysis.patterns.some((p) => p.type === 'repetition') && (
          <button
            onClick={handleDeduplicate}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-all flex items-center gap-1 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Remove Repeated Runs
          </button>
        )}

        <button
          onClick={handleConvertToPassphrase}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-all flex items-center gap-1 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Convert to Diceware Passphrase
        </button>
      </div>
    </div>
  );
};
