import React, { useState } from 'react';
import { analyzePassword } from '../../engine/scoring';
import { PasswordInput } from '../analyzer/PasswordInput';
import { StrengthMeter } from '../analyzer/StrengthMeter';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Trophy } from 'lucide-react';

export const CompareView: React.FC = () => {
  const [passwordA, setPasswordA] = useState('password123');
  const [passwordB, setPasswordB] = useState('correct-horse-battery-staple');

  const analysisA = analyzePassword(passwordA);
  const analysisB = analyzePassword(passwordB);

  const entropyDiff = Math.round((analysisB.entropyBits - analysisA.entropyBits) * 10) / 10;
  const winner =
    analysisA.entropyBits > analysisB.entropyBits
      ? 'A'
      : analysisB.entropyBits > analysisA.entropyBits
      ? 'B'
      : 'Tie';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <Badge variant="cyan" size="md">
          Side-by-Side Evaluation
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Compare Password Strength
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Evaluate two candidate credentials side-by-side to understand relative search spaces and vulnerability differences.
        </p>
      </div>

      {/* Comparison Verdict Banner */}
      {winner !== 'Tie' && (passwordA.length > 0 || passwordB.length > 0) && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-500/30 flex items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                Security Comparison Verdict
              </span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                Password {winner} is significantly stronger (+{Math.abs(entropyDiff)} bits of effective entropy)
              </p>
            </div>
          </div>
          <Badge variant="success" size="md">
            Candidate {winner} Recommended
          </Badge>
        </div>
      )}

      {/* Side-by-Side Input & Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password A Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-300">Password Candidate A</span>
            {winner === 'A' && <Badge variant="success" size="sm">Stronger</Badge>}
          </div>

          <Card className="space-y-4">
            <PasswordInput
              id="password-a"
              label="Password A"
              value={passwordA}
              onChange={setPasswordA}
            />
            <StrengthMeter
              score={analysisA.score}
              level={analysisA.level}
              passwordLength={analysisA.passwordLength}
            />

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs transition-colors">
              <div className="p-2.5 rounded-lg bg-slate-100/90 dark:bg-slate-900/80 transition-colors">
                <span className="text-slate-600 dark:text-slate-400">Entropy</span>
                <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                  {analysisA.entropyBits} bits
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100/90 dark:bg-slate-900/80 transition-colors">
                <span className="text-slate-600 dark:text-slate-400">GPU Crack Time</span>
                <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                  {analysisA.crackTimes.find(c => c.scenario === 'offline_fast_hash')?.displayTime || '0s'}
                </p>
              </div>
            </div>

            {/* Vulnerabilities Pill Count */}
            <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between pt-1">
              <span>Detected Vulnerabilities:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">
                {analysisA.patterns.length} pattern{analysisA.patterns.length === 1 ? '' : 's'}
              </span>
            </div>
          </Card>
        </div>

        {/* Password B Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-300">Password Candidate B</span>
            {winner === 'B' && <Badge variant="success" size="sm">Stronger</Badge>}
          </div>

          <Card className="space-y-4">
            <PasswordInput
              id="password-b"
              label="Password B"
              value={passwordB}
              onChange={setPasswordB}
            />
            <StrengthMeter
              score={analysisB.score}
              level={analysisB.level}
              passwordLength={analysisB.passwordLength}
            />

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs transition-colors">
              <div className="p-2.5 rounded-lg bg-slate-100/90 dark:bg-slate-900/80 transition-colors">
                <span className="text-slate-600 dark:text-slate-400">Entropy</span>
                <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                  {analysisB.entropyBits} bits
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100/90 dark:bg-slate-900/80 transition-colors">
                <span className="text-slate-600 dark:text-slate-400">GPU Crack Time</span>
                <p className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                  {analysisB.crackTimes.find(c => c.scenario === 'offline_fast_hash')?.displayTime || '0s'}
                </p>
              </div>
            </div>

            {/* Vulnerabilities Pill Count */}
            <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between pt-1">
              <span>Detected Vulnerabilities:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">
                {analysisB.patterns.length} pattern{analysisB.patterns.length === 1 ? '' : 's'}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
