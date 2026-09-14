'use client';

import React, { memo } from 'react';
import { Group, Line, Text, Circle, Arrow } from 'react-konva';
import { TileShell } from '../shared/TileShell';

export interface NumberLineProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  min?: number;
  max?: number;
  step?: number;
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const NumberLine = memo(function NumberLine({
  id,
  x,
  y,
  rotation = 0,
  min = 0,
  max = 10,
  step = 1,
  width = 360,
  height = 80,
  isLocked = false,
  isSelected = false,
}: NumberLineProps) {
  const intrinsicW = 360;
  const intrinsicH = 80;

  const lineY = intrinsicH / 2;
  const paddingX = 24;
  const availableWidth = intrinsicW - paddingX * 2;
  const range = Math.max(1, max - min);
  const totalSteps = Math.floor(range / step);

  return (
    <TileShell
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      width={intrinsicW}
      height={intrinsicH}
      isLocked={isLocked}
      isSelected={isSelected}
    >
      {/* Main Axis with Arrows */}
      <Arrow
        points={[paddingX, lineY, intrinsicW - paddingX, lineY]}
        pointerLength={8}
        pointerWidth={8}
        fill="#1E293B"
        stroke="#1E293B"
        strokeWidth={2.5}
      />
      {/* Left Arrow head */}
      <Arrow
        points={[intrinsicW - paddingX, lineY, paddingX, lineY]}
        pointerLength={8}
        pointerWidth={8}
        fill="#1E293B"
        stroke="#1E293B"
        strokeWidth={2.5}
      />

      {/* Ticks and Number labels */}
      {Array.from({ length: totalSteps + 1 }).map((_, i) => {
        const val = min + i * step;
        const tickX = paddingX + (i / totalSteps) * availableWidth;

        return (
          <Group key={i} x={tickX} y={lineY}>
            {/* Major Tick */}
            <Line
              points={[0, -10, 0, 10]}
              stroke="#1E293B"
              strokeWidth={2}
            />
            {/* Label below tick */}
            <Text
              x={-20}
              y={14}
              width={40}
              text={String(val)}
              align="center"
              fontSize={12}
              fontStyle="bold"
              fontFamily="Inter, system-ui, sans-serif"
              fill="#334155"
              listening={false}
            />
          </Group>
        );
      })}
    </TileShell>
  );
});
