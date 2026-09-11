'use client';

import React from 'react';
import type { TileType } from '../canvas/types';
import { useCanvasStore } from '../canvas/useCanvasStore';
import { cn } from '@/lib/utils';

export interface ShapeTileItemProps {
  type: TileType;
  title: string;
  presetProps?: Record<string, any>;
  shapeRender: React.ReactNode;
  widthClass?: string;
}

export function ShapeTileItem({
  type,
  title,
  presetProps,
  shapeRender,
  widthClass = 'w-full',
}: ShapeTileItemProps) {
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
      x: 200 + Math.floor(Math.random() * 80),
      y: 150 + Math.floor(Math.random() * 80),
      props: presetProps || {},
    });
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClickAdd}
      title={title}
      className={cn(
        'group relative flex items-center justify-center p-2 rounded-xl bg-transparent hover:bg-[#2A2B3D]/80',
        'border border-transparent hover:border-blue-500/50 hover:shadow-lg transition-all duration-150',
        'cursor-grab active:cursor-grabbing select-none hover:scale-105 active:scale-95',
        widthClass
      )}
    >
      {/* Shape Content */}
      <div className="w-full flex items-center justify-center pointer-events-none">
        {shapeRender}
      </div>
    </div>
  );
}
