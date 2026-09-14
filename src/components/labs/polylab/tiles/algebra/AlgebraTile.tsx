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
  | 'xy'
  | '-xy'
  | 'y2'
  | '-y2';

export interface AlgebraTileProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  variant?: AlgebraTileType;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

// Base reference sizes (unit = 34px)
const BASE: Record<AlgebraTileType, { label: string; w: number; h: number; fill: string }> = {
  '1':   { label: '1',   w: 34,  h: 34,  fill: '#F59E0B' },
  '-1':  { label: '−1',  w: 34,  h: 34,  fill: '#BE123C' },
  'x':   { label: 'x',   w: 34,  h: 96,  fill: '#16A34A' },
  '-x':  { label: '−x',  w: 34,  h: 96,  fill: '#BE123C' },
  'x2':  { label: 'x²',  w: 96,  h: 96,  fill: '#2563EB' },
  '-x2': { label: '−x²', w: 96,  h: 96,  fill: '#BE123C' },
  'y':   { label: 'y',   w: 34,  h: 120, fill: '#0891B2' },
  '-y':  { label: '−y',  w: 34,  h: 120, fill: '#BE123C' },
  'xy':  { label: 'xy',  w: 96,  h: 120, fill: '#4F46E5' },
  '-xy': { label: '−xy', w: 96,  h: 120, fill: '#BE123C' },
  'y2':  { label: 'y²',  w: 120, h: 120, fill: '#9333EA' },
  '-y2': { label: '−y²', w: 120, h: 120, fill: '#BE123C' },
};

export const AlgebraTile = memo(function AlgebraTile({
  id,
  x,
  y,
  rotation = 0,
  variant = 'x',
  width,
  height,
  scaleX = 1,
  scaleY = 1,
  isLocked = false,
  isSelected = false,
}: AlgebraTileProps) {
  const conf = BASE[variant] ?? BASE['x'];
  // Always draw in base coordinate space — outer TileShell scaleX/scaleY handles resize
  const baseW = conf.w;
  const baseH = conf.h;

  // Font size scales with the smaller dimension
  const minDim = Math.min(baseW, baseH);
  const fontSize = Math.max(8, Math.min(18, minDim * 0.22));

  return (
    <TileShell
      id={id}
      x={x}
      y={y}
      rotation={rotation}
      width={baseW}
      height={baseH}
      scaleX={scaleX}
      scaleY={scaleY}
      isLocked={isLocked}
      isSelected={isSelected}
    >
      <Rect
        x={0}
        y={0}
        width={baseW}
        height={baseH}
        fill={conf.fill}
        stroke="#FFFFFF"
        strokeWidth={1.5}
        cornerRadius={3}
        shadowColor="rgba(0, 0, 0, 0.15)"
        shadowBlur={4}
      />
      <Text
        x={0}
        y={baseH / 2 - fontSize * 0.7}
        width={baseW}
        text={conf.label}
        align="center"
        fontSize={fontSize}
        fontStyle="italic bold"
        fontFamily="Georgia, serif"
        fill="#FFFFFF"
        listening={false}
      />
    </TileShell>
  );
});
