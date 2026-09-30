import React from 'react';
import type { ScenarioCrackTime } from '../../types/analyzer';
import { ShieldCheck, Globe, Server, Cpu, HardDrive } from 'lucide-react';
import { Card } from '../common/Card';

interface CrackTimeCardProps {
  crackTimes: ScenarioCrackTime[];
}

export const CrackTimeCard: React.FC<CrackTimeCardProps> = ({ crackTimes }) => {
  const getScenarioIcon = (scenario: string) => {
    switch (scenario) {
      case 'online_throttled':
        return <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'online_unthrottled':
        return <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'offline_slow_hash':
        return <Server className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'offline_fast_hash':
        return <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <HardDrive className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
    }
  };

  const getDurationColor = (seconds: number) => {
    if (seconds < 10) return 'text-red-600 dark:text-red-400 font-bold';
    if (seconds < 3600) return 'text-orange-600 dark:text-orange-400 font-bold';
    if (seconds < 86400 * 30) return 'text-amber-600 dark:text-amber-400 font-semibold';
    if (seconds < 86400 * 365 * 10) return 'text-emerald-600 dark:text-emerald-400 font-semibold';
    return 'text-cyan-600 dark:text-cyan-300 font-bold';
  };

  return (
    <Card className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <HardDrive className="w-5 h-5" />
          <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
            Estimated Time to Crack
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">4 Threat Scenarios</span>
      </div>

      <div className="space-y-3">
        {crackTimes.map(({ scenario, label, description, displayTime, seconds }) => (
          <div
            key={scenario}
            className="p-3 rounded-xl bg-slate-100/90 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-300 dark:bg-slate-900/70 dark:border-slate-800/80 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 mt-0.5 shrink-0 transition-colors">
                {getScenarioIcon(scenario)}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-200">{label}</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight mt-0.5">
                  {description}
                </div>
              </div>
            </div>

            <div className="sm:text-right shrink-0 pl-8 sm:pl-0">
              <span className={`text-sm font-mono ${getDurationColor(seconds)}`}>
                {displayTime}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
