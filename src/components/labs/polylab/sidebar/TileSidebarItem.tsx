'use client';

import React from 'react';
import type { TileType } from '../canvas/types';
import { useCanvasStore } from '../canvas/useCanvasStore';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

export interface TileSidebarItemProps {
  type: TileType;
  name: string;
  description: string;
  presetProps?: Record<string, any>;
  previewRender?: React.ReactNode;
  badge?: string;
  categoryColor?: string;
}

export function TileSidebarItem({
  type,
  name,
  description,
  presetProps,
  previewRender,
  badge,
  categoryColor = 'bg-blue-500',
}: TileSidebarItemProps) {
  const addTile = useCanvasStore((s) => s.addTile);

  const handleDragStart = (e: React.DragEvent) => {
    const payload = JSON.stringify({
      type,
      presetProps,
    });
    e.dataTransfer.setData('application/polylab-tile', payload);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleClickAdd = () => {
    addTile({
      type,
      x: 220 + Math.floor(Math.random() * 80),
      y: 160 + Math.floor(Math.random() * 80),
      props: presetProps || {},
    });
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClickAdd}
      className={cn(
        'group relative flex flex-col justify-between p-2 rounded-xl border border-[#2D2E42] bg-[#1E1F2E] hover:bg-[#28293D]',
        'hover:border-blue-500/60 hover:shadow-lg transition-all duration-150 cursor-grab active:cursor-grabbing text-left select-none'
      )}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="font-bold text-[11px] text-slate-200 tracking-tight group-hover:text-blue-400 transition-colors line-clamp-1">
          {name}
        </span>
        {badge && (
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#12131D] text-slate-400 border border-[#2D2E42]">
            {badge}
          </span>
        )}
      </div>

      {/* Visual Preview Box */}
      <div className="w-full h-14 rounded-lg bg-[#141520] border border-[#2D2E42]/80 flex items-center justify-center p-1.5 overflow-hidden my-0.5">
        {previewRender ? (
          previewRender
        ) : (
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
            <span className={cn('w-2 h-2 rounded-full', categoryColor)} />
            <span className="line-clamp-1">{name}</span>
          </div>
        )}
      </div>

      {/* Quick Add icon on hover */}
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-md bg-blue-600 text-white shadow-xs">
        <Plus className="w-3 h-3" />
      </div>
    </div>
  );
}
