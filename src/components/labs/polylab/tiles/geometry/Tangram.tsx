'use client';

import React, { memo } from 'react';
import { Group, Line } from 'react-konva';
import { TileShell } from '../shared/TileShell';

export type TangramPieceType =
  | 'large-triangle-1'
  | 'large-triangle-2'
  | 'medium-triangle'
  | 'small-triangle-1'
  | 'small-triangle-2'
  | 'square'
  | 'parallelogram';

export interface TangramProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  pieceType?: TangramPieceType;
  fillColor?: string;
  unitSize?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

const TANGRAM_DEFS: Record<
  TangramPieceType,
  { points: (u: number) => number[]; defaultColor: string; width: (u: number) => number; height: (u: number) => number }
> = {
  'large-triangle-1': {
    points: (u) => [0, 0, 4 * u, 0, 2 * u, 2 * u],
    defaultColor: '#EF4444',
    width: (u) => 4 * u,
    height: (u) => 2 * u,
  },
  'large-triangle-2': {
    points: (u) => [0, 0, 0, 4 * u, 2 * u, 2 * u],
    defaultColor: '#3B82F6',
    width: (u) => 2 * u,
    height: (u) => 4 * u,
  },
  'medium-triangle': {
    points: (u) => [0, 0, 2 * u, 2 * u, 0, 2 * u],
    defaultColor: '#10B981',
    width: (u) => 2 * u,
    height: (u) => 2 * u,
  },
  'small-triangle-1': {
    points: (u) => [0, 0, 2 * u, 0, u, u],
    defaultColor: '#F59E0B',
    width: (u) => 2 * u,
    height: (u) => u,
  },
  'small-triangle-2': {
    points: (u) => [0, 0, 2 * u, 0, u, u],
    defaultColor: '#8B5CF6',
    width: (u) => 2 * u,
    height: (u) => u,
  },
  'square': {
    points: (u) => [u, 0, 2 * u, u, u, 2 * u, 0, u],
    defaultColor: '#EC4899',
    width: (u) => 2 * u,
    height: (u) => 2 * u,
  },
  'parallelogram': {
    points: (u) => [0, 0, 2 * u, 0, 3 * u, u, u, u],
    defaultColor: '#06B6D4',
    width: (u) => 3 * u,
    height: (u) => u,
  },
};

export const Tangram = memo(function Tangram({
  id,
  x,
  y,
  rotation = 0,
  pieceType = 'large-triangle-1',
  fillColor,
  unitSize = 32,
  width,
  height,
  scaleX = 1,
  scaleY = 1,
  isLocked = false,
  isSelected = false,
}: TangramProps) {
  const def = TANGRAM_DEFS[pieceType] || TANGRAM_DEFS['large-triangle-1'];
  const color = fillColor || def.defaultColor;

  const baseW = def.width(unitSize);
  const baseH = def.height(unitSize);

  const points = def.points(unitSize);

  return (
    <TileShell
      id={id} x={x} y={y} rotation={rotation}
      width={baseW} height={baseH}
      scaleX={scaleX} scaleY={scaleY}
      isLocked={isLocked} isSelected={isSelected}
    >
      <Group>
        <Line
          points={points}
          closed
          fill={color}
          stroke="#1E293B"
          strokeWidth={1.5}
          shadowColor="rgba(0, 0, 0, 0.12)"
          shadowBlur={5}
          shadowOffsetY={2}
        />
      </Group>
    </TileShell>
  );
});
