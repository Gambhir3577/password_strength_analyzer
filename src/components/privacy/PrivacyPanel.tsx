import React from 'react';
import { Lock, FileCode, CheckCircle2, AlertOctagon, Terminal } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { KAnonymityExplainer } from './KAnonymityExplainer';

export const PrivacyPanel: React.FC = () => {
  const securityGuarantees = [
    {
      title: 'Zero Storage & Persistence',
      description: 'Password data is stored strictly in ephemeral React component state and wiped completely upon unmount. Nothing is ever written to localStorage, sessionStorage, IndexedDB, or cookies.',
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Zero Telemetry & Remote Logging',
      description: 'There are no Google Analytics, trackers, external scripts, error monitoring beacons, or telemetry libraries embedded in this application.',
      icon: <CheckCircle2 className="w-5 h-5 text-indigo-400" />,
    },
    {
      title: 'Strict Content Security Policy (CSP)',
      description: "Our HTTP header & meta CSP restrict outbound connections ('connect-src') strictly to 'self' and 'https://api.pwnedpasswords.com'. All other network egress is blocked at the browser sandbox level.",
      icon: <AlertOctagon className="w-5 h-5 text-purple-400" />,
    },
    {
      title: 'Cryptographic Random Values',
      description: 'All generated passwords and Diceware passphrases strictly employ window.crypto.getRandomValues() with rejection sampling to eliminate modulo bias. Math.random() is never called.',
      icon: <Terminal className="w-5 h-5 text-cyan-400" />,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <Badge variant="cyan" size="md">
          Privacy & Security Architecture
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Client-Side Security Guarantee
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          CipherGuard is engineered from the ground up as a fully isolated, local web application. Your credentials remain inside your device's memory.
        </p>
      </div>

      {/* Security Guarantees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityGuarantees.map(({ title, description, icon }) => (
          <Card key={title} className="flex flex-col justify-between">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shrink-0 transition-colors">
                {icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">{description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Interactive K-Anonymity Explainer */}
      <KAnonymityExplainer />

      {/* CSP Verification Card */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <FileCode className="w-5 h-5" />
            <h3 className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
              Active Content Security Policy (CSP)
            </h3>
          </div>
          <Badge variant="success" size="sm">
            Enforced
          </Badge>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 font-mono text-xs text-indigo-300 border border-slate-800 dark:bg-slate-950 dark:border-slate-800 overflow-x-auto">
          default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://api.pwnedpasswords.com; img-src 'self' data:; object-src 'none'; base-uri 'self';
        </div>
      </Card>
    </div>
  );
};
