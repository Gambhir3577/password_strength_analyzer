import React, { useState, useRef } from 'react';
import { Eye, EyeOff, Clipboard, XCircle, Sparkles } from 'lucide-react';

interface PasswordInputProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  onGenerateClick?: () => void;
  autoFocus?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id = 'password-input',
  label = 'Enter Password to Analyze',
  placeholder = 'Type or paste password here...',
  value,
  onChange,
  onGenerateClick,
  autoFocus = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePaste = async () => {
    try {
      if (navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        onChange(text);
        if (inputRef.current) inputRef.current.focus();
      }
    } catch {
      // If browser clipboard permission is blocked, let user paste manually
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleClear = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200"
        >
          {label}
        </label>
        <div className="flex items-center gap-2">
          {value.length > 0 && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
              {value.length} char{value.length === 1 ? '' : 's'}
            </span>
          )}
          {onGenerateClick && (
            <button
              type="button"
              onClick={onGenerateClick}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate
            </button>
          )}
        </div>
      </div>

      <div className="relative flex items-center">
        <input
          ref={inputRef}
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-lpignore="true"
          data-1p-ignore="true"
          data-bitwarden-watching="false"
          className="w-full pl-4 pr-32 py-3.5 rounded-xl bg-white/95 border border-slate-300 text-slate-900 placeholder:text-slate-400 font-mono text-base focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-900/90 dark:border-slate-700/80 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 transition-all shadow-inner outline-none"
        />

        <div className="absolute right-2.5 flex items-center gap-1 text-slate-500 dark:text-slate-400">
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear password"
              title="Clear password"
              className="p-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-200/80 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handlePaste}
            aria-label="Paste from clipboard"
            title="Paste from clipboard"
            className="p-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-200/80 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Clipboard className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
            className="p-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-200/80 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
