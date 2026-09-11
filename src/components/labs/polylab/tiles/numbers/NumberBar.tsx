'use client';

import React, { memo } from 'react';
import { Group, Rect, Text, Line } from 'react-konva';
import { TileShell } from '../shared/TileShell';

const CUISENAIRE_COLORS: Record<number, { bg: string; text: string }> = {
  1: { bg: '#F1F5F9', text: '#0F172A' },
  2: { bg: '#EF4444', text: '#FFFFFF' },
  3: { bg: '#22C55E', text: '#FFFFFF' },
  4: { bg: '#A855F7', text: '#FFFFFF' },
  5: { bg: '#EAB308', text: '#0F172A' },
  6: { bg: '#15803D', text: '#FFFFFF' },
  7: { bg: '#334155', text: '#FFFFFF' },
  8: { bg: '#92400E', text: '#FFFFFF' },
  9: { bg: '#3B82F6', text: '#FFFFFF' },
  10: { bg: '#F97316', text: '#FFFFFF' },
};

export interface NumberBarProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  value?: number;
  unitWidth?: number;
  height?: number;
  showNumbers?: boolean;
  showTicks?: boolean;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const NumberBar = memo(function NumberBar({
  id,
  x,
  y,
  rotation = 0,
  value = 5,
  unitWidth = 30,
  height = 36,
  showNumbers = true,
  showTicks = true,
  isLocked = false,
  isSelected = false,
}: NumberBarProps) {
  const safeVal = Math.max(1, Math.min(20, Math.round(value)));
  const totalWidth = safeVal * unitWidth;
  const colorTheme = CUISENAIRE_COLORS[safeVal] || { bg: '#0284C7', text: '#FFFFFF' };

  return (
    <TileShell
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      width={totalWidth}
      height={height}
      isLocked={isLocked}
      isSelected={isSelected}
    >
      <Rect
        x={0}
        y={0}
        width={totalWidth}
        height={height}
        fill={colorTheme.bg}
        cornerRadius={6}
        stroke="#475569"
        strokeWidth={1}
        shadowColor="rgba(0, 0, 0, 0.08)"
        shadowBlur={6}
        shadowOffsetY={2}
      />

      {/* Unit dividing lines */}
      {showTicks &&
        Array.from({ length: safeVal - 1 }).map((_, i) => {
          const tickX = (i + 1) * unitWidth;
          return (
            <Line
              key={i}
              points={[tickX, 0, tickX, height]}
              stroke="rgba(0, 0, 0, 0.15)"
              strokeWidth={1}
              dash={[2, 2]}
            />
          );
        })}

      {/* Rod Value label */}
      {showNumbers && (
        <Text
          x={0}
          y={height / 2 - 8}
          width={totalWidth}
          text={String(safeVal)}
          align="center"
          fontSize={14}
          fontStyle="bold"
          fontFamily="Inter, system-ui, sans-serif"
          fill={colorTheme.text}
          listening={false}
        />
      )}
    </TileShell>
  );
});
