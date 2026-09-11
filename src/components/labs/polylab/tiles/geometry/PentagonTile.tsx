'use client';

import React, { memo } from 'react';
import { Group, Line } from 'react-konva';
import { TileShell } from '../shared/TileShell';

export type PentagonVariant =
  | 'cairo-pentagon'
  | 'hirschhorn-pentagon'
  | 'prismatic-pentagon'
  | 'floret-pentagon';

export interface PentagonTileProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  variant?: PentagonVariant;
  color?: string;
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const PentagonTile = memo(function PentagonTile({
  id,
  x,
  y,
  rotation = 0,
  variant = 'cairo-pentagon',
  color,
  width = 90,
  height = 90,
  isLocked = false,
  isSelected = false,
}: PentagonTileProps) {
  // 1. Cairo Pentagon (four 120° angles and one 90° angle)
  if (variant === 'cairo-pentagon') {
    const fillColor = color || '#0284C7';
    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={width} height={height} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          <Line
            points={[45, 10, 80, 35, 65, 80, 25, 80, 10, 35]}
            closed
            fill={fillColor}
            stroke="#1E1E28"
            strokeWidth={2.5}
          />
          <Line points={[45, 10, 45, 80]} stroke="#FFFFFF" strokeWidth={1} opacity={0.4} dash={[3, 3]} />
        </Group>
      </TileShell>
    );
  }

  // 2. Hirschhorn / Type 14 Pentagon
  if (variant === 'hirschhorn-pentagon') {
    const fillColor = color || '#D946EF';
    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={width} height={height} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          <Line
            points={[20, 10, 75, 20, 80, 65, 45, 80, 10, 50]}
            closed
            fill={fillColor}
            stroke="#1E1E28"
            strokeWidth={2.5}
          />
        </Group>
      </TileShell>
    );
  }

  // 3. Prismatic / Floret Pentagon
  const fillColor = color || '#F59E0B';
  return (
    <TileShell id={id} x={x} y={y} rotation={rotation} width={width} height={height} isLocked={isLocked} isSelected={isSelected}>
      <Group>
        <Line
          points={[45, 10, 82, 38, 68, 80, 22, 80, 8, 38]}
          closed
          fill={fillColor}
          stroke="#1E1E28"
          strokeWidth={2.5}
        />
      </Group>
    </TileShell>
  );
});
