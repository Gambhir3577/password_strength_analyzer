import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import type { ThemeMode } from '../../types/theme';

interface ThemeToggleProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onThemeChange }) => {
  const modes: { mode: ThemeMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'dark', icon: <Moon className="w-3.5 h-3.5" />, label: 'Dark theme' },
    { mode: 'light', icon: <Sun className="w-3.5 h-3.5" />, label: 'Light theme' },
    { mode: 'system', icon: <Monitor className="w-3.5 h-3.5" />, label: 'System theme' },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector"
      className="inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300/80 dark:bg-slate-900/80 dark:border-slate-800/80 backdrop-blur-md transition-colors"
    >
      {modes.map(({ mode, icon, label }) => {
        const isActive = theme === mode;
        return (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={label}
            onClick={() => onThemeChange(mode)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
            }`}
          >
            {icon}
            <span className="hidden sm:inline capitalize">{mode}</span>
          </button>
        );
      })}
    </div>
  );
};
