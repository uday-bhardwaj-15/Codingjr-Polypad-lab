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
  scaleX?: number;
  scaleY?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

// All shapes drawn in a 90×90 base coordinate space
const BASE = 90;

export const PentagonTile = memo(function PentagonTile({
  id,
  x,
  y,
  rotation = 0,
  variant = 'cairo-pentagon',
  color,
  width = BASE,
  height = BASE,
  scaleX = 1,
  scaleY = 1,
  isLocked = false,
  isSelected = false,
}: PentagonTileProps) {
  let points: number[];
  let dashLine: number[] | null = null;
  const fillColor = color || (variant === 'cairo-pentagon' ? '#0284C7' : variant === 'hirschhorn-pentagon' ? '#D946EF' : '#F59E0B');

  if (variant === 'cairo-pentagon') {
    points = [45, 10, 80, 35, 65, 80, 25, 80, 10, 35];
    dashLine = [45, 10, 45, 80];
  } else if (variant === 'hirschhorn-pentagon') {
    points = [20, 10, 75, 20, 80, 65, 45, 80, 10, 50];
  } else {
    points = [45, 10, 82, 38, 68, 80, 22, 80, 8, 38];
  }

  return (
    <TileShell id={id} x={x} y={y} rotation={rotation} width={BASE} height={BASE} scaleX={scaleX} scaleY={scaleY} isLocked={isLocked} isSelected={isSelected}>
      <Group>
        <Line points={points} closed fill={fillColor} stroke="#1E1E28" strokeWidth={2.5} />
        {dashLine && <Line points={dashLine} stroke="#FFFFFF" strokeWidth={1} opacity={0.4} dash={[3, 3]} />}
      </Group>
    </TileShell>
  );
});
