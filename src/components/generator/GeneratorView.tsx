import React, { useState } from 'react';
import { PasswordGenerator } from './PasswordGenerator';
import { PassphraseGenerator } from './PassphraseGenerator';
import { Card } from '../common/Card';
import { KeyRound, BookOpen } from 'lucide-react';
import { Badge } from '../common/Badge';

interface GeneratorViewProps {
  onSelectPassword: (password: string) => void;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({ onSelectPassword }) => {
  const [activeSubTab, setActiveSubTab] = useState<'password' | 'passphrase'>('passphrase');

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <Badge variant="cyan" size="md">
          Cryptographically Secure
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Secure Password & Passphrase Generator
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Generated client-side via <code className="text-indigo-600 dark:text-indigo-300 font-semibold">crypto.getRandomValues()</code> with bias-free rejection sampling.
        </p>
      </div>

      <Card>
        {/* Sub tabs */}
        <div className="flex p-1 rounded-xl bg-slate-200/90 border border-slate-300/80 dark:bg-slate-900 dark:border-slate-800 mb-6 transition-colors">
          <button
            type="button"
            onClick={() => setActiveSubTab('passphrase')}
            className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'passphrase'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Memorable Passphrase (Diceware)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('password')}
            className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'password'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Random Character Password</span>
          </button>
        </div>

        {activeSubTab === 'passphrase' ? (
          <PassphraseGenerator onSelectPassword={onSelectPassword} />
        ) : (
          <PasswordGenerator onSelectPassword={onSelectPassword} />
        )}
      </Card>
    </div>
  );
};
