import React, { useState, useMemo, useCallback } from 'react';
import type { PasswordGeneratorOptions } from '../../types/generator';
import { generateRandomPassword } from '../../engine/generator';
import { useClipboard } from '../../hooks/useClipboard';
import { RefreshCw, Copy, Check, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';

interface PasswordGeneratorProps {
  onSelectPassword?: (password: string) => void;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ onSelectPassword }) => {
  const [options, setOptions] = useState<PasswordGeneratorOptions>({
    length: 20,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: true,
  });

  const [seed, setSeed] = useState(0);
  const { copy, hasCopied, secondsRemaining } = useClipboard(30000);

  const generatedPassword = useMemo(() => {
    // seed ensures regeneration can be explicitly triggered
    if (seed < 0) return '';
    return generateRandomPassword(options);
  }, [options, seed]);

  const regenerate = useCallback(() => {
    setSeed(s => s + 1);
  }, []);

  return (
    <div className="space-y-5">
      {/* Generated Password Result Display */}
      <div className="p-4 rounded-2xl bg-white/95 border border-slate-300 dark:bg-slate-900/90 dark:border-slate-700/80 shadow-inner transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-base sm:text-lg font-bold text-indigo-800 dark:text-indigo-300 break-all select-all">
            {generatedPassword}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={regenerate}
              aria-label="Regenerate password"
              title="Regenerate password"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>

            <Button
              variant={hasCopied ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => copy(generatedPassword)}
              icon={hasCopied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            >
              {hasCopied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {secondsRemaining !== null && (
          <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Clipboard will auto-clear in {secondsRemaining}s for security.</span>
          </div>
        )}
      </div>

      {/* Configuration Controls */}
      <div className="space-y-4">
        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-800 dark:text-slate-300">
            <span>Password Length</span>
            <span className="font-mono text-indigo-700 dark:text-indigo-400 text-sm">{options.length} characters</span>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            value={options.length}
            onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value, 10) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
          />
        </div>

        {/* Character Set Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-100/90 border border-slate-200 hover:border-slate-300 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={options.includeUppercase}
              onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
              className="rounded bg-white border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            />
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">Uppercase Letters (A-Z)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-100/90 border border-slate-200 hover:border-slate-300 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={options.includeLowercase}
              onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
              className="rounded bg-white border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            />
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">Lowercase Letters (a-z)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-100/90 border border-slate-200 hover:border-slate-300 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
              className="rounded bg-white border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            />
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-100/90 border border-slate-200 hover:border-slate-300 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
              className="rounded bg-white border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            />
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">Special Symbols (!@#$)</span>
          </label>

          <label className="sm:col-span-2 flex items-center gap-2.5 p-3 rounded-xl bg-slate-100/90 border border-slate-200 hover:border-slate-300 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={options.excludeAmbiguous}
              onChange={(e) => setOptions({ ...options, excludeAmbiguous: e.target.checked })}
              className="rounded bg-white border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
            />
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Exclude Ambiguous Characters (e.g. 0, O, 1, l, I)
            </span>
          </label>
        </div>

        {onSelectPassword && (
          <div className="pt-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => onSelectPassword(generatedPassword)}
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Analyze this Password
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
