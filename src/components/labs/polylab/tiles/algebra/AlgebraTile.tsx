'use client';

import React, { memo } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { TileShell } from '../shared/TileShell';

export type AlgebraTileType =
  | '1'
  | '-1'
  | 'x'
  | '-x'
  | 'x2'
  | '-x2'
  | 'y'
  | '-y'
  | 'xy';

export interface AlgebraTileProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  variant?: AlgebraTileType;
  isLocked?: boolean;
  isSelected?: boolean;
}

const ALGEBRA_CONFIGS: Record<
  AlgebraTileType,
  { label: string; width: number; height: number; fill: string; stroke: string }
> = {
  '1': { label: '1', width: 34, height: 34, fill: '#EAB308', stroke: '#CA8A04' }, // Yellow
  '-1': { label: '-1', width: 34, height: 34, fill: '#EF4444', stroke: '#DC2626' }, // Red
  'x': { label: 'x', width: 34, height: 96, fill: '#3B82F6', stroke: '#2563EB' }, // Blue
  '-x': { label: '-x', width: 34, height: 96, fill: '#EF4444', stroke: '#DC2626' }, // Red
  'x2': { label: 'x²', width: 96, height: 96, fill: '#10B981', stroke: '#059669' }, // Green
  '-x2': { label: '-x²', width: 96, height: 96, fill: '#EF4444', stroke: '#DC2626' }, // Red
  'y': { label: 'y', width: 34, height: 120, fill: '#8B5CF6', stroke: '#7C3AED' }, // Purple
  '-y': { label: '-y', width: 34, height: 120, fill: '#EF4444', stroke: '#DC2626' }, // Red
  'xy': { label: 'xy', width: 96, height: 120, fill: '#06B6D4', stroke: '#0891B2' }, // Cyan
};

export const AlgebraTile = memo(function AlgebraTile({
  id,
  x,
  y,
  rotation = 0,
  variant = 'x',
  isLocked = false,
  isSelected = false,
}: AlgebraTileProps) {
  const conf = ALGEBRA_CONFIGS[variant] || ALGEBRA_CONFIGS['x'];

  return (
    <TileShell
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      width={conf.width}
      height={conf.height}
      isLocked={isLocked}
      isSelected={isSelected}
    >
      <Rect
        x={0}
        y={0}
        width={conf.width}
        height={conf.height}
        fill={conf.fill}
        stroke={conf.stroke}
        strokeWidth={1.5}
        cornerRadius={4}
        shadowColor="rgba(0, 0, 0, 0.1)"
        shadowBlur={6}
        shadowOffsetY={2}
      />
      <Text
        x={0}
        y={conf.height / 2 - 8}
        width={conf.width}
        text={conf.label}
        align="center"
        fontSize={14}
        fontStyle="bold"
        fontFamily="Inter, system-ui, sans-serif"
        fill="#FFFFFF"
        listening={false}
      />
    </TileShell>
  );
});
