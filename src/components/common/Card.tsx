import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  glow?: 'weak' | 'fair' | 'strong' | 'cyan' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  id,
  glow = 'none',
}) => {
  const glowClass =
    glow === 'weak'
      ? 'glow-weak'
      : glow === 'fair'
      ? 'glow-fair'
      : glow === 'strong'
      ? 'glow-strong'
      : glow === 'cyan'
      ? 'glow-cyan'
      : '';

  return (
    <div
      id={id}
      className={`glass-panel rounded-2xl p-5 md:p-6 transition-all duration-300 shadow-xl ${glowClass} ${className}`}
    >
      {children}
    </div>
  );
};
