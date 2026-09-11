'use client';

import React from 'react';
import { useCanvasStore } from '../canvas/useCanvasStore';
import {
  MousePointer2,
  Pen,
  Minus,
  Compass,
  Type,
  Binary,
  Eraser,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ToolType } from '../canvas/types';

export function FloatingToolsDock() {
  const tool = useCanvasStore((s) => s.tool);
  const setTool = useCanvasStore((s) => s.setTool);

  const tools: Array<{
    id: ToolType | 'line' | 'text' | 'math' | 'ruler';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    shortcut?: string;
  }> = [
    { id: 'select', label: 'Select & Move', icon: MousePointer2, shortcut: 'V' },
    { id: 'pen', label: 'Pen & Drawing', icon: Pen, shortcut: 'P' },
    { id: 'line', label: 'Line Segment', icon: Minus, shortcut: 'L' },
    { id: 'ruler', label: 'Compass & Protractor', icon: Compass, shortcut: 'C' },
    { id: 'text', label: 'Text Box', icon: Type, shortcut: 'T' },
    { id: 'math', label: 'Math Formula (x²)', icon: Binary, shortcut: 'M' },
    { id: 'eraser', label: 'Eraser', icon: Eraser, shortcut: 'E' },
  ];

  return (
    <nav aria-label="Canvas drawing tools" className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-[#1E1F2B]/95 text-slate-200 px-3 py-1.5 rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-md select-none">
      {tools.map(({ id, label, icon: Icon, shortcut }) => {
        const isActive = tool === id || (id === 'select' && tool === 'select');
        return (
          <button
            key={id}
            onClick={() => {
              if (id === 'select' || id === 'pan' || id === 'pen' || id === 'eraser') {
                setTool(id as ToolType);
              } else {
                setTool('select');
              }
            }}
            title={`${label} ${shortcut ? `(${shortcut})` : ''}`}
            className={cn(
              'p-2 rounded-full transition-all duration-150 relative group',
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 scale-105'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/60'
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}

      <div className="h-4 w-px bg-slate-700 mx-1" />

      {/* Color Swatch Button */}
      <button
        title="Color Palette"
        className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors relative"
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-blue-500 border border-white/40 shadow-xs" />
      </button>
    </nav>
  );
}
