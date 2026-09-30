import React, { useState, useMemo, useCallback } from 'react';
import type { PassphraseGeneratorOptions, PassphraseCapitalization } from '../../types/generator';
import { generatePassphrase } from '../../engine/generator';
import { useClipboard } from '../../hooks/useClipboard';
import { RefreshCw, Copy, Check, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '../common/Button';

interface PassphraseGeneratorProps {
  onSelectPassword?: (passphrase: string) => void;
}

export const PassphraseGenerator: React.FC<PassphraseGeneratorProps> = ({ onSelectPassword }) => {
  const [options, setOptions] = useState<PassphraseGeneratorOptions>({
    wordCount: 4,
    delimiter: '-',
    capitalize: 'first',
    includeNumber: true,
  });

  const [seed, setSeed] = useState(0);
  const { copy, hasCopied, secondsRemaining } = useClipboard(30000);

  const generatedPassphrase = useMemo(() => {
    if (seed < 0) return '';
    return generatePassphrase(options);
  }, [options, seed]);

  const regenerate = useCallback(() => {
    setSeed(s => s + 1);
  }, []);

  return (
    <div className="space-y-5">
      {/* Generated Passphrase Result Display */}
      <div className="p-4 rounded-2xl bg-white/95 border border-slate-300 dark:bg-slate-900/90 dark:border-slate-700/80 shadow-inner transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-base sm:text-lg font-bold text-cyan-800 dark:text-cyan-300 break-all select-all">
            {generatedPassphrase}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={regenerate}
              aria-label="Regenerate passphrase"
              title="Regenerate passphrase"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>

            <Button
              variant={hasCopied ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => copy(generatedPassphrase)}
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
        {/* Word Count Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-800 dark:text-slate-300">
            <span>Word Count</span>
            <span className="font-mono text-cyan-700 dark:text-cyan-400 text-sm">{options.wordCount} words (~{options.wordCount * 13} bits entropy)</span>
          </div>
          <input
            type="range"
            min="3"
            max="8"
            value={options.wordCount}
            onChange={(e) => setOptions({ ...options, wordCount: parseInt(e.target.value, 10) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-600 dark:accent-cyan-500"
          />
        </div>

        {/* Delimiter & Capitalization Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
              Word Separator / Delimiter
            </label>
            <select
              value={options.delimiter}
              onChange={(e) => setOptions({ ...options, delimiter: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-cyan-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:focus:border-cyan-500 transition-colors"
            >
              <option value="-">Hyphen (-)</option>
              <option value=" ">Space ( )</option>
              <option value=".">Period (.)</option>
              <option value="_">Underscore (_)</option>
              <option value="/">Slash (/)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-300 mb-1.5">
              Capitalization Style
            </label>
            <select
              value={options.capitalize}
              onChange={(e) => setOptions({ ...options, capitalize: e.target.value as PassphraseCapitalization })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-cyan-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:focus:border-cyan-500 transition-colors"
            >
              <option value="first">Capitalize First Letter (TitleCase)</option>
              <option value="none">All Lowercase (lowercase)</option>
              <option value="all">All Uppercase (UPPERCASE)</option>
              <option value="random">Random Capitalization</option>
            </select>
          </div>

          <label className="sm:col-span-2 flex items-center gap-2.5 p-3 rounded-xl bg-slate-100/90 border border-slate-200 hover:border-slate-300 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={options.includeNumber}
              onChange={(e) => setOptions({ ...options, includeNumber: e.target.checked })}
              className="rounded bg-white border-slate-300 text-cyan-600 focus:ring-cyan-500 dark:bg-slate-800 dark:border-slate-700"
            />
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Append a random number to one of the words
            </span>
          </label>
        </div>

        {onSelectPassword && (
          <div className="pt-3">
            <Button
              variant="primary"
              className="w-full bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30 border-cyan-500/30"
              onClick={() => onSelectPassword(generatedPassphrase)}
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Analyze this Passphrase
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
