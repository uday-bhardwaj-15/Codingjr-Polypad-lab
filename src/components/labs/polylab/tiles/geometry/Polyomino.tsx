'use client';

import React, { memo } from 'react';
import { Group, Rect, Path, Line } from 'react-konva';
import { TileShell } from '../shared/TileShell';

export type PolyominoVariant =
  | 'pentominoes-set'
  | 'tetrominoes-set'
  | 'tetromino-T'
  | 'tetromino-L'
  | 'tetromino-I'
  | 'tetromino-O'
  | 'tetromino-Z'
  | 'tetromino-S'
  | 'tetromino-J'
  | 'tetromino-skew'
  | 'pentomino-F'
  | 'pentomino-I'
  | 'pentomino-L'
  | 'pentomino-N'
  | 'pentomino-P'
  | 'pentomino-T'
  | 'pentomino-U'
  | 'pentomino-V'
  | 'pentomino-W'
  | 'pentomino-X'
  | 'pentomino-Y'
  | 'pentomino-Z';

export interface PolyominoProps {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  variant?: string;
  color?: string;
  pathData?: string;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  isLocked?: boolean;
  isSelected?: boolean;
}

// Each piece: path drawn in its own coordinate space (defaultW × defaultH)
const PIECE_PATHS: Record<string, { path: string; color: string; defaultW: number; defaultH: number }> = {
  // ─── Tetrominoes ─────────────────────────────────────────
  'tetromino-T': {
    path: 'M 0,0 L 90,0 L 90,30 L 60,30 L 60,60 L 30,60 L 30,30 L 0,30 Z',
    color: '#DB2777', defaultW: 90, defaultH: 60,
  },
  'tetromino-L': {
    path: 'M 0,0 L 30,0 L 30,60 L 60,60 L 60,90 L 0,90 Z',
    color: '#0284C7', defaultW: 60, defaultH: 90,
  },
  'tetromino-J': {
    path: 'M 30,0 L 60,0 L 60,90 L 0,90 L 0,60 L 30,60 Z',
    color: '#EA580C', defaultW: 60, defaultH: 90,
  },
  'tetromino-O': {
    path: 'M 0,0 L 60,0 L 60,60 L 0,60 Z',
    color: '#EA580C', defaultW: 60, defaultH: 60,
  },
  'tetromino-Z': {
    path: 'M 0,0 L 40,0 L 40,25 L 60,25 L 60,50 L 20,50 L 20,25 L 0,25 Z',
    color: '#16A34A', defaultW: 60, defaultH: 50,
  },
  'tetromino-S': {
    path: 'M 20,0 L 60,0 L 60,25 L 40,25 L 40,50 L 0,50 L 0,25 L 20,25 Z',
    color: '#7C3AED', defaultW: 60, defaultH: 50,
  },
  'tetromino-I': {
    path: 'M 0,0 L 120,0 L 120,30 L 0,30 Z',
    color: '#7C3AED', defaultW: 120, defaultH: 30,
  },
  'tetromino-skew': {
    path: 'M 0,0 L 60,0 L 60,30 L 90,30 L 90,60 L 30,60 L 30,30 L 0,30 Z',
    color: '#F59E0B', defaultW: 90, defaultH: 60,
  },

  // ─── Pentominoes ─────────────────────────────────────────
  'pentomino-F': {
    path: 'M 30,0 L 90,0 L 90,30 L 60,30 L 60,60 L 90,60 L 90,90 L 30,90 L 30,60 L 0,60 L 0,30 L 30,30 Z',
    color: '#0D9488', defaultW: 90, defaultH: 90,
  },
  'pentomino-I': {
    path: 'M 0,0 L 36,0 L 36,150 L 0,150 Z',
    color: '#7C3AED', defaultW: 36, defaultH: 150,
  },
  'pentomino-L': {
    path: 'M 0,0 L 36,0 L 36,36 L 72,36 L 72,72 L 0,72 Z',
    color: '#16A34A', defaultW: 72, defaultH: 72,
  },
  'pentomino-N': {
    path: 'M 30,0 L 60,0 L 60,60 L 90,60 L 90,90 L 30,90 L 30,60 L 0,60 L 0,30 L 30,30 Z',
    color: '#0284C7', defaultW: 90, defaultH: 90,
  },
  'pentomino-P': {
    path: 'M 0,0 L 60,0 L 60,60 L 30,60 L 30,90 L 0,90 Z',
    color: '#EA580C', defaultW: 60, defaultH: 90,
  },
  'pentomino-T': {
    path: 'M 0,0 L 90,0 L 90,30 L 60,30 L 60,60 L 60,90 L 30,90 L 30,30 L 0,30 Z',
    color: '#DB2777', defaultW: 90, defaultH: 90,
  },
  'pentomino-U': {
    path: 'M 0,0 L 30,0 L 30,30 L 60,30 L 60,0 L 90,0 L 90,90 L 60,90 L 60,60 L 30,60 L 30,90 L 0,90 Z',
    color: '#0284C7', defaultW: 90, defaultH: 90,
  },
  'pentomino-V': {
    path: 'M 0,0 L 30,0 L 30,60 L 90,60 L 90,90 L 0,90 Z',
    color: '#8B5CF6', defaultW: 90, defaultH: 90,
  },
  'pentomino-W': {
    path: 'M 0,0 L 30,0 L 30,30 L 60,30 L 60,60 L 90,60 L 90,90 L 30,90 L 30,60 L 0,60 Z',
    color: '#9333EA', defaultW: 90, defaultH: 90,
  },
  'pentomino-X': {
    path: 'M 36,0 L 72,0 L 72,36 L 108,36 L 108,72 L 72,72 L 72,108 L 36,108 L 36,72 L 0,72 L 0,36 L 36,36 Z',
    color: '#DB2777', defaultW: 108, defaultH: 108,
  },
  'pentomino-Y': {
    path: 'M 0,30 L 30,30 L 30,0 L 60,0 L 60,120 L 30,120 L 30,60 L 0,60 Z',
    color: '#F59E0B', defaultW: 60, defaultH: 120,
  },
  'pentomino-Z': {
    path: 'M 30,0 L 90,0 L 90,30 L 60,30 L 60,60 L 90,60 L 90,90 L 30,90 L 30,60 L 0,60 L 0,30 L 30,30 Z',
    color: '#F59E0B', defaultW: 90, defaultH: 90,
  },
};

export const Polyomino = memo(function Polyomino({
  id,
  x,
  y,
  rotation = 0,
  variant = 'pentominoes-set',
  color,
  pathData,
  width = 240,
  height = 120,
  scaleX = 1,
  scaleY = 1,
  isLocked = false,
  isSelected = false,
}: PolyominoProps) {
  // ── Pentominoes Set (composite illustration) ──────────────────────────────
  if (variant === 'pentominoes-set') {
    const w = 240, h = 120;
    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={w} height={h} scaleX={scaleX} scaleY={scaleY} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          <Rect x={0} y={0} width={w} height={h} fill="#141520" stroke="#1E1E28" strokeWidth={3} cornerRadius={2} />
          <Path data="M 6,6 L 42,6 L 42,42 L 24,42 L 24,114 L 6,114 Z" fill="#16A34A" stroke="#FFFFFF" strokeWidth={2} />
          <Path data="M 42,6 L 114,6 L 114,42 L 78,42 L 78,78 L 42,78 Z" fill="#0284C7" stroke="#FFFFFF" strokeWidth={2} />
          <Path data="M 114,6 L 150,6 L 150,78 L 114,78 Z" fill="#7C3AED" stroke="#FFFFFF" strokeWidth={2} />
          <Path data="M 150,6 L 186,6 L 186,42 L 234,42 L 234,78 L 186,78 L 186,114 L 150,114 Z" fill="#DB2777" stroke="#FFFFFF" strokeWidth={2} />
          <Path data="M 186,6 L 234,6 L 234,42 L 186,42 Z" fill="#EA580C" stroke="#FFFFFF" strokeWidth={2} />
          <Path data="M 186,42 L 234,42 L 234,114 L 186,114 L 186,78 Z" fill="#F59E0B" stroke="#FFFFFF" strokeWidth={2} />
          <Path data="M 6,78 L 114,78 L 114,114 L 6,114 Z" fill="#0D9488" stroke="#FFFFFF" strokeWidth={2} />
          <Path data="M 114,78 L 150,78 L 150,114 L 114,114 Z" fill="#9333EA" stroke="#FFFFFF" strokeWidth={2} />
        </Group>
      </TileShell>
    );
  }

  // ── Tetrominoes Set ───────────────────────────────────────────────────────
  if (variant === 'tetrominoes-set') {
    const w = 180, h = 135;
    return (
      <TileShell id={id} x={x} y={y} rotation={rotation} width={w} height={h} scaleX={scaleX} scaleY={scaleY} isLocked={isLocked} isSelected={isSelected}>
        <Group>
          <Rect x={0} y={0} width={w} height={h} fill="#141520" stroke="#1E1E28" strokeWidth={3} cornerRadius={2} />
          <Path data="M 15,10 L 105,10 L 105,45 L 75,45 L 75,80 L 45,80 L 45,45 L 15,45 Z" fill="#DB2777" stroke="#FFFFFF" strokeWidth={2} />
          <Path data="M 105,10 L 165,10 L 165,80 L 135,80 L 135,45 L 105,45 Z" fill="#0284C7" stroke="#FFFFFF" strokeWidth={2} />
          <Path data="M 105,55 L 165,55 L 165,115 L 105,115 Z" fill="#EA580C" stroke="#FFFFFF" strokeWidth={2} />
          <Path data="M 15,55 L 65,55 L 65,115 L 35,115 L 35,85 L 15,85 Z" fill="#16A34A" stroke="#FFFFFF" strokeWidth={2} />
          <Path data="M 45,85 L 165,85 L 165,120 L 45,120 Z" fill="#7C3AED" stroke="#FFFFFF" strokeWidth={2} />
        </Group>
      </TileShell>
    );
  }

  // ── Individual Tetromino / Pentomino Piece ────────────────────────────────
  const pieceDef = PIECE_PATHS[variant];
  const activePath = pathData || pieceDef?.path;
  const activeColor = color || pieceDef?.color || '#3B82F6';
  const baseW = pieceDef?.defaultW || 60;
  const baseH = pieceDef?.defaultH || 60;
  // Use base dimensions — PolyLabStage's scaleX/scaleY handles resize
  return (
    <TileShell
      id={id} x={x} y={y} rotation={rotation}
      width={baseW} height={baseH}
      scaleX={scaleX} scaleY={scaleY}
      isLocked={isLocked} isSelected={isSelected}
    >
      <Group>
        {activePath ? (
          <Path
            data={activePath}
            fill={activeColor}
            stroke="#FFFFFF"
            strokeWidth={2}
            shadowColor="rgba(0,0,0,0.2)"
            shadowBlur={4}
          />
        ) : (
          <Rect x={0} y={0} width={baseW} height={baseH} fill={activeColor} stroke="#1E1E28" strokeWidth={2} cornerRadius={3} />
        )}
      </Group>
    </TileShell>
  );
});
