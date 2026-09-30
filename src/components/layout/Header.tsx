import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Sliders,
  Columns,
  ShieldAlert,
  Volume2,
  VolumeX,
  Keyboard,
} from 'lucide-react';
import type { ThemeMode } from '../../types/theme';
import { ThemeToggle } from './ThemeToggle';
import { Badge } from '../common/Badge';
import { soundEngine } from '../../services/audioService';

export type ActiveTab = 'analyzer' | 'compare' | 'generator' | 'privacy';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onOpenShortcuts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  theme,
  onThemeChange,
  onOpenShortcuts,
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundEngine.isEnabled());

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    soundEngine.setEnabled(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      soundEngine.playCopy();
    }
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'analyzer', label: 'Analyzer', icon: <Lock className="w-4 h-4" /> },
    { id: 'compare', label: 'Compare', icon: <Columns className="w-4 h-4" /> },
    { id: 'generator', label: 'Generator', icon: <Sliders className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy & CSP', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Client-Side Badge */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[10px] flex items-center justify-center transition-colors">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                  CipherGuard
                </span>
                <Badge variant="cyan" size="sm" className="hidden sm:inline-flex">
                  Client-Side
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Zero telemetry • Local Web Crypto evaluation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={handleToggleSound}
              aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav
          role="tablist"
          aria-label="Main Navigation"
          className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/90 border border-slate-300/80 dark:bg-slate-900/90 dark:border-slate-800/80 w-full sm:w-auto justify-center overflow-x-auto transition-colors"
        >
          {navItems.map(({ id, label, icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={isActive}
                id={`tab-${id}`}
                aria-controls={`panel-${id}`}
                onClick={() => onTabChange(id)}
                className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Desktop Controls (Sound, Shortcuts, Theme) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            title={soundEnabled ? 'Mute audio feedback' : 'Enable audio feedback'}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {onOpenShortcuts && (
            <button
              onClick={onOpenShortcuts}
              title="Keyboard Shortcuts (⌘K)"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          )}

          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
        </div>
      </div>
    </header>
  );
};
