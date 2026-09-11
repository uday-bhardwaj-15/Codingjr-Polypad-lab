'use client';

import React, { memo, useCallback } from 'react';
import { Group, Rect, Circle, Line } from 'react-konva';
import type Konva from 'konva';
import { TileShell } from '../shared/TileShell';
import { useCanvasStore } from '../../canvas/useCanvasStore';

export interface TenFrameProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  count?: number;
  counterColor?: string;
  cellSize?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const TenFrame = memo(function TenFrame({
  id,
  x,
  y,
  rotation = 0,
  count = 3,
  counterColor = '#E11D48',
  cellSize = 36,
  isLocked = false,
  isSelected = false,
}: TenFrameProps) {
  const updateTileProps = useCanvasStore((s) => s.updateTileProps);

  const cols = 5;
  const rows = 2;
  const totalWidth = cols * cellSize;
  const totalHeight = rows * cellSize;
  const safeCount = Math.max(0, Math.min(10, Math.round(count)));

  const handleCellClick = useCallback(
    (index: number, e: Konva.KonvaEventObject<any>) => {
      e.cancelBubble = true;
      let nextCount = safeCount;
      if (index < safeCount) {
        nextCount = index;
      } else {
        nextCount = index + 1;
      }
      updateTileProps(id, { count: nextCount });
    },
    [id, safeCount, updateTileProps]
  );

  return (
    <TileShell
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      width={totalWidth}
      height={totalHeight}
      isLocked={isLocked}
      isSelected={isSelected}
    >
      {/* Outer frame */}
      <Rect
        x={0}
        y={0}
        width={totalWidth}
        height={totalHeight}
        fill="#FFFFFF"
        stroke="#1E293B"
        strokeWidth={2}
        cornerRadius={4}
        shadowColor="rgba(0, 0, 0, 0.08)"
        shadowBlur={6}
      />

      {/* Center horizontal divider */}
      <Line
        points={[0, cellSize, totalWidth, cellSize]}
        stroke="#1E293B"
        strokeWidth={1.5}
      />

      {/* Vertical dividers */}
      {Array.from({ length: cols - 1 }).map((_, i) => {
        const xPos = (i + 1) * cellSize;
        return (
          <Line
            key={i}
            points={[xPos, 0, xPos, totalHeight]}
            stroke="#1E293B"
            strokeWidth={1.5}
          />
        );
      })}

      {/* Cells and Counters */}
      {Array.from({ length: 10 }).map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const cellX = col * cellSize;
        const cellY = row * cellSize;
        const isFilled = i < safeCount;

        return (
          <Group
            key={i}
            x={cellX}
            y={cellY}
            onClick={(e) => handleCellClick(i, e)}
            onTap={(e) => handleCellClick(i, e)}
          >
            {/* Clickable hit area */}
            <Rect
              x={0}
              y={0}
              width={cellSize}
              height={cellSize}
              fill="transparent"
            />
            {/* Counter token */}
            {isFilled && (
              <Circle
                x={cellSize / 2}
                y={cellSize / 2}
                radius={cellSize * 0.36}
                fill={counterColor}
                stroke="#B91C1C"
                strokeWidth={1}
                shadowColor="rgba(0, 0, 0, 0.15)"
                shadowBlur={3}
                shadowOffsetY={1}
              />
            )}
          </Group>
        );
      })}
    </TileShell>
  );
});
