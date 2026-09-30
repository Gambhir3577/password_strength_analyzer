import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500/30',
    secondary:
      'bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-900 dark:text-slate-100 dark:border-slate-700',
    outline:
      'bg-transparent hover:bg-slate-200 active:bg-slate-300 text-slate-700 border border-slate-300 hover:text-slate-900 dark:hover:bg-slate-800/60 dark:active:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:text-white',
    danger:
      'bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-700 border border-red-200 dark:bg-red-600/20 dark:hover:bg-red-600/30 dark:text-red-400 dark:border-red-500/30 dark:active:bg-red-600/40',
    ghost:
      'bg-transparent hover:bg-slate-200 active:bg-slate-300 text-slate-600 hover:text-slate-900 border border-transparent dark:hover:bg-slate-800/40 dark:text-slate-400 dark:hover:text-slate-200',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-lg',
    md: 'px-4 py-2 text-sm font-semibold rounded-xl',
    lg: 'px-5 py-2.5 text-base font-semibold rounded-xl',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
