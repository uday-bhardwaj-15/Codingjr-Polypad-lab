'use client';

import React, { memo, useCallback } from 'react';
import { Group, Rect } from 'react-konva';
import type Konva from 'konva';
import { useCanvasStore } from '../../canvas/useCanvasStore';
import { snapToGrid } from '../../canvas/snap';

export interface TileShellProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  isLocked?: boolean;
  isSelected?: boolean;
  children: React.ReactNode;
}

export const TileShell = memo(function TileShell({
  id,
  x,
  y,
  rotation = 0,
  width = 120,
  height = 80,
  scaleX = 1,
  scaleY = 1,
  isLocked = false,
  isSelected = false,
  children,
}: TileShellProps) {
  const updateTile = useCanvasStore((s) => s.updateTile);
  const toggleSelection = useCanvasStore((s) => s.toggleSelection);
  const grid = useCanvasStore((s) => s.grid);
  const tile = useCanvasStore((s) => s.tiles[id]);

  const finalScaleX = tile?.props?.scaleX ?? (tile?.width ? tile.width / width : scaleX);
  const finalScaleY = tile?.props?.scaleY ?? (tile?.height ? tile.height / height : scaleY);

  const handleDragStart = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true;
      if (!isSelected) {
        toggleSelection(id, e.evt.shiftKey);
      }
    },
    [id, isSelected, toggleSelection]
  );

  const handleDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true;
      if (grid.enabled && grid.snapToGrid) {
        const node = e.target;
        const currentPos = { x: node.x(), y: node.y() };
        const snapped = snapToGrid(currentPos, grid.size, 12);
        node.position(snapped);
      }
    },
    [grid]
  );

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      e.cancelBubble = true;
      const node = e.target;
      let finalX = node.x();
      let finalY = node.y();

      if (grid.enabled && grid.snapToGrid) {
        const snapped = snapToGrid({ x: finalX, y: finalY }, grid.size, 12);
        finalX = snapped.x;
        finalY = snapped.y;
      }

      updateTile(id, { x: finalX, y: finalY }, true);
    },
    [id, grid, updateTile]
  );

  const handleClick = useCallback(
    (e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      toggleSelection(id, e.evt && 'shiftKey' in e.evt ? e.evt.shiftKey : false);
    },
    [id, toggleSelection]
  );

  return (
    <Group
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      scaleX={finalScaleX}
      scaleY={finalScaleY}
      draggable={!isLocked}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onTap={handleClick}
    >
      {/* Render tile contents */}
      {children}
    </Group>
  );
});
