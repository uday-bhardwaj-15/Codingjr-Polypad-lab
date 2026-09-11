'use client';

import React, { memo } from 'react';
import { Group, Line, Path } from 'react-konva';
import { TileShell } from '../shared/TileShell';

export type AperiodicVariant =
  | 'penrose-kite'
  | 'penrose-dart'
  | 'penrose-thick-rhomb'
  | 'penrose-thin-rhomb'
  | 'einstein-hat';

export interface AperiodicTileProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  variant?: AperiodicVariant;
  color?: string;
  width?: number;
  height?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

export const AperiodicTile = memo(function AperiodicTile({
  id,
  x,
  y,
  rotation = 0,
  variant = 'penrose-kite',
  color,
  width = 90,
  height = 90,
  isLocked = false,
  isSelected = false,
}: AperiodicTileProps) {
  // 1. Penrose Kite
  if (variant === 'penrose-kite') {
    const fillColor = color || '#3B82F6';
    const points = [45, 10, 80, 45, 45, 80, 10, 45];
    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={width} height={height} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          <Line
            points={[45, 5, 80, 38, 45, 85, 10, 38]}
            closed
            fill={fillColor}
            stroke="#1E1E28"
            strokeWidth={2.5}
          />
          {/* Matching arc decoration */}
          <Line points={[25, 20, 65, 20]} stroke="#FFFFFF" strokeWidth={2} opacity={0.6} lineCap="round" />
        </Group>
      </TileShell>
    );
  }

  // 2. Penrose Dart
  if (variant === 'penrose-dart') {
    const fillColor = color || '#EC4899';
    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={width} height={height} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          <Line
            points={[45, 10, 80, 80, 45, 55, 10, 80]}
            closed
            fill={fillColor}
            stroke="#1E1E28"
            strokeWidth={2.5}
          />
          <Line points={[25, 70, 65, 70]} stroke="#FFFFFF" strokeWidth={2} opacity={0.6} lineCap="round" />
        </Group>
      </TileShell>
    );
  }

  // 3. Einstein "Hat" Monotile
  if (variant === 'einstein-hat') {
    const fillColor = color || '#10B981';
    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={width} height={height} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          {/* 13-sided Hat monotile polygon */}
          <Line
            points={[
              20, 15, 45, 10, 65, 25, 85, 20, 75, 50, 80, 75,
              60, 80, 45, 65, 30, 80, 15, 65, 25, 45, 10, 35
            ]}
            closed
            fill={fillColor}
            stroke="#1E1E28"
            strokeWidth={2.5}
          />
          <Line points={[35, 35, 65, 55]} stroke="#FFFFFF" strokeWidth={2} opacity={0.5} />
        </Group>
      </TileShell>
    );
  }

  // 4. Penrose Thick / Thin Rhombus
  const fillColor = color || '#F59E0B';
  return (
    <TileShell id={id} x={x} y={y} rotation={rotation} width={width} height={height} isLocked={isLocked} isSelected={isSelected}>
      <Group>
        <Line
          points={[45, 10, 80, 45, 45, 80, 10, 45]}
          closed
          fill={fillColor}
          stroke="#1E1E28"
          strokeWidth={2.5}
        />
        <Line points={[25, 25, 65, 65]} stroke="#FFFFFF" strokeWidth={1.5} opacity={0.5} />
      </Group>
    </TileShell>
  );
});
