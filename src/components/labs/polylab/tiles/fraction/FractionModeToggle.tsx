'use client';

import React from 'react';
import type { FractionDisplayMode } from './fraction.types';
import { cn } from '@/lib/utils';
import { Percent, Hash, EyeOff, Divide } from 'lucide-react';

interface FractionModeToggleProps {
  currentMode: FractionDisplayMode;
  onModeChange: (mode: FractionDisplayMode) => void;
  size?: 'sm' | 'md';
}

export function FractionModeToggle({
  currentMode,
  onModeChange,
  size = 'md',
}: FractionModeToggleProps) {
  const modes: Array<{
    mode: FractionDisplayMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { mode: 'fraction', label: 'Fraction (a/b)', icon: Divide },
    { mode: 'percentage', label: 'Percent (%)', icon: Percent },
    { mode: 'decimal', label: 'Decimal (0.x)', icon: Hash },
    { mode: 'hidden', label: 'Hidden', icon: EyeOff },
  ];

  return (
    <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 backdrop-blur-md shadow-lg">
      {modes.map(({ mode, label, icon: Icon }) => {
        const isActive = currentMode === mode;
        return (
          <button
            key={mode}
            type="button"
            title={label}
            onClick={(e) => {
              e.stopPropagation();
              onModeChange(mode);
            }}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
              isActive
                ? 'bg-rose-500 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className={cn(size === 'sm' ? 'hidden sm:inline' : 'inline')}>
              {mode === 'fraction' && 'Fraction'}
              {mode === 'percentage' && '%'}
              {mode === 'decimal' && '0.x'}
              {mode === 'hidden' && 'Hide'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
