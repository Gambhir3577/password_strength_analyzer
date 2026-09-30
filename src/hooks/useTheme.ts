import { useState, useEffect } from 'react';
import type { ThemeMode } from '../types/theme';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // Only check localStorage for aesthetic theme preference (never sensitive data)
    const saved = localStorage.getItem('cipherguard_theme');
    if (saved === 'dark' || saved === 'light' || saved === 'system') {
      return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && systemDark);

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem('cipherguard_theme', theme);
    } catch {
      // Ignore if localStorage unavailable
    }
  }, [theme]);

  return { theme, setTheme };
}
