import React from 'react';
import { ArrowRight, ShieldCheck, Lock, EyeOff, Laptop } from 'lucide-react';
import { Card } from '../common/Card';

export const KAnonymityExplainer: React.FC = () => {
  return (
    <Card className="space-y-6">
      <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
        <ShieldCheck className="w-5 h-5" />
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
          How K-Anonymity Protects Your Password
        </h3>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        The Have I Been Pwned Pwned Passwords protocol uses a mathematical privacy technique called <strong className="text-indigo-700 dark:text-indigo-300">k-Anonymity</strong>. This allows you to verify if your password has been exposed in data breaches without ever disclosing the password or its complete hash to anyone.
      </p>

      {/* Visual Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-100/90 border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800 flex flex-col justify-between space-y-3 transition-colors">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
            <Laptop className="w-4 h-4" />
            <span>Step 1: In-Browser SHA-1</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <p>Your raw password is hashed locally via <code className="text-indigo-700 dark:text-indigo-300 font-semibold">crypto.subtle</code>.</p>
            <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-slate-300 break-all">
              <span className="text-amber-400 font-bold">5BAA6</span>
              <span className="text-slate-400">1E4C9B93F3F0682250B6CF8331B7EE68FD8</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-100/90 border border-indigo-300 dark:bg-slate-900/90 dark:border-indigo-500/30 flex flex-col justify-between space-y-3 transition-colors">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 text-xs font-bold">
            <ArrowRight className="w-4 h-4" />
            <span>Step 2: 5-Char Prefix Request</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <p>Only the first 5 hexadecimal characters are sent across the network.</p>
            <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-cyan-300">
              GET /range/<span className="text-amber-400 font-bold">5BAA6</span>
            </div>
            <p className="text-[11px] text-slate-500">
              (Matches ~800+ unrelated password hashes sharing that same prefix)
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-100/90 border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800 flex flex-col justify-between space-y-3 transition-colors">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            <Lock className="w-4 h-4" />
            <span>Step 3: Local Suffix Matching</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <p>Your browser receives all suffixes in that bucket and checks for your suffix locally.</p>
            <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-emerald-300">
              Matched locally in memory
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-500/30 flex items-start gap-3 transition-colors">
        <EyeOff className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed">
          <strong className="text-slate-900 dark:text-white">Zero Mathematical Knowledge:</strong> Because $16^5 = 1,048,576$ buckets exist, each 5-character prefix matches hundreds of different passwords. The remote API server and intermediate network routers cannot distinguish which password you actually searched for.
        </p>
      </div>
    </Card>
  );
};
