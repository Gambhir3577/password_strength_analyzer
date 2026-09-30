import React from 'react';
import { Cpu, Zap, Database, Clock } from 'lucide-react';
import { Card } from '../common/Card';

interface EntropyCardProps {
  entropyBits: number;
  estimatedGuesses: number;
  poolSize: number;
  analysisTimeMs: number;
}

export const EntropyCard: React.FC<EntropyCardProps> = ({
  entropyBits,
  estimatedGuesses,
  poolSize,
  analysisTimeMs,
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}k`;
    return num.toLocaleString();
  };

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Cpu className="w-5 h-5" />
            <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
              Entropy & Complexity
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            {analysisTimeMs}ms
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-slate-100/90 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 transition-colors">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Effective Entropy
            </span>
            <div className="text-xl font-mono font-extrabold text-slate-900 dark:text-white mt-1">
              {entropyBits} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">bits</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-100/90 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 transition-colors">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              Character Pool
            </span>
            <div className="text-xl font-mono font-extrabold text-slate-900 dark:text-white mt-1">
              {poolSize} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">chars</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 transition-colors">
        <span>Search Space Capacity</span>
        <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">
          ~{formatNumber(estimatedGuesses)} combinations
        </span>
      </div>
    </Card>
  );
};
