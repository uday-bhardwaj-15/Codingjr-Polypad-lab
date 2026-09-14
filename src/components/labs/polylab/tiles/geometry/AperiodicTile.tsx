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
  scaleX?: number;
  scaleY?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

// All shapes drawn in a 90x90 coordinate space
const BASE = 90;

export const AperiodicTile = memo(function AperiodicTile({
  id,
  x,
  y,
  rotation = 0,
  variant = 'penrose-kite',
  color,
  width = BASE,
  height = BASE,
  scaleX = 1,
  scaleY = 1,
  isLocked = false,
  isSelected = false,
}: AperiodicTileProps) {
  let shape: React.ReactNode;

  if (variant === 'penrose-kite') {
    shape = (
      <>
        <Line points={[45, 5, 80, 38, 45, 85, 10, 38]} closed fill={color || '#3B82F6'} stroke="#1E1E28" strokeWidth={2.5} />
        <Line points={[25, 20, 65, 20]} stroke="#FFFFFF" strokeWidth={2} opacity={0.6} lineCap="round" />
      </>
    );
  } else if (variant === 'penrose-dart') {
    shape = (
      <>
        <Line points={[45, 10, 80, 80, 45, 55, 10, 80]} closed fill={color || '#EC4899'} stroke="#1E1E28" strokeWidth={2.5} />
        <Line points={[25, 70, 65, 70]} stroke="#FFFFFF" strokeWidth={2} opacity={0.6} lineCap="round" />
      </>
    );
  } else if (variant === 'einstein-hat') {
    shape = (
      <>
        <Line
          points={[20, 15, 45, 10, 65, 25, 85, 20, 75, 50, 80, 75, 60, 80, 45, 65, 30, 80, 15, 65, 25, 45, 10, 35]}
          closed fill={color || '#10B981'} stroke="#1E1E28" strokeWidth={2.5}
        />
        <Line points={[35, 35, 65, 55]} stroke="#FFFFFF" strokeWidth={2} opacity={0.5} />
      </>
    );
  } else {
    shape = (
      <>
        <Line points={[45, 10, 80, 45, 45, 80, 10, 45]} closed fill={color || '#F59E0B'} stroke="#1E1E28" strokeWidth={2.5} />
        <Line points={[25, 25, 65, 65]} stroke="#FFFFFF" strokeWidth={1.5} opacity={0.5} />
      </>
    );
  }

  return (
    <TileShell id={id} x={x} y={y} rotation={rotation} width={BASE} height={BASE} scaleX={scaleX} scaleY={scaleY} isLocked={isLocked} isSelected={isSelected}>
      <Group>
        {shape}
      </Group>
    </TileShell>
  );
});
