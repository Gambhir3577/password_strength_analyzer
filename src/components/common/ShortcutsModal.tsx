import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    { key: 'Tab / 1-4', desc: 'Switch between Analyzer, Compare, Generator, and Privacy tabs' },
    { key: `${modKey} + K`, desc: 'Toggle keyboard shortcuts cheat sheet' },
    { key: `${modKey} + E`, desc: 'Open Security & Compliance Audit Report' },
    { key: `${modKey} + G`, desc: 'Switch to Passphrase & CSPRNG Generator' },
    { key: 'Esc', desc: 'Close any active modal or dropdown' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <h3 id="shortcuts-title" className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Keyboard Shortcuts & Navigation
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close shortcuts"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2.5">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between gap-3 text-xs"
            >
              <span className="text-slate-600 dark:text-slate-300">{s.desc}</span>
              <kbd className="px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px] shrink-0 shadow-xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
          Press <kbd className="font-mono font-bold text-slate-600 dark:text-slate-300">Esc</kbd> anytime to dismiss.
        </div>
      </div>
    </div>
  );
};
